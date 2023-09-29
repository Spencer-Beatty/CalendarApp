import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/members' : 'http://https://fancy-lamington-93bf66.netlify.app/',
      '/fillSchedule' : 'http://https://fancy-lamington-93bf66.netlify.app/'
    }
  },
  plugins: [react()],
})
