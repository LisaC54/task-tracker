import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use /task-tracker/ as base on GitHub Pages, / for local dev
  base: process.env.VITE_BASE_PATH ?? '/',
})
