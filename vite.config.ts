import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 성능 최적화
  build: {
    // 청크 크기 최적화
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mantine: ['@mantine/core', '@mantine/hooks'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
        }
      }
    },
    // 압축 최적화 (esbuild 사용 - 더 빠름)
    minify: 'esbuild'
  },
  
  // 개발 서버 최적화
  server: {
    hmr: true
  }
})
