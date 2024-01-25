import { WritableAtom, atom } from 'jotai'
import { RESET } from 'jotai/utils'

import { PatternSchema, PlatformSchema, PlatformTypes } from '../types'

export type PlatformSetableValues = Omit<PlatformSchema, 'id'>
export type PlatformSettingsSchema = { currentOption: keyof PlatformSetableValues } & PlatformSetableValues
export type PatternSettingsSchema = Omit<PatternSchema, 'maxDelay'>

// type PatternDataType = PatternSchema & {
//   platforms: Array<PlatformSchema>
// }

export const patternsAtom = atomWithLocalStorage<Array<Array<PlatformSchema>>>('patterns', [[]])
export const platformSettingsAtom = atomWithLocalStorage<PlatformSettingsSchema>('platformSettings', {
  currentOption: 'type',
  type: PlatformTypes.None,
  itemId: 0,
  delay: 0,
  speed: 10
})

export const colorSettingsAtom = atomWithLocalStorage<Record<keyof typeof PlatformTypes, string>>('colorSettings', {
  None: '#bebebe',
  Drop: '#1fa3d1',
  Item: '#a2ba26'
})
export const patternSettingsAtom = atomWithLocalStorage<PatternSettingsSchema>('patternSettings', {
  targetDistance: 20,
  targetRevertSpeed: 10
})

type SetStateActionWithReset<Value> = Value | typeof RESET | ((prev: Value) => Value | typeof RESET)
function atomWithLocalStorage<Value>(
  key: string,
  initialValue: Value
): WritableAtom<Value, [SetStateActionWithReset<Value>], void> {
  const getInitialValue = () => {
    const item = localStorage.getItem(key)
    if (item !== null) {
      return JSON.parse(item)
    }
    return initialValue
  }
  const baseAtom = atom(getInitialValue())
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: SetStateActionWithReset<Value>) => {
      const nextValue =
        typeof update === 'function' ? (update as (prev: Value) => Value | typeof RESET)(get(baseAtom)) : update
      set(baseAtom, nextValue)
      localStorage.setItem(key, JSON.stringify(nextValue))
    }
  )
  return derivedAtom
}
