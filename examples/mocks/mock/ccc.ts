import { MockType } from "vite-plugin-mocks";
// import { Random } from "mockjs";

export default [
    {
        method: "GET",
        url: "/ccc/11",
        response: ({ headers, body, query }) => {
            const { no, password, validCode, validCodeSign } = body;
            if (no && password && validCode && validCodeSign)
                return { code: "00", data: "adfasdfasdfdgagsdgfsdfg", msg: "成功" };
            return { code: "01", data: null, msg: "登录失败" };
        }
    },
    {
        url: "/ccc/222",
        method: "get",
        timeout: 2000,
        type: "RAW",
        response: async ({ headers, res }) => {
            res.statusCode = 200;
            res.end("asdfc");
            // res.end(Random.image("40*200", "#fff", "#000", "png", "1+3=?"));
        }
    }
] as MockType[];
