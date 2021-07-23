// tsup.config.ts
import type { Options } from "tsup";
export const tsup: Options = {
    splitting: false,
    sourcemap: true,
    clean: true,
    entryPoints: ["src/index.ts"],
    target: "es2020",
    format: ["cjs", "esm"],
    dts: true,
    ignoreWatch: ["examples"]
};
