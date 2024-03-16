export function throwErrorIfNotFound(method: string, newId: string, ids?: string[]): void {
  if (ids?.includes(newId)) {
    return
  }
  throw new Error(`${method}: Item not found ${JSON.stringify(newId, null, 2)}`)
}
