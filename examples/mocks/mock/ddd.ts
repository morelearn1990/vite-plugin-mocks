import { MockType } from "vite-plugin-mocks";
import aaa from "./mock";

export default [
    {
        method: "GET",
        url: "/dddd/11",
        response: ({ headers, body, query }) => {
            const { no, password, validCode, validCodeSign } = body;
            if (no && password && validCode && validCodeSign)
                return { code: "00", data: "adfasdfasdfdgagsdgfsdfg", msg: "成功" };
            return { code: "01", data: null, msg: "登录失败" };
        }
    },
    {
        url: "/dddd/222",
        method: "get",
        timeout: 2000,
        type: "RAW",
        response: async () => {}
    },
    ...aaa
] as MockType[];
