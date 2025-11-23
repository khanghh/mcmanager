import axios, { AxiosError } from 'axios'

export type ApiError = {
  code: number
  message: string
}

export type ApiEnvelope<T> = {
  apiVersion?: string
  data?: T
  error?: {
    code?: number
    message?: string
  }
}

export type ServerStatus = 'running' | 'stopping' | 'stopped' | 'unknown'

export type ServerState = {
  status: ServerStatus
  tps: number
  pid?: number
  memoryUsage?: number
  memoryLimit?: number
  cpuUsage?: number
  cpuLimit?: number
  uptimeSec?: number
  diskUsage?: number
  diskSize?: number
}

export type CommandRequest = {
  command: string
}

function unwrapApiResponse<T>(resData: ApiEnvelope<T>): T {
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
    const e = err as AxiosError<ApiEnvelope<unknown>>
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
      const res = await client.get<ApiEnvelope<unknown>>('/config')
      return unwrapApiResponse(res.data)
    } catch (err) {
      throw toApiError(err)
    }
  }

  async function getServerState(name: string): Promise<ServerState> {
    try {
      const res = await client.get<ApiEnvelope<ServerState>>(`/servers/${encodeURIComponent(name)}/mc/state`)
      return unwrapApiResponse(res.data)
    } catch (err) {
      throw toApiError(err)
    }
  }

  async function postNoBody(name: string, action: 'start' | 'stop' | 'kill' | 'restart'): Promise<ServerState | null> {
    try {
      const res = await client.post<ApiEnvelope<ServerState | null>>(`/servers/${encodeURIComponent(name)}/mc/${action}`)
      // Some actions may or may not return a state; accept null data.
      if (res.data.error) {
        throw new Error(res.data.error.message || 'API error')
      }
      return (res.data.data ?? null) as ServerState | null
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
      const res = await client.post<ApiEnvelope<void>>(`/servers/${encodeURIComponent(name)}/mc/command`, payload)
      if (res.data.error) {
        throw new Error(res.data.error.message || 'API error')
      }
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
