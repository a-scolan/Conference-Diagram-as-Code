import { defineConfig } from 'likec4/config'
import generators from './generators/network/network_matrix_gen'

export default defineConfig({
  name: 'capsule',
  title: 'Capsule - Hébergement de Sites Web Statiques',
  include: {
    paths: ['../shared']
  },
  imageAliases: {
    '@': '../shared/images/'
  },
  generators
})
