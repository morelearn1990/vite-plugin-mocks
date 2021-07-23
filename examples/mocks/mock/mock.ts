import { MockType } from "vite-plugin-mocks";
// import { Random } from "mockjs";

export default [
    {
        method: "POST",
        url: "/api/json",
        response: ({ headers, body, query }) => {
            const { no, password, validCode, validCodeSign } = body;
            if (no && password && validCode && validCodeSign)
                return { code: "00", data: "adfasdfasdfdgagsdgfsdfg", msg: "成功" };
            return { code: "01", data: null, msg: "登录失败" };
        }
    },
    {
        method: "GET",
        delay: 2000,
        url: "/api/params/:id",
        response: async ({ params, query }) => {
            console.log("params", params);
            console.log("query", query);
            return { code: "00", data: { params, query }, msg: "成功" };
        }
    },
    {
        type: "RAW",
        method: "GET",
        delay: 2000,
        url: "/api/raw/:id",
        response: async ({ body, params }) => {
            console.log("body", body);
            console.log("params", params);
            return { code: "01", data: {}, msg: "登录失败" };
        }
    }
] as MockType[];
