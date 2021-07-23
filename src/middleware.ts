import { IncomingMessage, NextHandleFunction } from "connect";
import { ResolvedOptions, ResolvedMockType, Recordable, DelayNumber } from "./types";
import Mock from "mockjs";
import { URL } from "url";
import { sleep } from "./utils";

// 由于 url 是相对路径，new URL() 必须要一个 base 才能解析，不然会报错。
// 这个base可以使随意的 base
const BASE = "https://localhost:3000/";
// 默认延时
const DELAY = 300;

export const createMiddleware = (
    { delay: optionDelay, prefix }: ResolvedOptions,
    getMockValues: () => ResolvedMockType[]
): NextHandleFunction => {
    return async (req, res, next) => {
        const { url = "", method = "get", headers } = req;
        if (prefix && !url.startsWith(prefix)) return next();

        const { pathname, searchParams } = new URL(url, BASE);

        const matchMock = getMockValues().find(
            (mock) => mock.reg.test(pathname) && method.toUpperCase() == mock.method?.toUpperCase()
        );
        if (!matchMock) return next();

        const { type, response, getParams, delay } = matchMock;

        await sleep(getDelay(delay, optionDelay));

        const query: Recordable = Array.from(searchParams.entries()).reduce(
            (pre, [key, value]) => Object.assign(pre, { [key]: value }),
            {} as Recordable
        );
        const params = getParams(url);
        console.log("params", params);

        try {
            const body = await getBody(req, type);
            if (type === "JSON") {
                const data = await response({ req, res, pathname, query, params, url, method, headers, body });
                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify(Mock.mock(data)));
                return;
            }
            await response({ req, res, pathname, query, params, url, method, headers, body });
        } catch (error) {
            try {
                res.statusCode = 500;
                res.end(JSON.stringify(error));
            } catch (error) {
                res.statusCode = 500;
                res.end("服务器发送错误");
            }
        }
    };
};

function getBody(req: IncomingMessage, type: string = "JSON"): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", function () {
            if (type == "JSON") {
                try {
                    const jsonStr = body ? JSON.parse(body) : {};
                    resolve(jsonStr as Recordable);
                } catch (err) {
                    reject({ err, body, msg: "JSON.parse error" });
                }
            } else {
                resolve(body);
            }
            return;
        });
    });
}

function getDelay(delay: DelayNumber | undefined, optionDelay: DelayNumber | undefined): number {
    let resolveDelay = delay || optionDelay;
    if (!resolveDelay) return DELAY;
    if (typeof resolveDelay == "number") return resolveDelay;
    const [start, end] = resolveDelay;
    return Math.floor(start + Math.random() * (end - start));
}
