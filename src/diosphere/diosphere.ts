import { join } from 'path-browserify'

import {
  IRoom,
  IRoomObject,
  IRoomsObject,
  IRoomProps,
  IConnectionObject,
  IDoorObject,
  IDiosphereObject,
  IDataClient,
} from '@diory/types'

import { Room } from '../room/room'

import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'
import { debounce } from '../utils/debounce'

function isRoomAlias(roomObject: IRoomObject, room: IRoom) {
  return room.id !== roomObject.id
}

const DIOSPHERE_JSON = 'diosphere.json'

export interface IDiosphere {
  rooms: { [index: string]: IRoom }
  dataClients?: IDataClient[]
  connections?: IConnectionObject[]
  getDiosphere: (connections: IConnectionObject[]) => Promise<IDiosphere>
  saveDiosphere: (diosphereObject: IDiosphereObject) => Promise<IDiosphere>
  addDiosphere: (diosphereObject: IDiosphereObject) => IDiosphere
  resetRooms: () => IDiosphere
  getRoom: (roomObject: IRoomObject) => IRoom
  addRoom: (roomProps: IRoomProps | IRoomObject | IRoom, key?: string) => IRoom
  updateRoom: (roomObject: IRoomObject) => IRoom
  removeRoom: (roomObject: IRoomObject) => void
  addRoomDoor: (roomObject: IRoomObject, doorObject: IDoorObject) => IRoom
  removeRoomDoor: (roomObject: IRoomObject, doorObject: IDoorObject) => IRoom
  addRoomConnection: (roomObject: IRoomObject, connectionObject: IConnectionObject) => IRoom
  removeRoomConnection: (roomObject: IRoomObject, connectionObject: IConnectionObject) => IRoom
  toObject: () => IDiosphereObject
}

class Diosphere implements IDiosphere {
  rooms: { [index: string]: IRoom } = {}
  dataClients: IDataClient[] = []
  connections: IConnectionObject[] = []

  constructor(dataClients?: IDataClient[]) {
    if (dataClients) {
      this.dataClients = dataClients
    }
  }

  findDataClient = (
    dataClients: IDataClient[],
    { client }: IConnectionObject,
  ): IDataClient | undefined => {
    return dataClients?.find(({ type }) => type === client)
  }

  getDiosphere = async (connections: IConnectionObject[]): Promise<IDiosphere> => {
    this.connections = connections // TODO: Store only connections that exist and are able to save
    await Promise.all(
      connections.map(async (connection: IConnectionObject) => {
        const client = this.findDataClient(this.dataClients, connection)
        if (client) {
          const path = join(connection.address, DIOSPHERE_JSON)
          const diosphereString = await client.readTextItem(path)
          this.addDiosphere(JSON.parse(diosphereString))
        }
      }),
    )

    return this
  }

  saveDiosphere = debounce(async () => {
    await Promise.all(
      this.connections.map(async (connection: IConnectionObject) => {
        const client = this.findDataClient(this.dataClients, connection)
        if (client) {
          const path = join(connection.address, DIOSPHERE_JSON)
          await client.writeItem(path, this.toJson())
        }
        return
      }),
    )
  }, 1000)

  addDiosphere = (diosphere: IDiosphereObject): IDiosphere => {
    const { rooms = {} } = diosphere
    Object.entries(rooms).forEach(([key, roomObject]) => {
      try {
        this.rooms[key] = new Room(roomObject)
      } catch (error: any) {
        console.error(error.toString())
      }
    })

    this.saveDiosphere()

    return this
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

      return (this.rooms[key] = room).save(this.saveDiosphere)
    }

    if ('id' in roomObject) {
      throwErrorIfAlreadyExists('addRoom', roomObject.id, Object.keys(this.rooms))
    }

    const room: IRoom = new Room(roomObject)
    return (this.rooms[room.id] = room).save(this.saveDiosphere)
  }

  updateRoom = (roomObject: IRoomObject): IRoom => {
    throwErrorIfNotFound('updateRoom', roomObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).update(roomObject).save(this.saveDiosphere)
  }

  removeRoom = (roomObject: IRoomObject): void => {
    throwErrorIfNotFound('removeRoom', roomObject.id, Object.keys(this.rooms))

    delete this.rooms[roomObject.id]

    this.saveDiosphere()
  }

  addRoomDoor = (roomObject: IRoomObject, doorObject: IDoorObject): IRoom => {
    throwErrorIfNotFound('addRoomDoor:room', roomObject.id, Object.keys(this.rooms))
    throwErrorIfNotFound('addRoomDoor:doorToRoom', doorObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).addDoor(doorObject).save(this.saveDiosphere)
  }

  removeRoomDoor = (roomObject: IRoomObject, doorObject: IDoorObject): IRoom => {
    throwErrorIfNotFound('removeRoomDoor:room', roomObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).removeDoor(doorObject).save(this.saveDiosphere)
  }

  addRoomConnection = (roomObject: IRoomObject, connectionObject: IConnectionObject): IRoom => {
    throwErrorIfNotFound('addRoomConnection:room', roomObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).addConnection(connectionObject).save(this.saveDiosphere)
  }

  removeRoomConnection = (roomObject: IRoomObject, connectionObject: IConnectionObject): IRoom => {
    throwErrorIfNotFound('removeRoomConnection:room', roomObject.id, Object.keys(this.rooms))

    return this.getRoom(roomObject).removeConnection(connectionObject).save(this.saveDiosphere)
  }

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
