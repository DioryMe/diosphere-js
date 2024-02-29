import { Room } from '../room/room'

import { queryDiosphere } from '../utils/queryDiosphere'
import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'

import {
  IRoom,
  IRoomObject,
  IDiosphere,
  IDiosphereObject,
  IRoomProps,
  IConnectionObject,
  IDoorObject,
} from '../types'

function isRoomAlias(roomObject: IRoomObject, room: IRoom) {
  return room.id !== roomObject.id
}

class Diosphere implements IDiosphere {
  diosphere: { [index: string]: IRoom } = {}

  constructor(diosphereObject?: IDiosphereObject) {
    this.addDiosphere(diosphereObject)
  }

  addDiosphere = (diosphereObject: IDiosphereObject = {}): IDiosphere => {
    Object.entries(diosphereObject).forEach(([key, roomObject]) => {
      try {
        this.addRoom(roomObject, key)
      } catch (error: any) {
        console.error(error.toString())
      }
    })

    return this
  }

  queryDiosphere = (queryRoom: IRoomProps): IDiosphere => {
    const diosphereObject: IDiosphereObject = queryDiosphere(queryRoom, this.diosphere)
    return new Diosphere(diosphereObject)
  }

  resetDiosphere = (): IDiosphere => {
    this.diosphere = {}
    return this
  }

  addRoom = (room: IRoomProps | IRoomObject, key?: string): IRoom => {
    const addedRoom: IRoom = new Room(room)
    if (key) {
      throwErrorIfAlreadyExists('addRoom - key', key, Object.keys(this.diosphere))
      return (this.diosphere[key] = addedRoom)
    }

    throwErrorIfAlreadyExists('addRoom', addedRoom.id, Object.keys(this.diosphere))
    return (this.diosphere[addedRoom.id] = addedRoom)
  }

  getRoom = (roomObject: IRoomObject): IRoom => {
    throwErrorIfNotFound('getRoom', roomObject.id, Object.keys(this.diosphere))

    const room = this.diosphere[roomObject.id]
    if (isRoomAlias(roomObject, room)) {
      throwErrorIfNotFound('getRoom - alias', room.id, Object.keys(this.diosphere))
      return this.diosphere[room.id]
    }

    return room
  }

  updateRoom = (roomObject: IRoomObject): IRoom => {
    throwErrorIfNotFound('updateRoom', roomObject.id, Object.keys(this.diosphere))

    return this.getRoom(roomObject).update(roomObject)
  }

  removeRoom = (roomObject: IRoomObject): boolean => {
    throwErrorIfNotFound('removeRoom', roomObject.id, Object.keys(this.diosphere))

    return delete this.diosphere[roomObject.id]
  }

  addRoomDoor = (roomObject: IRoomObject, doorObject: IDoorObject): IRoom => {
    throwErrorIfNotFound('addRoomDoor:room', roomObject.id, Object.keys(this.diosphere))
    throwErrorIfNotFound('addRoomDoor:doorToRoom', doorObject.id, Object.keys(this.diosphere))

    return this.getRoom(roomObject).addDoor(doorObject)
  }

  removeRoomDoor = (roomObject: IRoomObject, doorObject: IDoorObject): IRoom => {
    throwErrorIfNotFound('removeRoomDoor:room', roomObject.id, Object.keys(this.diosphere))
    throwErrorIfNotFound('removeRoomDoor:doorToRoom', doorObject.id, Object.keys(this.diosphere))

    return this.getRoom(roomObject).removeDoor(doorObject)
  }

  addRoomConnection = (roomObject: IRoomObject, connectionObject: IConnectionObject): IRoom => {
    throwErrorIfNotFound('addRoomDoor:room', roomObject.id, Object.keys(this.diosphere))
    throwErrorIfNotFound('addRoomDoor:doorToRoom', connectionObject.id, Object.keys(this.diosphere))

    return this.getRoom(roomObject).addConnection(connectionObject)
  }

  removeRoomConnection = (roomObject: IRoomObject, connectionObject: IConnectionObject): IRoom => {
    throwErrorIfNotFound('removeRoomDoor:room', roomObject.id, Object.keys(this.diosphere))
    throwErrorIfNotFound(
      'removeRoomDoor:doorToRoom',
      connectionObject.id,
      Object.keys(this.diosphere),
    )

    return this.getRoom(roomObject).removeConnection(connectionObject)
  }

  toObject = (): IDiosphereObject => {
    const diosphereObject: IDiosphereObject = {}
    Object.entries(this.diosphere).forEach(([id, room]) => {
      diosphereObject[id] = room.toObject()
    })
    return diosphereObject
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diosphere }
