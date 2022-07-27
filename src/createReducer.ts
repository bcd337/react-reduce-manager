type Action<T, C> = {
  [P in keyof C & string as number]: { type: C[P], payload: Partial<T> }
} | {
  [P in keyof T & string as T[P] extends boolean ? `TOGGLE_${Uppercase<P>}` : never ]: { type: `TOGGLE_${Uppercase<P>}` }
} | {
  [P in keyof T & string as `CHANGE_${Uppercase<P>}`]: { type: `CHANGE_${Uppercase<P>}`, payload: T[P] }
}

type ToTemplateAction<T> = {
  [P in keyof T as number]: T[P]
}[number]

interface TemplateAction {
  type: string,
  payload: unknown,
}

interface ActionReducer {
  type: string,
  key: string,
  toggle: boolean,
}

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

export default createReducer
