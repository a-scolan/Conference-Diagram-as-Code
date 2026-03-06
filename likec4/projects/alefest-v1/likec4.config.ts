import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'alefest-v1',
  title: 'AleFest Café V1 - Le Café Mobile (asynchrone)',
  include: {
    paths: ['../shared']
  },
  imageAliases: {
    '@': '../shared/images/'
  }
})
