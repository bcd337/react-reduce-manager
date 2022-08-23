import type { ActionReducer } from './types'

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

export default createActionReducer
