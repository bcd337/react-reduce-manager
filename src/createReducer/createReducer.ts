import type {
  Action,
  TemplateAction,
  ToTemplateAction,
} from './types'
import createActionReducer from './createActionReducer'

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
