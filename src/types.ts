export interface IDoorObject {
  id: string
  path?: string
}

export interface IConnectionObject {
  id: string
  client: string
  address: string
}

export interface IRoomProps {
  text?: string
  doors?: IDoorObject[]
  connections?: IConnectionObject[]
  created?: string
  modified?: string
}

export interface IRoomObject extends IRoomProps {
  id: string
}

export interface IRoom extends IRoomObject {
  update: (roomProps: IRoomProps, addOnly?: boolean) => IRoom
  addDoor: (doorObject: IDoorObject) => IRoom
  removeDoor: (doorObject: IDoorObject) => IRoom
  addConnection: (connectionObject: IConnectionObject) => IRoom
  removeConnection: (connectionObject: IConnectionObject) => IRoom
  then: (callback?: () => void) => IRoom
  toObject: () => IRoomObject
}

export interface IRoomsObject {
  // TODO: Make '/' required
  // '/': IRoomObject
  [key: string]: IRoomObject
}

export interface IDiosphereObject {
  rooms: IRoomsObject
}

export interface IDiosphere {
  rooms: { [index: string]: IRoom }
  initialise: (diosphereObject: IDiosphereObject) => IDiosphere
  queryRooms: (roomObject: IRoomProps) => IDiosphere
  resetRooms: () => IDiosphere
  getRoom: (roomObject: IRoomObject) => IRoom
  addRoom: (roomProps: IRoomProps | IRoomObject | IRoom, key?: string) => IRoom
  updateRoom: (roomObject: IRoomObject) => IRoom
  removeRoom: (roomObject: IRoomObject) => void
  addRoomDoor: (roomObject: IRoomObject, doorObject: IDoorObject) => IRoom
  removeRoomDoor: (roomObject: IRoomObject, doorObject: IDoorObject) => IRoom
  addRoomConnection: (roomObject: IRoomObject, connectionObject: IConnectionObject) => IRoom
  removeRoomConnection: (roomObject: IRoomObject, connectionObject: IConnectionObject) => IRoom
  saveDiosphere: (callback?: () => void) => void
  toObject: () => IDiosphereObject
}
