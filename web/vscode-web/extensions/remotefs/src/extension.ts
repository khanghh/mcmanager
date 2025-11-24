/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//
// ############################################################################
//
//						! USED FOR RUNNING VSCODE OUT OF SOURCES FOR WEB !
//										! DO NOT REMOVE !
//
// ############################################################################
//

import * as vscode from 'vscode';
import { RemoteFS } from './remotefs';

declare const navigator: unknown;

export function activate(context: vscode.ExtensionContext) {
  if (typeof navigator === 'object') {	// do not run under node.js
    // Get configuration settings for the extension
    const defaultAPIURL = 'http://localhost:3000/api/fs';
    const config = vscode.workspace.getConfiguration('remotefs');
    const serverURL = config.get<string>('serverURL', defaultAPIURL);
    console.log('RemoteFS server URL:', serverURL);

    // Initialize RemoteFS with the configured server URL
    const remoteFs = enableFs(context, serverURL);

    // Listen for configuration changes
    context.subscriptions.push(
      vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('remotefs')) {
          const updatedConfig = vscode.workspace.getConfiguration('remotefs');
          const newServerURL = updatedConfig.get<string>('serverURL', defaultAPIURL);
          console.log('RemoteFS server URL:', newServerURL);
          remoteFs.updateServerURL(newServerURL);
        }
      })
    );
  }
  context.messagePassingProtocol?.postMessage({ type: "ready" });
}

function enableFs(context: vscode.ExtensionContext, serverURL: string): RemoteFS {
  const remoteFs = new RemoteFS(serverURL);
  context.subscriptions.push(remoteFs);

  return remoteFs;
}
