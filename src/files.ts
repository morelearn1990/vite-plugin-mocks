import fg from "fast-glob";
import { makeRe } from "micromatch";
import { resolve } from "path";
import { ResolvedOptions } from "./types";

export async function getMockFile(options: ResolvedOptions, file?: string): Promise<string[]> {
    const { exclude } = options;
    const source = pathToGlob(options, file);
    let files = await fg(source, { ignore: excludeToGlob(exclude), onlyFiles: true });
    return files;
}

function pathToGlob(options: ResolvedOptions, file?: string): string {
    const { extensions, include, dir, root } = options;
    const path = resolve(root, dir);
    const ext = extensionsToGlob(extensions);
    return `${file || path}/**/${includeToGlob(include)}.${ext}`;
}

function includeToGlob(include: string[]): string {
    return include.length > 1 ? `{${include.join(",")}}` : include[0] || "*";
}
function extensionsToGlob(extensions: string[]): string {
    return extensions.length > 1 ? `{${extensions.join(",")}}` : extensions[0] || "";
}
function excludeToGlob(exclude: string[]): string[] {
    return ["node_modules", ".git", "**/__*__/**", ...exclude];
}

export function isDir(file: string, options: ResolvedOptions) {
    const dirPath = slash(resolve(options.root, options.dir));
    if (file.startsWith(dirPath)) return true;
    return false;
}

export function isFile(file: string, options: ResolvedOptions) {
    const negativeRe = makeRe(pathToGlob(options));
    const navigativeRes = options.exclude.map((e) => makeRe(e));
    return negativeRe.test(file) && navigativeRes.every((r) => !r.test(file));
}

export function slash(str: string): string {
    return str.replace(/\\/g, "/");
}

export function pathToName(filepath: string) {
    return filepath.replace(/[_.\-\\/]/g, "_").replace(/[[:\]()]/g, "$");
}
