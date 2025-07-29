import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

// Replace this with your machine's LAN IP or hostname
const DEV_HOST = '192.168.18.104'

export default defineConfig({
    plugins: [
        react(), // enable JSX/React support
        laravel({
            input: [
                'resources/js/main.jsx',
                'resources/css/app.css',
            ],
            refresh: true,
        }),
    ],

    server: {
        host: true,       // bind to all interfaces
        port: 5173,       // dev server port
        strictPort: true,
        cors: true,       // allow any origin

        // Force script URLs to use your chosen host (avoids [::] in tags)
        origin: `http://${DEV_HOST}:5173`,

        hmr: {
            host: DEV_HOST,  // HMR websocket host
            protocol: 'ws',
            port: 5173,
        },
    },
})
