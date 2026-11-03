import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Si el puerto está ocupado, falla en vez de saltar al siguiente (5174).
    port: 5173,
    strictPort: true,
  },
})
