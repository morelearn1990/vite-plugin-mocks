# vite-plugin-mocks

[![npm version](https://badgen.net/npm/v/vite-plugin-mocks)](https://www.npmjs.com/package/vite-plugin-mocks)
[![monthly downloads](https://badgen.net/npm/dm/vite-plugin-mocks)](https://www.npmjs.com/package/vite-plugin-mocks)
[![types](https://badgen.net/npm/types/vite-plugin-mocks)](https://github.com/hannoeru/vite-plugin-mocks/blob/main/src/types.ts)
[![license](https://badgen.net/npm/license/vite-plugin-mocks)](https://github.com/hannoeru/vite-plugin-mocks/blob/main/LICENSE)

mock plugin for [Vite](https://github.com/vitejs/vite) plugin.

## useage

```ts
import MockPlugin from "vite-plugin-mocks";
export default defineConfig({
    plugins: [
        MockPlugin({
            dir: "/mock/",
            delay: [0, 300]
        })
    ]
});
```

| option     | type            | description                                           | default        | necessary |
| ---------- | --------------- | ----------------------------------------------------- | -------------- | --------- |
| dir        | string          | mock file folder                                      | `'/mock/'`     | no        |
| prefix     | string          | prefix pattern for url                                | `'/api/'`      | no        |
| delay      | [number,number] | random delay range                                    | `[0, 300]`     | no        |
| extensions | string[]        | search file extension                                 | `['ts', 'js']` | no        |
| include    | string[]        | include file match string,syntax reference micromatch | `[]`           | no        |
| exclude    | string[]        | exclude file match string,syntax reference micromatch | `[]`           | no        |

## License

MIT License © 2021 [morelearn1990](https://github.com/morelearn1990)
