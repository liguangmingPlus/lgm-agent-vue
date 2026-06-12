import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getSiteSettings } from '@/api/settings'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({})
  const loaded = ref(false)

  async function loadSettings() {
    if (loaded.value) return
    try {
      const res = await getSiteSettings()
      settings.value = res.data
      loaded.value = true
    } catch (e) {
      // ignore
    }
  }

  return { settings, loaded, loadSettings }
})
