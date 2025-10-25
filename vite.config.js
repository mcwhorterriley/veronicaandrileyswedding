import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/weddingWebsite/',  // ✅ base '/' in dev, real path in build
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5177,
  },
}));
