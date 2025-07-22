export type DeepPartial<T> = T extends Object
  ? {
      [P in keyof T]: DeepPartial<T[P]>;
    }
  : T;

export type Mapper<T> = T extends Object
    ? { [K in keyof T]?: string}
    : undefined

export type MappedResult<T, M extends Mapper<T>> = {
  [K in keyof M as M[K] extends string ? M[K] : never]: K extends keyof T ? T[K] : never
}

export type Obj = Record<string, unknown>
export type Arr = any[]

