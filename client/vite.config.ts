import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteAliases } from 'vite-aliases'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteAliases()],
  server:{
    port: 2600,
  },
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      util: 'util',
      http: 'agent-base',
      https: 'agent-base',
      zlib: 'browserify-zlib',
    },
  },
})
