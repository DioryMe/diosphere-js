import { IRoomProps, IRoomObject, IDiosphereObject } from '../types'

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

function reduceToDiosphereObject(
  diosphereObject: IDiosphereObject,
  room: IRoomObject,
): IDiosphereObject {
  return {
    ...diosphereObject,
    [room.id]: room,
  }
}

export function queryDiosphere(
  queryRoom: IRoomProps,
  diosphere: IDiosphereObject,
): IDiosphereObject {
  return Object.values(diosphere)
    .filter(allKeysExist(queryRoom))
    .filter(allMatchToQuery(queryRoom))
    .reduce(reduceToDiosphereObject, {})
}
