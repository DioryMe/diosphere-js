export { Diograph } from './diograph/diograph'
export { Diory } from './diory/diory'

export { Room } from './diosphere/room'
export { Connection } from './diosphere/connection'
export { RoomClient } from './diosphere/roomClient'

export interface ConnectionClient {
  address: string
  type: string
  readTextItem(url: string): Promise<string>
  readItem(url: string): Promise<ArrayBuffer>
  readToStream(url: string): any
  verify(): Promise<boolean>
  exists(url: string): Promise<boolean>
  writeTextItem(url: string, fileContent: string): Promise<boolean>
  writeItem(url: string, fileContent: ArrayBuffer | string): Promise<boolean>
  deleteItem(url: string): Promise<boolean>
  deleteFolder(url: string): Promise<void>
  list(url: string): Promise<string[]>
}

export interface ConnectionClientConstructor {
  new (address: string, credentials?: any): ConnectionClient
}
