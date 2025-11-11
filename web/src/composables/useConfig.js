// composables/useConfig.js
import { ref } from 'vue';

const config = ref(null);
let loadingPromise = null;

export function useConfig() {
  // If in dev mode, return default config immediately
  if (import.meta.env.DEV) {
    config.value = {
      apiURL: "http://localhost:3000",
      vscodeSettings: {
        "files.autoSave": "off",
        "workbench.colorTheme": "Default Dark+",
        "remotefs.serverURL": "http://localhost:3000/api/fs"
      }
    }
    return config;
  }

  // If already loaded, return the ref immediately
  if (config.value) {
    return config;
  }

  // If a fetch is already in progress, return the ref
  if (!loadingPromise) {
    loadingPromise = fetch('/config.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch config');
        return res.json();
      })
      .then(data => {
        config.value = data; // cache result
        return data;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return config;
}
