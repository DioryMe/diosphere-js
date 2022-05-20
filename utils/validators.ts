import { IDioryObject } from '../types'

export function propIsValid(dioryObject: IDioryObject, prop: string): boolean {
  if (prop === 'id') {
    return false
  }

  if (Object.getOwnPropertyNames(dioryObject).includes(prop)) return true

  console.error('Prop is not valid:', prop)
  return false
}

export function valueIsValid(value: any): boolean {
  return typeof value !== 'function'
}

export function valueExists(value: any): boolean {
  return !!value
}
