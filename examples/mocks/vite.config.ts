import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import Mocks from "vite-plugin-mocks";
import Restart from "vite-plugin-restart";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        Restart({
            restart: ["../../dist/*.js"]
        }),
        Mocks({
            include: ["mock"]
        })
    ]
});
