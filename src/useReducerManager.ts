import { useReducer } from 'react'
import { createReducer } from './createReducer'

type ActionCustomProp<T> = Record<string, (state: T, ...rest: any[]) => Partial<T> | Promise<Partial<T>>>

type ActionCustom<T> = {
  +readonly [P in keyof T & string]: T[P] extends (x: any, ...args: infer A) => infer R ? (...args: A) => R : never
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

type useReducerManagerReturn<T, C> = {
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
    .map(([key, value]) => {
      return {
        key,
        value: async (...rest: any[]) => {
          if (value.constructor.name === 'Function') {
            return dispatch({
              type: key,
              payload: value(state, ...rest)
            })
          }

          const call = await value(state, ...rest)

          return dispatch({
            type: key,
            payload: call
          })
        },
      }
    })
    .reduce((prev, { key, value }) => ({ ...prev, [key]: value }), {} as ActionCustom<C>)
}

function useReducerManager<T extends object, C extends ActionCustomProp<T>>(initialValue: T, custom?: C): useReducerManagerReturn<T, C> {
  const [ state, dispatch ] = useReducer(createReducer(initialValue, custom ? Object.keys(custom) : []), initialValue)

  return {
    state,
    action: {
      ...createActionType(initialValue, dispatch as unknown as Dispatch),
      ...createActionCustom(dispatch as unknown as Dispatch, state, custom),
    }
  } as useReducerManagerReturn<T, C>
}

export default useReducerManager
