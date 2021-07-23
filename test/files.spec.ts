import { resolveOptions } from "../src/utils";
import { getMockFile } from "../src/files";

const options = resolveOptions({
    extensions: ["ts"],
    dir: "test/files/mock",
    // include: ["_mock", "mock", "mocks"],
    include: [],
    exclude: ["a"]
});

describe("Get files", () => {
    test("Pages file", async () => {
        const files = await getMockFile(options);
        expect(files.sort()).toMatchSnapshot("page files");
    });
});
