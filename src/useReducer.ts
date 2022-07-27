import { useReducer as originalUseReducer } from 'react'
import createReducer from './createReducer'

type ActionCustomProp<T> =
  Record<string, (state: T, ...rest: any[]) => Partial<T> | Promise<Partial<T>>>

type ActionCustom<T> = {
  +readonly [P in keyof T & string]: T[P] extends (x: any, ...args: infer A) => infer R ?
    (...args: A) => R : never
}

type ActionType<T> = {
  +readonly [P in keyof T & string as `set${Capitalize<P>}`]: (param: T[P]) => void
} & {
  +readonly [P in keyof T & string as T[P] extends boolean ? `toggle${Capitalize<P>}` : never ]: () => void
}

type Dispatch = ({ type, payload }: {
  type: string,
  payload?: unknown,
}) => void

type UseReducer<T, C> = {
  state: T,
  action: ActionCustom<C> & ActionType<T>
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return str.charAt(0).toUpperCase() + str.slice(1) as Capitalize<T>;
}

function createActionType<T extends object>(
  s: T,
  dispatch: Dispatch,
) {
  return Object.entries(s)
    .reduce((prev, [key, value]) => {
      let currentPrev: ActionType<T> = prev

      if (typeof value === 'boolean') {
        currentPrev = {
          ...prev,
          [`toggle${capitalize(key)}`]: () => dispatch({
            type: `TOGGLE_${key}`.toUpperCase(),
          }),
        }
      }

      return {
        ...currentPrev,
        [`set${capitalize(key)}`]: (payload: unknown) => dispatch({
          type: `CHANGE_${key}`.toUpperCase(),
          payload,
        }),
      }
    }, {} as ActionType<T>);
}

function createActionCustom<T extends object, C extends ActionCustomProp<T>>(
  dispatch: Dispatch,
  state: T,
  custom?: C,
): ActionCustom<C> {
  return Object
    .entries(custom || {})
    .map(([key, value]) => ({
      key,
      value: (...rest: any[]) => new Promise((resolve, reject) => {
        const result = value(state, ...rest)

        if (result instanceof Promise) {
          result.then((payload) => {
            resolve(dispatch({
              type: key,
              payload,
            }))
          }).catch((error) => reject(error))

          return
        }

        resolve(dispatch({
          type: key,
          payload: result,
        }))
      }),
    }))
    .reduce((prev, { key, value }) => ({ ...prev, [key]: value }), {} as ActionCustom<C>)
}

function useReducer<T extends object, C extends ActionCustomProp<T>>(
  initialValue: T,
  custom?: C,
): UseReducer<T, C> {
  const reducer = createReducer(initialValue, custom ? Object.keys(custom) : [])
  const [state, dispatch] = originalUseReducer(reducer, initialValue)

  return {
    state,
    action: {
      ...createActionType(initialValue, dispatch as unknown as Dispatch),
      ...createActionCustom(dispatch as unknown as Dispatch, state, custom),
    },
  } as UseReducer<T, C>
}

export default useReducer
