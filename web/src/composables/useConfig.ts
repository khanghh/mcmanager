// composables/useConfig.ts
import { ref, type Ref } from 'vue';
import axios from 'axios';
// Use fetch instead of axios to avoid an extra dependency and types

export interface AppConfig {
  apiURL?: string;
  [key: string]: any;
}

const config: Ref<AppConfig | null> = ref(null);

// Sync accessor: returns the reactive ref immediately
export function useConfig(): Ref<AppConfig | null> {
  return config;
}

// Async initializer: call once at app start to load config
export async function loadConfig(): Promise<Ref<AppConfig | null>> {
  // Dev mode: set defaults immediately
  if (import.meta.env.DEV) {
    config.value = {
      apiURL: 'http://localhost:3000',
    };
    return config;
  }

  // Production: always fetch latest config.json
  try {
    const response = await axios.get('/config.json');
    config.value = response.data;
    return config;
  } catch (error) {
    config.value = {
      apiURL: window.location.origin
    };
    return config;
  }
}
