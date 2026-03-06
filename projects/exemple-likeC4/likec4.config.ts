import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'exemple',
  title: 'Exemple LikeC4',
  include: {
    paths: ['../shared']
  },
  imageAliases: {
    '@': '../shared/images/'
  }
})
