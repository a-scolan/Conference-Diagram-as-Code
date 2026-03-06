import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'alefest-v2',
  title: 'AleFest Coffee V2 - Le Café Mobile (asynchrone)',
  include: {
    paths: ['../shared']
  },
  imageAliases: {
    '@': '../shared/images/'
  }
})
