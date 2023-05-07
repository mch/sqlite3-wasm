import { defineConfig } from "vite";
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    plugins: [
        wasm(),
    ],
    optimizeDeps: {
        exclude: ['@sqlite.org/sqlite-wasm'],
    },
    test: {
        browser: {
            enabled: true,
            name: 'chrome',
        }
    },
});

