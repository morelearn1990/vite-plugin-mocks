import { Plugin } from "vite";
import { UserOptions, MockType } from "./types";
import { resolveOptions } from "./utils";
import { isFile, isDir, getMockFile } from "./files";
import { createMiddleware } from "./middleware";
import { createMockFactory } from "./generate";

const VIRTUALID = "virtual:generated-mock";
const VIRTUALMODULEID = "/generated-mock";

function MockPlugin(userOptions: UserOptions = {}): Plugin {
    const options = resolveOptions(userOptions);
    const { generate, generateAll, getMockValues, remove } = createMockFactory(options)();
    return {
        name: "vite-plugin-mocks",
        async configureServer(server) {
            const { watcher, middlewares } = server;

            middlewares.use(createMiddleware(options, getMockValues));

            watcher.on("add", (file) => {
                isFile(file, options) && generate(file);
            });
            watcher.on("addDir", (file) => {
                isDir(file, options) && fullReload(file);
            });
            watcher.on("change", (file) => {
                isFile(file, options) && generate(file);
            });
            watcher.on("unlink", (file) => {
                isFile(file, options) && remove(file);
            });
            watcher.on("unlinkDir", (file) => {
                isDir(file, options) && remove(file);
            });

            fullReload();

            async function fullReload(file?: string) {
                const files = await getMockFile(options, file);
                await generateAll(files);
            }
        },
        resolveId(id) {
            return id == VIRTUALID ? VIRTUALMODULEID : null;
        },
        async load(id) {
            if (id !== VIRTUALMODULEID) return;
            return "";
        },
        async transform(_code: string, id: string) {
            if (id === VIRTUALMODULEID) {
                return "";
            }
        }
    };
}

export default MockPlugin;

export { MockType };
