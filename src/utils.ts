import { pathToRegexp, regexpToFunction, Key } from "path-to-regexp";
import { resolve } from "path";
import { ResolvedOptions, UserOptions } from "./types";

export function resolveOptions(userOptions: UserOptions): ResolvedOptions {
    const {
        dir = "./mock",
        delay = [0, 300],
        prefix = "/api/",
        extensions = ["ts"],
        exclude = [],
        include = []
    } = userOptions;

    const root = process.cwd();

    return Object.assign({}, { root, dir, delay, prefix, extensions, exclude, include });
}

export function isArray(val: any): val is Array<any> {
    return val && Array.isArray(val);
}

export function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(""), time);
    });
}

export function pathToReg<T extends object>(pathname: string) {
    var keys: Key[] = [];
    var reg = pathToRegexp(pathname, keys);
    return {
        reg,
        getParams: (url: string): T => {
            const matchRes = regexpToFunction<T>(reg, keys, { decode: decodeURIComponent })(url);
            return matchRes == false ? ({} as T) : matchRes.params;
        }
    };
}
