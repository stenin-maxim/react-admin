import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/styles/_variables.scss" as *;`,
            },
        },
    },
    server: {
        port: 5174,
        strictPort: true, // Избежит автоматического переключения на 5175, если 5174 занят
        proxy: {
            '/storage': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            }
        }
    },
});