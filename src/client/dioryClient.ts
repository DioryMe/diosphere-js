import { Diograph, IDiograph, IDiory, IDioryObject } from '@diograph/diograph'

import { IConnectionObject, IDiosphere, IRoom, IRoomObject } from '../types'
import { Diosphere } from '../diosphere/diosphere'

import { IConnectionClient, IDataClient, IDioryClient } from './types'
import { ConnectionClient } from './connectionClient'

function getDataClient(
  dataClients: IDataClient[],
  { client }: IConnectionObject,
): IDataClient | undefined {
  return dataClients.find(({ type }) => type === client)
}

function getConnectionClients(
  dataClients: IDataClient[],
  connections: IConnectionObject[],
): IConnectionClient[] {
  return connections
    .filter(({ client }) => dataClients.some(({ type }) => type === client))
    .map((connection) => {
      const dataClient = getDataClient(dataClients, connection)
      return new ConnectionClient(dataClient!, connection)
    }) as IConnectionClient[]
}

class DioryClient implements IDioryClient {
  dataClients: IDataClient[] = []
  connections: IConnectionObject[] = []
  diosphere: IDiosphere
  room?: IRoom
  diograph: IDiograph
  diory?: IDiory

  constructor(dataClients: IDataClient[]) {
    this.dataClients = dataClients

    this.diosphere = new Diosphere()
    this.diograph = new Diograph()

    this.diosphere.saveDiosphere = this.saveDiosphere
    this.diograph.saveDiograph = this.saveDiograph
  }

  initialise = async (connections: IConnectionObject[]): Promise<void> => {
    this.connections = connections

    await this.getDiosphere()
    await this.enterRoom({ id: '/' })
    await this.focusDiory({ id: '/' })

    return
  }

  getDiosphere = async (): Promise<void> => {
    console.info('getDiosphere', this.connections)
    if (this.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.connections)

      await Promise.all(
        connectionClients.map(async (connectionClient) => {
          const diosphereObject = await connectionClient.getDiosphere()
          console.info(diosphereObject)
          return this.diosphere.initialise(diosphereObject)
        }),
      )
    }

    return
  }

  saveDiosphere = async (): Promise<void> => {
    console.info('saveDiosphere', this.connections)
    if (this.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.connections)

      await Promise.all(
        connectionClients.map((connectionClient) => {
          console.info(this.diosphere.toObject())
          return connectionClient.saveDiosphere(this.diosphere.toObject())
        }),
      )
    }

    return
  }

  enterRoom = async (roomObject: IRoomObject): Promise<IRoom> => {
    this.room = this.diosphere.getRoom(roomObject)

    await this.getDiograph()

    return this.room
  }

  getDiograph = async (): Promise<void> => {
    console.info('getDiograph', this.room?.connections)
    if (this.room?.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.room.connections)

      await Promise.all(
        connectionClients.map(async (connectionClient) => {
          const diographObject = await connectionClient.getDiograph()
          console.info(diographObject)
          return this.diograph.initialise(diographObject)
        }),
      )
    }

    return
  }

  saveDiograph = async (): Promise<void> => {
    console.info('saveDiograph', this.room?.connections)
    if (this.room?.connections) {
      const connectionClients = getConnectionClients(this.dataClients, this.room.connections)

      await Promise.all(
        connectionClients.map((connectionClient) => {
          console.info(this.diograph.toObject())
          return connectionClient.saveDiograph(this.diograph.toObject())
        }),
      )
    }

    return
  }

  focusDiory = (dioryObject: IDioryObject): IDiory => {
    return (this.diory = this.diograph.getDiory(dioryObject))
  }
}

export { DioryClient }
