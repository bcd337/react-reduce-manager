export type Action<T, C> = {
  [P in keyof C & string as number]: { type: C[P], payload: Partial<T> }
} | {
  [P in keyof T & string as T[P] extends boolean ? `TOGGLE_${Uppercase<P>}` : never ]: { type: `TOGGLE_${Uppercase<P>}` }
} | {
  [P in keyof T & string as `CHANGE_${Uppercase<P>}`]: { type: `CHANGE_${Uppercase<P>}`, payload: T[P] }
}

export type ToTemplateAction<T> = {
  [P in keyof T as number]: T[P]
}[number]

export interface TemplateAction {
  type: string,
  payload: unknown,
}

export interface ActionReducer {
  type: string,
  key: string,
  toggle: boolean,
}

export type ActionCustomProp<T> =
  Record<string, (state: T, ...rest: any[]) => Partial<T> | Promise<Partial<T>>>

export type ActionCustom<T> = {
  +readonly [P in keyof T & string]: T[P] extends (x: any, ...args: infer A) => infer R ?
    (...args: A) => R : never
}

export type ActionType<T> = {
  +readonly [P in keyof T & string as `set${Capitalize<P>}`]: (param: T[P]) => void
} & {
  +readonly [P in keyof T & string as T[P] extends boolean ? `toggle${Capitalize<P>}` : never ]: () => void
}

export type Dispatch = ({ type, payload }: {
  type: string,
  payload?: unknown,
}) => void

export type UseReducer<T, C> = {
  state: T,
  action: ActionCustom<C> & ActionType<T>
}
