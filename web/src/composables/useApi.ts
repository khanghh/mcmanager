import axios, { AxiosError } from 'axios'

export type ApiError = {
  code: number
  message: string
}

export type ApiResponse<T> = {
  apiVersion?: string
  data?: T
  error?: {
    code?: number
    message?: string
  }
}

export type ServerStatus = 'running' | 'stopping' | 'stopped' | 'unknown'

export type ServerInfo = {
  name: string
  version: string
  tps: Array<number>
  playersOnline: number
  playersMax: number
}

export type ServerState = {
  status: ServerStatus
  tps: number
  pid?: number
  ipAddress?: string
  memoryUsage?: number
  memoryLimit?: number
  cpuUsage?: number
  cpuLimit?: number
  uptimeSec?: number
  diskUsage?: number
  diskSize?: number
  server?: ServerInfo
}

export type CommandRequest = {
  command: string
}

function unwrapApiResponse<T>(resData: ApiResponse<T>): T {
  if (resData.error) {
    throw new Error(resData.error.message || 'API error')
  }
  if (resData.data === undefined) {
    throw new Error('Malformed API response: missing data')
  }
  return resData.data
}

function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<ApiResponse<unknown>>
    const code = e.response?.data?.error?.code ?? 0
    const msg = e.response?.data?.error?.message || e.message || 'Request failed'
    return { code, message: msg }
  }
  return { code: 0, message: (err as Error)?.message || 'Unknown error' }
}

export function useApi() {
  const client = axios.create({
    baseURL: '/api',
  })

  async function getConfig() {
    try {
      const res = await client.get<ApiResponse<unknown>>('/config')
      return unwrapApiResponse(res.data)
    } catch (err) {
      throw toApiError(err)
    }
  }

  async function getServerState(name: string): Promise<ServerState> {
    try {
      const res = await client.get<ApiResponse<ServerState>>(`/servers/${encodeURIComponent(name)}/mc/state`)
      return unwrapApiResponse(res.data)
    } catch (err) {
      throw toApiError(err)
    }
  }

  async function postNoBody(name: string, action: 'start' | 'stop' | 'kill' | 'restart'): Promise<void> {
    try {
      await client.post<ApiResponse<null>>(`/servers/${encodeURIComponent(name)}/mc/${action}`)
    } catch (err) {
      throw toApiError(err)
    }
  }

  async function startServer(name: string) {
    return postNoBody(name, 'start')
  }

  async function stopServer(name: string) {
    return postNoBody(name, 'stop')
  }

  async function killServer(name: string) {
    return postNoBody(name, 'kill')
  }

  async function restartServer(name: string) {
    return postNoBody(name, 'restart')
  }

  async function sendCommand(name: string, command: string) {
    try {
      const payload: CommandRequest = { command }
      await client.post<ApiResponse<void>>(`/servers/${encodeURIComponent(name)}/mc/command`, payload)
    } catch (err) {
      throw toApiError(err)
    }
  }

  return {
    getConfig,
    getServerState,
    startServer,
    stopServer,
    killServer,
    restartServer,
    sendCommand,
  }
}
