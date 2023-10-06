import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/members' : {target: 'https://spencerb320.pythonanywhere.com',
                    rewrite: 'https://spencerb320.pythonanywhere.com/members'},
      '/fillSchedule' : 'https://spencerb320.pythonanywhere.com'
    }
  },
  plugins: [react()],
})
