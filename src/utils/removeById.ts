import { getIds } from './getIds'

export function removeById(id: string, items?: any[]) {
  const doorIndex = getIds(items)?.indexOf(id)
  if (doorIndex != -1) {
    items?.splice(doorIndex!, 1)
  }

  if (items!.length === 0) {
    items = undefined
  }

  return items
}
