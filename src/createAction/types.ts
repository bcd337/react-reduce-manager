export type ActionType<T> = {
  +readonly [P in keyof T & string as `set${Capitalize<P>}`]: (param: T[P]) => void
} & {
  +readonly [P in keyof T & string as T[P] extends boolean ? `toggle${Capitalize<P>}` : never ]: () => void
}

export type ActionCustomProp<T> =
  Record<string, (state: T, ...rest: any[]) => Partial<T> | Promise<Partial<T>>>

export type ActionCustom<T> = {
  +readonly [P in keyof T & string]: T[P] extends (x: any, ...args: infer A) => infer R ?
    (...args: A) => R : never
}

export type Dispatch = ({ type, payload }: {
  type: string,
  payload?: unknown,
}) => void
