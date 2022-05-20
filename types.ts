import { RoomClient } from '.'

export interface IDataObject {
  '@context': string
  '@type': string
  contentUrl: string
  encodingFormat: string
  height?: number
  width?: number
}

export interface ILinkObject {
  id: string
  path?: string
}

export interface IDioryProps {
  text?: string
  image?: string
  latlng?: string
  date?: string
  data?: IDataObject[]
  links?: { [index: string]: ILinkObject }
  created?: string
  modified?: string
}

export interface IDioryObject extends IDioryProps {
  id: string
}

export interface IDiory extends IDioryObject {
  update: (dioryProps: IDioryProps, addOnly?: boolean) => IDiory
  addLink: (linkedDioryObject: IDioryObject) => IDiory
  removeLink: (linkedDioryObject: IDioryObject) => IDiory
  toObject: () => IDioryObject
  toObjectWithoutImage: () => IDioryObject
}

export interface IDiographObject {
  // TODO: Make '/' required
  // '/': IDioryObject
  [key: string]: IDioryObject
}

export interface IDiograph {
  diograph: { [index: string]: IDiory }
  diories: () => Array<IDiory>
  addDiograph: (diographObject: IDiographObject, rootId?: string) => IDiograph
  queryDiograph: (dioryObject: IDioryProps) => IDiograph
  resetDiograph: () => IDiograph
  getDiory: (dioryObject: IDioryObject) => IDiory
  addDiory: (dioryProps: IDioryProps | IDioryObject | IDiory, key?: string) => IDiory
  updateDiory: (dioryObject: IDioryObject) => IDiory
  removeDiory: (dioryObject: IDioryObject) => boolean
  addDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  removeDioryLink: (dioryObject: IDioryObject, linkedDioryObject: IDioryObject) => IDiory
  toObject: () => IDiographObject
  loadDiograph: (roomClient: RoomClient) => Promise<void>
  saveDiograph: (roomClient: RoomClient) => Promise<void>
}

export interface RoomObject {
  connections: ConnectionObject[]
  diograph?: IDiographObject
}

export interface ContentUrls {
  [key: string]: string
}

export interface ConnectionObject {
  address: string
  contentClientType: string
  contentUrls?: ContentUrls
  diograph?: IDiographObject
}
