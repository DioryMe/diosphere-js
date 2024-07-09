import { v4 as uuid } from 'uuid'
import { IDataClient, IConnectionClient, IDiosphere, IRoomsObject, IRoom } from '@diory/types'
import { LocalClient } from '@diograph/local-client'
import { ConnectionClient } from '@diory/connection-client-js'

import { Diosphere } from './diosphere'

// Mocks
jest.mock('uuid')

describe('diosphere', () => {
  let diosphere: IDiosphere
  let room: IRoom

  describe('when new Diosphere() with some room in diosphere object', () => {
    let rooms: IRoomsObject

    beforeEach(() => {
      rooms = {
        'some-id': {
          id: 'some-id',
          text: 'some-text',
        },
      }
      const dataClient: IDataClient = new LocalClient()
      const connectionClient: IConnectionClient = new ConnectionClient([dataClient])
      diosphere = new Diosphere(connectionClient).addDiosphere({ rooms })
      diosphere.saveDiosphere = jest.fn()
    })

    it('adds room to diosphere', () => {
      expect(diosphere.rooms['some-id']).toStrictEqual(expect.objectContaining({ id: 'some-id' }))
    })

    describe('when toObject()', () => {
      it('returns diosphere object with room', () => {
        expect(diosphere.toObject()).toStrictEqual({
          rooms: {
            'some-id': expect.objectContaining({ id: 'some-id' }),
          },
        })
      })
    })

    describe('when initialise()', () => {
      beforeEach(() => {
        diosphere.initialise([{ id: 'some-id', client: 'some-client', address: 'some-address' }])
      })

      it('resets diosphere to empty object', () => {
        expect(diosphere.rooms).toStrictEqual({})
      })

      it('does not save diosphere', () => {
        expect(diosphere.saveDiosphere).not.toHaveBeenCalled()
      })
    })

    describe('when addDiosphere()', () => {
      describe('given other room', () => {
        beforeEach(() => {
          diosphere.addDiosphere({
            rooms: {
              'other-id': { id: 'other-id' },
            },
          })
        })

        it('adds other room to diosphere', () => {
          expect(diosphere.rooms['other-id']).toStrictEqual(
            expect.objectContaining({ id: 'other-id' }),
          )
        })

        it('does not save diosphere', () => {
          expect(diosphere.saveDiosphere).not.toHaveBeenCalled()
        })

        describe('when toObject()', () => {
          it('returns diosphere object with both rooms', () => {
            expect(diosphere.toObject()).toStrictEqual({
              rooms: {
                'other-id': expect.objectContaining({ id: 'other-id' }),
                'some-id': expect.objectContaining({ id: 'some-id' }),
              },
            })
          })
        })
      })
    })

    describe('when addRoom()', () => {
      beforeEach(() => {
        // @ts-ignore
        uuid.mockReturnValue('some-uuid')
      })

      describe('given no room id', () => {
        beforeEach(() => {
          room = diosphere.addRoom({ text: 'created-text' })
        })

        it('creates id to room', () => {
          expect(uuid).toHaveBeenCalled()
        })

        it('adds id room', () => {
          expect(room.id).toBe('some-uuid')
        })

        it('adds text to room', () => {
          expect(room.text).toBe('created-text')
        })

        it('adds room to diosphere', () => {
          expect(diosphere.rooms['some-uuid']).toStrictEqual(
            expect.objectContaining({ id: 'some-uuid' }),
          )
        })

        it('saves diosphere', () => {
          expect(diosphere.saveDiosphere).toHaveBeenCalled()
        })
      })

      describe('given room with new id', () => {
        beforeEach(() => {
          // @ts-ignore
          uuid.mockReset()
          room = diosphere.addRoom({ id: 'new-id' })
        })

        it('does not create new id', () => {
          expect(uuid).not.toHaveBeenCalled()
        })

        it('returns room with id', () => {
          expect(room).toStrictEqual(expect.objectContaining({ id: 'new-id' }))
        })

        it('adds room to diosphere with id', () => {
          expect(diosphere.rooms['new-id']).toStrictEqual(expect.objectContaining({ id: 'new-id' }))
        })

        it('saves diosphere', () => {
          expect(diosphere.saveDiosphere).toHaveBeenCalled()
        })
      })

      describe('given room with existing id', () => {
        beforeEach(() => {
          diosphere.addRoom({ id: 'existing-id' })
        })

        it('throws error', () => {
          expect(() => {
            diosphere.addRoom({ id: 'existing-id' })
          }).toThrow()
        })
      })

      describe('given existing room with new alias key', () => {
        beforeEach(() => {
          room = diosphere.addRoom({ id: 'some-id' }, 'some-key')
        })

        it('returns existing room', () => {
          expect(room).toStrictEqual(expect.objectContaining({ id: 'some-id' }))
        })

        it('adds room with new alias key to diosphere', () => {
          expect(diosphere.rooms['some-key']).toStrictEqual(
            expect.objectContaining({ id: 'some-id' }),
          )
        })

        it('saves diosphere', () => {
          expect(diosphere.saveDiosphere).toHaveBeenCalled()
        })

        describe('when getRoom() with new alias key', () => {
          beforeEach(() => {
            room = diosphere.getRoom({ id: 'some-key' })
          })

          it('returns existing room', () => {
            expect(room).toStrictEqual(expect.objectContaining({ id: 'some-id' }))
          })
        })
      })

      describe('given new room with existing alias key', () => {
        beforeEach(() => {
          diosphere.addRoom({ id: 'some-id' }, 'existing-key')
          room = diosphere.addRoom({ id: 'new-id' }, 'existing-key')
        })

        it('returns new room', () => {
          expect(room).toStrictEqual(expect.objectContaining({ id: 'new-id' }))
        })

        it('adds new room with existing alias key to diosphere', () => {
          expect(diosphere.rooms['existing-key']).toStrictEqual(
            expect.objectContaining({ id: 'new-id' }),
          )
        })

        it('saves diosphere', () => {
          expect(diosphere.saveDiosphere).toHaveBeenCalled()
        })

        describe('when getRoom() with existing alias key', () => {
          beforeEach(() => {
            room = diosphere.getRoom({ id: 'existing-key' })
          })

          it('returns new room', () => {
            expect(room).toStrictEqual(expect.objectContaining({ id: 'new-id' }))
          })
        })
      })
    })

    describe('when updateRoom()', () => {
      beforeEach(() => {
        room = diosphere.updateRoom({ id: 'some-id', text: 'updated-text' })
      })

      it('updates room', () => {
        expect(diosphere.rooms['some-id'].text).toBe('updated-text')
      })

      it('returns updated room', () => {
        expect(room?.text).toBe('updated-text')
      })

      it('saves diosphere', () => {
        expect(diosphere.saveDiosphere).toHaveBeenCalled()
      })

      describe('given room does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diosphere.getRoom({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('when removeRoom()', () => {
      beforeEach(() => {
        diosphere.removeRoom({ id: 'some-id' })
      })

      it('deletes room', () => {
        expect(diosphere.rooms['some-id']).toBe(undefined)
      })

      it('saves diosphere', () => {
        expect(diosphere.saveDiosphere).toHaveBeenCalled()
      })

      describe('given room does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diosphere.getRoom({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('given diosphere with query text in a room', () => {
      beforeEach(() => {
        diosphere.addDiosphere({
          rooms: {
            'query-id': {
              id: 'query-id',
              text: 'query-text',
            },
          },
        })
      })

      describe('when queryRooms() with matching text query', () => {
        let queryRooms: IRoomsObject
        beforeEach(() => {
          queryRooms = diosphere.queryRooms({ text: 'query' })
        })

        it('returns diosphere with query room', () => {
          expect(queryRooms['query-id']).toStrictEqual(expect.objectContaining({ id: 'query-id' }))
        })

        it('does not save diosphere', () => {
          expect(diosphere.saveDiosphere).not.toHaveBeenCalled()
        })

        describe('when toObject()', () => {
          it('returns diosphere object', () => {
            expect(queryRooms).toStrictEqual({
              'query-id': expect.objectContaining({ id: 'query-id' }),
            })
          })
        })
      })

      describe('when queryRooms() without matching text query', () => {
        let queryRooms: IRoomsObject
        beforeEach(() => {
          queryRooms = diosphere.queryRooms({ text: 'other-query' })
        })

        it('returns empty diosphere', () => {
          expect(queryRooms).toStrictEqual({})
        })

        it('does not save diosphere', () => {
          expect(diosphere.saveDiosphere).not.toHaveBeenCalled()
        })

        describe('when toObject()', () => {
          it('returns empty diosphere object', () => {
            expect(queryRooms).toStrictEqual({})
          })
        })
      })
    })

    describe('given diosphere with other room', () => {
      beforeEach(() => {
        room = diosphere.addRoom({ id: 'other-id' })
      })

      describe('when addRoomDoor()', () => {
        beforeEach(() => {
          room = diosphere.addRoomDoor({ id: 'some-id' }, { id: 'other-id' })
        })

        it('adds door between rooms', () => {
          expect(diosphere.rooms['some-id'].doors).toStrictEqual([{ id: 'other-id' }])
        })

        it('saves diosphere', () => {
          expect(diosphere.saveDiosphere).toHaveBeenCalled()
        })

        describe('given room does not exist', () => {
          it('throws error', () => {
            expect(() => {
              room = diosphere.addRoomDoor({ id: 'not-existing-id' }, { id: 'other-id' })
            }).toThrow()
          })
        })

        describe('when removeRoomDoor()', () => {
          beforeEach(() => {
            room = diosphere.removeRoomDoor({ id: 'some-id' }, { id: 'other-id' })
          })

          it('removes door to room', () => {
            expect(diosphere.rooms['some-id'].doors).toBe(undefined)
          })

          it('saves diosphere', () => {
            expect(diosphere.saveDiosphere).toHaveBeenCalled()
          })

          describe('given room does not exist', () => {
            it('throws error', () => {
              expect(() => {
                room = diosphere.removeRoomDoor({ id: 'not-existing-id' }, { id: 'other-id' })
              }).toThrow()
            })
          })

          describe('given door to room does not exist', () => {
            it('throws error', () => {
              expect(() => {
                room = diosphere.removeRoomDoor({ id: 'some-id' }, { id: 'not-existing-id' })
              }).toThrow()
            })
          })
        })
      })
    })

    describe('when addRoomConnection()', () => {
      beforeEach(() => {
        room = diosphere.addRoomConnection(
          { id: 'some-id' },
          { id: 'other-id', client: 'some-connection', address: 'some-address' },
        )
      })

      it('adds connection to room', () => {
        expect(diosphere.rooms['some-id'].connections).toStrictEqual([
          { id: 'other-id', client: 'some-connection', address: 'some-address' },
        ])
      })

      it('saves diosphere', () => {
        expect(diosphere.saveDiosphere).toHaveBeenCalled()
      })

      describe('given room does not exist', () => {
        it('throws error', () => {
          expect(() => {
            room = diosphere.addRoomConnection(
              { id: 'not-existing-id' },
              { id: 'other-id', client: 'some-connection', address: 'some-address' },
            )
          }).toThrow()
        })
      })

      describe('when removeRoomConnection()', () => {
        beforeEach(() => {
          room = diosphere.removeRoomConnection(
            { id: 'some-id' },
            { id: 'other-id', client: 'some-connection', address: 'some-address' },
          )
        })

        it('removes connection from room', () => {
          expect(diosphere.rooms['some-id'].connections).toBe(undefined)
        })

        it('saves diosphere', () => {
          expect(diosphere.saveDiosphere).toHaveBeenCalled()
        })

        describe('given room does not exist', () => {
          it('throws error', () => {
            expect(() => {
              room = diosphere.removeRoomConnection(
                { id: 'not-existing-id' },
                { id: 'other-id', client: 'some-connection', address: 'some-address' },
              )
            }).toThrow()
          })
        })

        describe('given connection does not exist', () => {
          it('throws error', () => {
            expect(() => {
              room = diosphere.removeRoomConnection(
                { id: 'some-id' },
                { id: 'not-existing-id', client: 'some-connection', address: 'some-address' },
              )
            }).toThrow()
          })
        })
      })
    })
  })
})
