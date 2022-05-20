import { IDiory, IDioryObject, IDiographObject, ILinkObject } from '../types'

export function throwErrorIfDioryNotFound(
  method: string,
  dioryObject: IDioryObject,
  diograph: IDiographObject,
): void {
  if (diograph[dioryObject.id]) {
    return
  }
  throw new Error(`${method}: Diory not found ${JSON.stringify(dioryObject, null, 2)}`)
}

export function throwErrorIfDioryAlreadyExists(
  method: string,
  dioryObject: IDioryObject | IDiory,
  diograph: IDiographObject,
): void {
  if (!diograph[dioryObject.id]) {
    return
  }
  throw new Error(`${method}: Diory already exists ${JSON.stringify(dioryObject, null, 2)}`)
}

export function throwErrorIfLinkNotFound(
  method: string,
  linkObject: ILinkObject,
  links: { [index: string]: ILinkObject } = {},
): void {
  if (Object.values(links).find(({ id }) => id === linkObject.id)) {
    return
  }
  throw new Error(`${method}: Link not found ${JSON.stringify(linkObject, null, 2)}`)
}

export function throwErrorIfLinkAlreadyExists(
  method: string,
  linkObject: ILinkObject,
  links: { [index: string]: ILinkObject } = {},
): void {
  if (!Object.values(links).find(({ id }) => id === linkObject.id)) {
    return
  }
  throw new Error(`${method}: Link already exists ${JSON.stringify(linkObject, null, 2)}`)
}
