import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'alefest-v2',
  title: 'AleFest Café V2 - Le Café Mobile (asynchrone et notifiant)',
  include: {
    paths: ['../shared']
  },
  imageAliases: {
    '@': '../shared/images/'
  }
})
