import type {
  ActionCustom,
  ActionCustomProp,
  Dispatch,
} from './types'

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

export default createActionCustom
