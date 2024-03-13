import { join } from 'path-browserify'

import { IDiographObject } from '@diograph/diograph'
import { IConnectionObject, IDiosphereObject } from '../types'
import { IConnectionClient, IDataClient } from './types'

const DIOSPHERE_JSON = 'diosphere.json'
const DIOGRAPH_JSON = 'diograph.json'

class ConnectionClient implements IConnectionClient {
  type: string
  client: IDataClient
  connection: IConnectionObject

  constructor(dataClient: IDataClient, connection: IConnectionObject) {
    this.type = dataClient.type
    this.client = dataClient
    this.connection = connection
  }

  getDiosphere = async () => {
    const diosphereString = await this.client.readTextItem(
      join(this.connection.address, DIOSPHERE_JSON),
    )
    return JSON.parse(diosphereString)
  }

  saveDiosphere = async (diosphereObject: IDiosphereObject) => {
    const diosphereString = JSON.stringify(diosphereObject)
    return this.client.writeItem(join(this.connection.address, DIOSPHERE_JSON), diosphereString)
  }

  getDiograph = async () => {
    const diographString = await this.client.readTextItem(
      join(this.connection.address, DIOGRAPH_JSON),
    )
    return JSON.parse(diographString)
  }

  saveDiograph = async (diographObject: IDiographObject) => {
    const diosphereString = JSON.stringify(diographObject)
    return this.client.writeItem(join(this.connection.address, DIOGRAPH_JSON), diosphereString)
  }
}

export { ConnectionClient }
