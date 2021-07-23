import path from "path";
import Module from "module";
import { build } from "esbuild";
import { NodeModuleWithCompile, MockType, ResolvedMockType, Recordable, ResolvedOptions, MockData } from "./types";
import { isArray, pathToReg } from "./utils";

export const createMockFactory = (options: ResolvedOptions) => {
    const mockData: MockData = new Map();
    return () => {
        const getMockValues = () => {
            return [...mockData.values()];
        };

        const remove = (file: string) => {
            [...mockData.keys()].forEach((key) => {
                const [mockFile] = key;
                if (mockFile == file || mockFile.startsWith(file)) {
                    mockData.delete(key);
                }
            });
        };
        const generate = async (file: string) => {
            // 生成前先将之前的删除
            remove(file);

            const resolvedMocks = await generateMockFromFile(file);
            if (!resolvedMocks) return;
            resolvedMocks
                .filter((mock) => mock.url && mock.response)
                .forEach((mock) => {
                    mockData.set([file, mock.url], mock);
                });
        };
        const generateAll = async (files: string[]) => {
            await Promise.all(files.map((file) => generate(file)));
        };

        return { mockData, generate, generateAll, getMockValues, remove };
    };
};

const generateMockFromFile = async (file: string) => {
    let fileMocks: MockType | MockType[] = await resolveModule(file);
    if (!fileMocks) return;
    fileMocks = isArray(fileMocks) ? fileMocks : [fileMocks];
    const resolvedMocks: ResolvedMockType[] = fileMocks.map((mock) => {
        const { url, method = "GET", type = "JSON" } = mock;
        const { reg, getParams } = pathToReg<Recordable>(url);
        return { ...mock, method, type, reg, getParams };
    });
    return resolvedMocks;
};

async function resolveModule(filePath: string): Promise<any> {
    cleanCache(filePath);
    const result = await build({
        entryPoints: [filePath],
        outfile: "out.js",
        write: false,
        platform: "node",
        bundle: true,
        format: "cjs",
        metafile: true,
        target: "node12"
    });
    const { text } = result.outputFiles[0];

    return await loadFromBundledFile(filePath, text);
}

async function loadFromBundledFile(filePath: string, bundledCode: string) {
    const extension = path.extname(filePath);

    // @ts-expect-error
    const extensions = Module.Module._extensions;
    let defaultLoader: any;
    const isJs = extension === ".js";
    if (isJs) {
        defaultLoader = extensions[extension];
    }

    extensions[extension] = (module: NodeModule, path: string) => {
        if (filePath === path) {
            (module as NodeModuleWithCompile)._compile(bundledCode, path);
        } else {
            if (!isJs) {
                extensions[extension](module, path);
            } else {
                defaultLoader(module, path);
            }
        }
    };
    let content;
    try {
        if (require && require.cache) {
            delete require.cache[filePath];
        }
        const raw = require(filePath);

        content = raw.__esModule ? raw.default : raw;
        if (defaultLoader && isJs) {
            extensions[extension] = defaultLoader;
        }
    } catch (error) {
        console.error(error);
    }

    return content;
}

function cleanCache(modulePath: string) {
    var childModule = require.cache[modulePath];
    if (!childModule) return;
    require.cache[modulePath] = undefined;
    if (module) {
        module.children.splice(module.children.indexOf(childModule), 1);
    }
}
