import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/members' : 'https://spencerb320.pythonanywhere.com',
      '/fillSchedule' : 'https://spencerb320.pythonanywhere.com'
    }
  },
  plugins: [react()],
})
