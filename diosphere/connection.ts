import { ConnectionObject, IDiograph } from '../types'
import { Diograph } from '../diograph/diograph'
import { join } from 'path-browserify'
import { ConnectionClient } from '..'

export interface ContentUrlObject {
  // "CID <-> internalPath" pairs
  [key: string]: string
}

class ContentNotFoundError extends Error {}

class Connection {
  address: string
  contentClientType: string
  contentUrls: ContentUrlObject = {}
  diograph: IDiograph = new Diograph()
  client: ConnectionClient

  constructor(connectionClient: ConnectionClient) {
    this.address = connectionClient.address // full connection address
    this.contentClientType = connectionClient.type
    this.client = connectionClient
  }

  initiateConnection({ contentUrls = {}, diograph = {} }: ConnectionObject) {
    this.contentUrls = contentUrls || {}
    if (diograph && Object.keys(diograph).length) {
      this.diograph.addDiograph(diograph)
    }
  }

  getInternalPath = (contentUrl: string) => {
    if (this.contentUrls[contentUrl]) {
      return join(this.address, this.contentUrls[contentUrl])
    }
  }

  readContent = async (contentUrl: string) => {
    if (!this.contentUrls[contentUrl]) {
      throw new ContentNotFoundError('Nothing found with that contentUrl!')
    }
    return this.client.readItem(this.contentUrls[contentUrl])
  }

  addContent = async (fileContent: ArrayBuffer | string, contentId: string) => {
    await this.client.writeItem(contentId, fileContent)

    this.addContentUrl(contentId)

    return contentId
  }

  addContentUrl = (contentId: string, contentUrl?: string) => {
    this.contentUrls[contentId] = contentUrl || contentId
  }

  // BUG: Doesn't remove contentUrl from connection!!!
  deleteContent = async (contentUrl: string) => {
    const filePath: string | undefined = this.getInternalPath(contentUrl)
    if (!filePath) {
      throw new Error('Nothing found with that contentUrl!')
    }
    return this.client.deleteItem(filePath)
  }

  deleteConnection = async () => {
    // Delete all the content
    await Promise.all(
      Object.keys(this.contentUrls).map((contentUrl) => {
        return this.deleteContent(contentUrl)
      }),
    )
    // Delete content folder
    await this.client.deleteFolder('')
  }

  toObject = (): ConnectionObject => ({
    // TODO: Make some kind of exception for relative paths (for demo-content-room which can't have absolute paths...)
    // address: roomAddress ? makeRelative(roomAddress, this.address) : this.address,
    // - but connection shouldn't know anything about the room...
    address: this.address,
    contentClientType: this.contentClientType,
    contentUrls: this.contentUrls,
    diograph: this.diograph.toObject(),
  })
}

export { Connection, ContentNotFoundError }
