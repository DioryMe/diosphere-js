import {
  IRoom,
  IRoomObject,
  IDiosphere,
  IRoomsObject,
  IRoomProps,
  IConnectionObject,
  IDoorObject,
  IDiosphereObject,
} from '../types'

import { Room } from '../room/room'

import { queryDiosphere } from '../utils/queryDiosphere'
import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'

function isRoomAlias(roomObject: IRoomObject, room: IRoom) {
  return room.id !== roomObject.id
}

class Diosphere implements IDiosphere {
  rooms: { [index: string]: IRoom } = {}

  constructor(diosphereObject?: IDiosphereObject) {
    if (diosphereObject) {
      this.initialise(diosphereObject)
    }
  }

  initialise = (diosphere: IDiosphereObject): IDiosphere => {
    const { rooms = {} } = diosphere
    Object.entries(rooms).forEach(([key, roomObject]) => {
      try {
        this.rooms[key] = new Room(roomObject)
      } catch (error: any) {
        console.error(error.toString())
      }
    })

    return this
  }

  queryRooms = (queryRoom: IRoomProps): IDiosphere => {
    const rooms: IRoomsObject = queryDiosphere(queryRoom, this.toObject().rooms)
    return new Diosphere({ rooms })
  }

  resetRooms = (): IDiosphere => {
    this.rooms = {}
    return this
  }

  getRoom = (roomObject: IRoomObject): IRoom => {
    throwErrorIfNotFound('getRoom', roomObject.id, Object.keys(this.rooms))

    const room = this.rooms[roomObject.id]
    if (isRoomAlias(roomObject, room)) {
      throwErrorIfNotFound('getRoom - alias', room.id, Object.keys(this.rooms))
      return this.rooms[room.id]
    }

    return room
  }

  addRoom = (roomObject: IRoomProps | IRoomObject, key?: string): IRoom => {
    if (key) {
      const room: IRoom =
        'id' in roomObject && !!this.rooms[roomObject.id]
          ? this.getRoom(roomObject)
          : new Room(roomObject)

      if (!this.rooms[room.id]) {
        this.rooms[room.id] = room
      }

      return (this.rooms[key] = room).then(this.saveDiosphere)
    }

    if ('id' in roomObject) {
      throwErrorIfAlreadyExists('addRoom', roomObject.id, Object.keys(this.rooms))
    }

    const room: IRoom = new Room(roomObject)
    return (this.rooms[room.id] = room).then(this.saveDiosphere)
  }

  updateRoom = (roomObject: IRoomObject): IRoom => {
    throwErrorIfNotFound('updateRoom', roomObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).update(roomObject).then(this.saveDiosphere)
  }

  removeRoom = (roomObject: IRoomObject): void => {
    throwErrorIfNotFound('removeRoom', roomObject.id, Object.keys(this.rooms))

    delete this.rooms[roomObject.id]

    this.saveDiosphere()
  }

  addRoomDoor = (roomObject: IRoomObject, doorObject: IDoorObject): IRoom => {
    throwErrorIfNotFound('addRoomDoor:room', roomObject.id, Object.keys(this.rooms))
    throwErrorIfNotFound('addRoomDoor:doorToRoom', doorObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).addDoor(doorObject).then(this.saveDiosphere)
  }

  removeRoomDoor = (roomObject: IRoomObject, doorObject: IDoorObject): IRoom => {
    throwErrorIfNotFound('removeRoomDoor:room', roomObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).removeDoor(doorObject).then(this.saveDiosphere)
  }

  addRoomConnection = (roomObject: IRoomObject, connectionObject: IConnectionObject): IRoom => {
    throwErrorIfNotFound('addRoomConnection:room', roomObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).addConnection(connectionObject).then(this.saveDiosphere)
  }

  removeRoomConnection = (roomObject: IRoomObject, connectionObject: IConnectionObject): IRoom => {
    throwErrorIfNotFound('removeRoomConnection:room', roomObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).removeConnection(connectionObject).then(this.saveDiosphere)
  }

  saveDiosphere = (): void => {}

  toObject = (): { rooms: IRoomsObject; room?: IRoomObject } => {
    const rooms: IRoomsObject = {}
    Object.entries(this.rooms).forEach(([id, room]) => {
      rooms[id] = room.toObject()
    })
    return { rooms }
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diosphere }
