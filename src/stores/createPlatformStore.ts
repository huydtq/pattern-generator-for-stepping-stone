import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { PlatformModel } from '../types'

export const platformsPatternsAtom = atom<Array<Set<number>>>([new Set<number>([0])])

export const platformsPatternsAtomStorage = atomWithStorage<Array<Set<number>>>('patterns', [new Set<number>([0])])

export const platformsAtom = atom<Array<Array<PlatformModel>>>([[]])
