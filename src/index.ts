import { useReducer as originalUseReducer } from 'react'
import type {
  Action,
  TemplateAction,
  ToTemplateAction,
  ActionReducer,
  ActionCustom,
  ActionCustomProp,
  ActionType,
  Dispatch,
  UseReducer,
} from './types'

function createActionReducer<T extends object>(initialValue: T): ActionReducer[] {
  return Object
    .entries(initialValue)
    .reduce((prev: ActionReducer[], [key, value]): ActionReducer[] => {
      if (typeof value === 'boolean') {
        return [
          ...prev,
          {
            type: `CHANGE_${key}`.toUpperCase(),
            key,
            toggle: false,
          },
          {
            type: `TOGGLE_${key}`.toUpperCase(),
            key,
            toggle: true,
          },
        ]
      }

      return [
        ...prev,
        {
          type: `CHANGE_${key}`.toUpperCase(),
          key,
          toggle: false,
        },
      ]
    }, [])
}

function createReducer<T extends object, C extends readonly string[]>(
  initialValue: T,
  customType?: C,
) {
  const actionReducer = createActionReducer(initialValue)

  return (state: T, action: ToTemplateAction<Action<T, C>>) => {
    const currentAction = action as unknown as TemplateAction

    if (customType) {
      const custom = customType.find((type) => type === currentAction.type)

      if (custom) {
        if (typeof currentAction.payload === 'object') {
          return {
            ...state,
            ...currentAction.payload,
          }
        }

        return state
      }
    }

    const find = actionReducer.find(({ type }) => type === currentAction.type)

    if (!find) {
      throw new Error(`action type not found: ${currentAction.type}`);
    }

    if (find.toggle) {
      return {
        ...state,
        [find.key]: !state[find.key as keyof typeof state],
      }
    }

    return {
      ...state,
      [find.key]: currentAction.payload,
    }
  }
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
