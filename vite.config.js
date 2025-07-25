import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/css/app.css', // Ensure your CSS is included
            ],
            refresh: true,
        }),
        react(),
    ],
    server: {
        hmr: false
    }
});
