// composables/useConfig.js
import { ref } from 'vue';
import axios from 'axios';

const config = ref(null);

// Sync accessor: returns the reactive ref immediately
export function useConfig() {
  return config;
}

// Async initializer: call once at app start to load config
export async function loadConfig() {
  // Dev mode: set defaults immediately
  if (import.meta.env.DEV) {
    config.value = {
      apiURL: "http://localhost:3000",
    }
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
