import type {
  ActionType,
  Dispatch,
} from './types'
import capitalize from 'helpers/capitalize'

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

export default createActionType
