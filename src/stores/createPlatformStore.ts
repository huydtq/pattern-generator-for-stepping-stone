import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { PlatformModel, PlatformTypes } from '../types'

export const platformsPatternsAtom = atom<Array<Set<number>>>([new Set<number>([0])])

export const platformsPatternsAtomStorage = atomWithStorage<Array<Set<number>>>('patterns', [new Set<number>([0])])

export const platformsAtom = atomWithStorage<Array<Array<PlatformModel>>>('patterns', [[]])

export const colorsAtom = atomWithStorage<Record<keyof typeof PlatformTypes, string>>('colors', {
  None: '#bebebe',
  Drop: '#1fa3d1',
  Item: '#a2ba26'
})
