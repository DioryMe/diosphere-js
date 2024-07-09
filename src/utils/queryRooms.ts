import { IRoomProps, IRoomObject, IRoomsObject } from '../types'

function allKeysExist(queryRoom: IRoomProps) {
  return (room: IRoomObject): boolean =>
    // @ts-ignore
    !Object.keys(queryRoom).some((prop) => !room[prop])
}

function allMatchToQuery(queryRoom: IRoomProps) {
  return (room: IRoomObject): boolean =>
    !Object.entries(queryRoom).some(
      ([prop, query]) =>
        // @ts-ignore
        !room[prop].toLowerCase().includes(query.toLowerCase()),
    )
}

function reduceToRoomsObject(roomsObject: IRoomsObject, room: IRoomObject): IRoomsObject {
  return {
    ...roomsObject,
    [room.id]: room,
  }
}

export function queryDiosphere(queryRoom: IRoomProps, diosphere: IRoomsObject): IRoomsObject {
  return Object.values(diosphere)
    .filter(allKeysExist(queryRoom))
    .filter(allMatchToQuery(queryRoom))
    .reduce(reduceToRoomsObject, {})
}
