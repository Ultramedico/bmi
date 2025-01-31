import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),  tailwindcss()],
  server: {
    port: 4000,         // Set the port to 3000
    host: '0.0.0.0',    // Bind to all IP addresses to allow external access
  },
})
