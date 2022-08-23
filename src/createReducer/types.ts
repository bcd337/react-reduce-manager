export type Action<T, C> = {
  [P in keyof C & string as number]: { type: C[P], payload: Partial<T> }
} | {
  [P in keyof T & string as T[P] extends boolean ? `TOGGLE_${Uppercase<P>}` : never ]: { type: `TOGGLE_${Uppercase<P>}` }
} | {
  [P in keyof T & string as `CHANGE_${Uppercase<P>}`]: { type: `CHANGE_${Uppercase<P>}`, payload: T[P] }
}

export interface TemplateAction {
  type: string,
  payload: unknown,
}

export type ToTemplateAction<T> = {
  [P in keyof T as number]: T[P]
}[number]

export interface ActionReducer {
  type: string,
  key: string,
  toggle: boolean,
}
