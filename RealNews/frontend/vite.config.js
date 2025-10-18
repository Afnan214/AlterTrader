import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/conf  nig/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost", // or true to expose to network
    port: 5174,        // 👈 this sets the default port
  },

})
