import { Room } from './room'
import { ConnectionObject, RoomObject } from '../types'
import { Connection } from './connection'

const roomObject: RoomObject = {
  connections: [
    {
      address: 'some-address',
      contentClientType: 'LocalClient',
      contentUrls: {
        bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji:
          '/Generic content/some-video.mov',
      },
      diograph: {
        'some-id': {
          id: 'some-id',
          text: 'some-diory',
        },
      },
    },
  ],
}

class MockLocalClient {
  type = 'LocalClient'
  address = 'some-address'
  constructor() {}
  readTextItem = jest.fn()
  readItem = jest.fn()
  readToStream = jest.fn()
  verify = jest.fn()
  exists = jest.fn()
  writeTextItem = jest.fn()
  writeItem = jest.fn()
  deleteItem = jest.fn()
  deleteFolder = jest.fn()
  list = jest.fn()
}

describe('Connection', () => {
  let connection: Connection

  beforeEach(async () => {
    const room = new Room()
    room.initiateRoom(
      { LocalClient: { clientConstructor: MockLocalClient } },
      roomObject.connections,
    )
    connection = room.connections[0]
  })

  it('builds from object', () => {
    const duplicateConnection = new Connection(new MockLocalClient())
    duplicateConnection.initiateConnection(connection.toObject())
    expect(duplicateConnection.toObject()).toEqual(connection.toObject())
  })

  describe('toObject', () => {
    let connectionObject: ConnectionObject
    beforeEach(() => {
      connectionObject = connection.toObject()
    })
    it('includes contentUrls', async () => {
      expect(connectionObject.contentUrls).toEqual({
        bafkreifhhmoftoo26lc223k5riwflm6uvgrizwakg5z7n7yruj7gty27ji:
          '/Generic content/some-video.mov',
      })
    })
    it('includes diograph', async () => {
      expect(connectionObject.diograph).toMatchObject({
        'some-id': {
          id: 'some-id',
          text: 'some-diory',
        },
      })
    })
    it('includes contentClient', async () => {
      expect(connectionObject.contentClientType).toEqual('LocalClient')
    })
  })
})
