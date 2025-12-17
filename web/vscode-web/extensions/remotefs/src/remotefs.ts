/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  Disposable,
  Event,
  EventEmitter,
  FileChangeEvent,
  FileChangeType,
  FileStat,
  FileSystemError,
  FileSystemProvider,
  FileType,
  Uri,
  workspace,
} from 'vscode';
import axios from 'axios';

export class FileEntry implements FileStat {

  name: string;
  type: FileType;
  ctime: number;
  mtime: number;
  size: number;
  entries: Array<FileEntry>; // directory entries

  constructor(public uri: Uri, name: string) {
    this.name = name;
    this.type = FileType.File;
    this.ctime = Date.now();
    this.mtime = Date.now();
    this.size = 0;
    this.entries = [];
  }
}

const decoder = new TextDecoder('utf-8');

export class RemoteFS implements FileSystemProvider {
  static scheme = 'remotefs';

  private readonly apiAxios;
  private readonly statCache: Record<string, FileStat> = Object.create(null);


  constructor(serverURL: string) {
    const apiURL = serverURL.replace(/\/$/, '');
    this.apiAxios = axios.create({
      baseURL: apiURL,
      validateStatus: () => true,
    });

  }

  updateServerURL(newURL: string) {
    this.apiAxios.defaults.baseURL = newURL.replace(/\/$/, '');
  }

  // --- manage file metadata

  async stat(uri: Uri): Promise<FileStat> {
    console.log('stat', uri.toString());
    const path = uri.path.substring(1); // remove leading /
    const response = await this.apiAxios.get(`/stat?path=${path}`);
    if (response.status !== 200) {
      throw this.mapError(response.status, response.data);
    }
    const respData = response.data;
    if (!respData || !respData.data) {
      throw new FileSystemError()
    }
    const data = respData.data;
    const stat: FileStat = {
      type: data.type as FileType,
      ctime: data.ctime,
      mtime: data.mtime,
      size: data.size,
    };
    this.statCache[uri.toString()] = data;
    return stat;
  }

  async readDirectory(uri: Uri): Promise<[string, FileType][]> {
    const fileStat = this.statCache[uri.toString()];
    if (fileStat && fileStat.type !== FileType.Directory) {
      throw FileSystemError.FileNotADirectory(uri);
    }
    console.log('readDirectory', uri.toString());
    const path = uri.path.substring(1);
    const response = await this.apiAxios.get(`/stat?path=${path}`);
    if (response.status < 200 || response.status >= 300) {
      throw this.mapError(response.status, response.data);
    }
    const repsData = response.data;
    if (!repsData || !repsData.data) {
      throw FileSystemError.Unavailable(uri)
    }
    const dirStat: FileEntry = repsData.data;
    if (dirStat.type !== FileType.Directory) {
      throw FileSystemError.FileNotADirectory(uri);
    }
    return dirStat.entries.map(item => [item.name, item.type] as [string, FileType]);
  }

  // --- manage file contents

  async readFile(uri: Uri): Promise<Uint8Array> {
    const fileStat = this.statCache[uri.toString()];
    if (fileStat && fileStat.type === FileType.Directory) {
      throw FileSystemError.FileIsADirectory(uri);
    }
    const filteredExtensions = ["jar", "so", "mca", "zip", "rar", "gz", "pack"];
    if (filteredExtensions.some(ext => uri.path.endsWith(`.${ext}`))) {
      return new Uint8Array([0x50,0x4b,0x03,0x04,0x14,0x00,0x08,0x08,0x08,0x00,0x1a,0x8d,0x93,0x4e,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x09,0x00,0x04,0x00,0x4d,0x45,0x54,0x41,0x2d,0x49,0x4e,0x46,0x2f,0xfe,0xca,0x00,0x00,0x03,0x00,0x50,0x4b,0x07,0x08,0x00,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x50,0x4b,0x03,0x04,0x14,0x00,0x08,0x08,0x08,0x00,0x19,0x8d,0x93,0x4e,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x14,0x00,0x00,0x00,0x4d,0x45,0x54,0x41,0x2d,0x49,0x4e,0x46,0x2f]); // dummy data
    }
    console.log('readFile', uri.toString());
    const path = uri.path.substring(1);
    const response = await this.apiAxios.get(`/files/${path}?raw=true`, {
      responseType: 'arraybuffer',
    });
    if (response.status !== 200) {
      throw this.mapError(response.status, response.data);
    }
    return new Uint8Array(response.data);
  }

  async writeFile(uri: Uri, content: Uint8Array, options: { create: boolean, overwrite: boolean }): Promise<void> {
    console.log('writeFile', uri.toString());
    const path = uri.path.substring(1);
    const parts = path.split('/');
    const fileName = parts.pop() || '';

    const buffer = new ArrayBuffer(content.byteLength);
    new Uint8Array(buffer).set(content);

    if (options.create) {
      // if create, use POST to create empty file or upload file to parent directory path
      const parent = parts.join('/');
      let response;
      if (content.length > 0) {
        const form = new FormData();
        form.append('file', new Blob([buffer]), fileName);
        if (options.overwrite) {
          form.set('overwrite', 'true');
        }
        response = await this.apiAxios.post(parent, form);
      } else {
        const body: any = { path: fileName, type: 'file' };
        if (options.overwrite) {
          body.overwrite = true;
        }
        response = await this.apiAxios.post(`/files/${parent}`, body, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (response.status !== axios.HttpStatusCode.Created) {
      throw this.mapError(response.status, response.data);
      }
      return this._fireSoon({ type: FileChangeType.Created, uri });
    }

    // default, use PUT to write content to file path
    const response = await this.apiAxios.put(`/files/${path}`, buffer, {
      headers: { 'Content-Type': 'application/octet-stream' },
    });
    if (response.status !== 201) {
      throw this.mapError(response.status, response.data);
    }
    return this._fireSoon({ type: FileChangeType.Changed, uri });
  }

  // --- manage files/folders

  async rename(oldUri: Uri, newUri: Uri, options: { overwrite: boolean }): Promise<void> {
    const oldPath = oldUri.path.substring(1);
    const newName = newUri.path.substring(1);
    const response = await this.apiAxios.patch(`/files/${oldPath}`, { newPath: newName, overwrite: options.overwrite }, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status !== 200) {
      throw this.mapError(response.status, response.data);
    }
    this._fireSoon(
      { type: FileChangeType.Deleted, uri: oldUri },
      { type: FileChangeType.Changed, uri: newUri }
    );
  }

  async delete(uri: Uri, opts: { recursive: boolean, useTrash: boolean }): Promise<void> {
    const path = uri.path.substring(1);
    const response = await this.apiAxios.delete(`/files/${path}`, {
      params: { recursive: opts.recursive },
    });
    if (response.status !== 200) {
      throw this.mapError(response.status, response.data);
    }
    this._fireSoon({ uri, type: FileChangeType.Deleted });
  }

  async createDirectory(uri: Uri): Promise<void> {
    const basename = this._basename(uri.path);
    const parent = this._dirname(uri.path);
    const body = { path: basename, type: 'directory' };
    const response = await this.apiAxios.post(`/files/${parent}`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status !== 201) {
      throw this.mapError(response.status, response.data);
    }
    this._fireSoon({ type: FileChangeType.Created, uri });
  }

  // --- manage file events

  private _emitter = new EventEmitter<FileChangeEvent[]>();
  private _bufferedEvents: FileChangeEvent[] = [];
  private _fireSoonHandle?: any;

  readonly onDidChangeFile: Event<FileChangeEvent[]> = this._emitter.event;

  watch(_resource: Uri): Disposable {
    // ignore, fires for all changes...
    return new Disposable(() => { });
  }

  private _fireSoon(...events: FileChangeEvent[]): void {
    this._bufferedEvents.push(...events);

    if (this._fireSoonHandle) {
      clearTimeout(this._fireSoonHandle);
    }

    this._fireSoonHandle = setTimeout(() => {
      this._emitter.fire(this._bufferedEvents);
      this._bufferedEvents.length = 0;
    }, 5);
  }

  private mapError(status: number, respData: any): Error {
    let error;
    if (respData instanceof ArrayBuffer) {
      const jsonData = JSON.parse(decoder.decode(respData));
      error = jsonData?.error;
    } else {
      error = respData?.error;
    }

    const reason = error?.reason ?? '';

    switch (reason) {
      case 'FILE_EXISTS':
        return FileSystemError.FileExists();
      case 'FILE_NOT_FOUND':
        return FileSystemError.FileNotFound();
      case 'FILE_IS_DIRECTORY':
        return FileSystemError.FileIsADirectory();
      case 'NO_PERMISSIONS':
        return FileSystemError.NoPermissions();
    }

    if (status === 500) {
      return new Error('Internal server error');
    }

    const message = error?.message ?? 'Unknown error';
    return new Error(message);
  }

  // --- path utils
  private _basename(path: string): string {
    path = this._rtrim(path, '/');
    if (!path) {
      return '';
    }

    return path.substring(path.lastIndexOf('/') + 1);
  }

  private _dirname(path: string): string {
    path = this._rtrim(path, '/');
    if (!path) {
      return '/';
    }

    return path.substring(0, path.lastIndexOf('/'));
  }

  private _rtrim(haystack: string, needle: string): string {
    if (!haystack || !needle) {
      return haystack;
    }

    const needleLen = needle.length,
      haystackLen = haystack.length;

    if (needleLen === 0 || haystackLen === 0) {
      return haystack;
    }

    let offset = haystackLen,
      idx = -1;

    while (true) {
      idx = haystack.lastIndexOf(needle, offset - 1);
      if (idx === -1 || idx + needleLen !== offset) {
        break;
      }
      if (idx === 0) {
        return '';
      }
      offset = idx;
    }

    return haystack.substring(0, offset);
  }
}
