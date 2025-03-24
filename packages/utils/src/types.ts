type DeepPartial<T> = T extends Object ?  {
    [P in keyof T]: DeepPartial<T[P]>
} : T


export function typedMock<T>(implementation: DeepPartial<T>): T {
    return implementation as unknown as T
}
