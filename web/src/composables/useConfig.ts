// composables/useConfig.ts
import { ref, type Ref } from 'vue';
import { useApi } from './useApi';

type ServerConfig = {
  name: string;
  icon: string;
}

export interface AppConfig {
  servers: ServerConfig[];
  [key: string]: any;
}

const config: Ref<AppConfig | null> = ref(null);

// Sync accessor: returns the reactive ref immediately
export function useConfig(): Ref<AppConfig | null> {
  return config;
}

// Async initializer: call once at app start to load config
export async function loadConfig(): Promise<Ref<AppConfig | null>> {
  const api = useApi();

  const raw = await api.getConfig();

  if (!raw || typeof raw !== 'object' || !Array.isArray((raw as any).servers)) {
    throw new Error('Invalid configuration');
  }

  config.value = raw as AppConfig;
  return config;
}
