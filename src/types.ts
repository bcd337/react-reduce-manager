import type { ActionType, ActionCustom } from 'createAction/types'

export type UseReducer<T, C> = {
  state: T,
  action: ActionCustom<C> & ActionType<T>
}
