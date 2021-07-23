import { IncomingMessage, ServerResponse } from "http";

export type DelayNumber = number | [number, number];

/**
 * Plugin options.
 */
interface Options {
    /**
     * mock dir
     * @dir default '/mock'
     */
    dir: string;
    /**
     * url match prefix
     * @prefix default '/api/'
     */
    prefix: string;
    /**
     * delay for request
     * @delay default [0, 300]
     */
    delay?: DelayNumber;
    /**
     * mock file extension
     * @extensions default ['ts', 'js']
     */
    extensions: string[];
    /**
     * include  file
     * @include default []
     */
    include: string[];
    /**
     * exclude  file
     * @exclude default []
     */
    exclude: string[];
}

export type UserOptions = Partial<Options>;

export interface ResolvedOptions extends Options {
    root: string;
    delay: DelayNumber;
}

export type Recordable<T = any> = Record<string, T>;

export interface MockRes {
    req: IncomingMessage;
    res: ServerResponse;
    url: string;
    pathname: string;
    query: Recordable;
    method: string;
    headers: any;
    body?: any;
    params?: Recordable;
}

export interface MockType {
    type?: "RAW" | "JSON";
    delay?: DelayNumber;
    method?: "GET" | "POST" | "DELETE";
    url: string;
    response: (param: MockRes) => any;
}

export interface ResolvedMockType extends MockType {
    type: "RAW" | "JSON";
    method: "GET" | "POST" | "DELETE";
    reg: RegExp;
    getParams: (url: string) => Recordable;
}

export interface NodeModuleWithCompile extends NodeModule {
    _compile(code: string, filename: string): any;
}

export type MockData = Map<[string, string], ResolvedMockType>;
