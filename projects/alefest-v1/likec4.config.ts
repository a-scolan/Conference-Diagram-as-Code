import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'alefest-v1',
  title: 'AleFest Coffee V1 - Le Comptoir (synchrone)',
  include: {
    paths: ['../shared']
  },
  imageAliases: {
    '@': '../shared/images/'
  }
})
