/** @type {import('vite').UserConfig} */

import { defineConfig } from 'vite'

export default defineConfig({
    base: '/datafactorio/',
    server: {
        port: 1234,
    host: '0.0.0.0',
    watch: {
    usePolling: true
},
    },
    root: 'app',
    build: {
    outDir: 'dist'
}
})
