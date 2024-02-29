export function throwErrorIfAlreadyExists(method: string, newId: string, ids?: string[]): void {
  if (!ids?.includes(newId)) {
    return
  }
  throw new Error(`${method}: Item already exists ${JSON.stringify(newId, null, 2)}`)
}
