import { useRef } from 'react'
import { getInstance } from '../../shared/DI/get-instance'
import { Newable } from 'inversify'

export function useRefInstance<T>(instance: Newable<T>): T {
  return useRef(getInstance(instance)).current
}
