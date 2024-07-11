import { IRoomProps, IRoomObject, IRoomsObject } from '@diory/types'

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

export function queryRooms(queryRoom: IRoomProps, rooms: IRoomsObject): IRoomsObject {
  return Object.values(rooms)
    .filter(allKeysExist(queryRoom))
    .filter(allMatchToQuery(queryRoom))
    .reduce(reduceToRoomsObject, {})
}
