import { useReducer as originalUseReducer } from 'react'
import createReducer from 'createReducer'
import { createActionType, createActionCustom } from 'createAction'
import type { ActionCustomProp, Dispatch } from 'createAction/types'
import type { UseReducer } from 'types'

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
