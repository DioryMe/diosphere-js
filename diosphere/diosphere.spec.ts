import { IDiosphere, IDiosphereObject, IRoom } from '../types'
import { v4 as uuid } from 'uuid'

import { Diosphere } from './diosphere'

// Mocks
jest.mock('uuid')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('diosphere', () => {
  let diosphere: IDiosphere
  let room: IRoom

  describe('when new Diosphere() with some room in diosphere object', () => {
    let diosphereObject: IDiosphereObject

    beforeEach(() => {
      diosphereObject = {
        'some-id': {
          id: 'some-id',
          text: 'some-text',
        },
      }
      diosphere = new Diosphere(diosphereObject)
    })

    it('adds room to diosphere', () => {
      expect(diosphere.diosphere['some-id']).toStrictEqual(
        expect.objectContaining({ id: 'some-id' }),
      )
    })

    describe('when toObject()', () => {
      it('returns diosphere object', () => {
        expect(diosphere.toObject()).toStrictEqual({
          'some-id': expect.objectContaining({ id: 'some-id' }),
        })
      })
    })

    describe('when addDiosphere()', () => {
      describe('given new room in added diosphere object', () => {
        beforeEach(() => {
          diosphere.addDiosphere({
            'other-id': { id: 'other-id' },
          })
        })

        it('adds room to diosphere', () => {
          expect(diosphere.diosphere['other-id']).toStrictEqual(
            expect.objectContaining({ id: 'other-id' }),
          )
        })

        describe('when toObject()', () => {
          it('returns diosphere object', () => {
            expect(diosphere.toObject()).toStrictEqual({
              'other-id': expect.objectContaining({ id: 'other-id' }),
              'some-id': expect.objectContaining({ id: 'some-id' }),
            })
          })
        })

        describe('when addDoor()', () => {
          let room: IRoom
          beforeEach(() => {
            room = diosphere.addRoomDoor({ id: 'some-id' }, { id: 'other-id' })
          })

          it('creates door between diories', () => {
            expect(diosphere.diosphere['some-id'].doors).toStrictEqual([{ id: 'other-id' }])
          })

          describe('given room does not exist', () => {
            it('throws error', () => {
              expect(() => {
                room = diosphere.addRoomDoor({ id: 'not-existing-id' }, { id: 'other-id' })
              }).toThrow()
            })
          })

          describe('when removeDoor()', () => {
            beforeEach(() => {
              room = diosphere.removeRoomDoor({ id: 'some-id' }, { id: 'other-id' })
            })

            it('deletes door between diories', () => {
              expect(diosphere.diosphere['some-id'].doors).toBe(undefined)
            })

            describe('given room does not exist', () => {
              it('throws error', () => {
                expect(() => {
                  room = diosphere.removeRoomDoor({ id: 'not-existing-id' }, { id: 'other-id' })
                }).toThrow()
              })
            })

            describe('given doored room does not exist', () => {
              it('throws error', () => {
                expect(() => {
                  room = diosphere.removeRoomDoor({ id: 'some-id' }, { id: 'not-existing-id' })
                }).toThrow()
              })
            })
          })
        })
      })

      describe('given existing room in diosphere object', () => {
        it('throws error', () => {
          diosphere.addDiosphere({
            'some-id': {
              id: 'some-id',
            },
          })

          expect(console.error).toHaveBeenCalled()
        })
      })
    })

    describe('when addRoom()', () => {
      beforeEach(() => {
        // @ts-ignore
        uuid.mockReturnValue('some-uuid')
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
        expect(diosphere.diosphere['some-uuid']).toStrictEqual(
          expect.objectContaining({ id: 'some-uuid' }),
        )
      })
    })

    describe('when addRoom() with key', () => {
      beforeEach(() => {
        room = diosphere.addRoom({ id: 'some-id' }, 'some-key')
      })

      it('adds id', () => {
        expect(room.id).toBe('some-id')
      })

      it('adds room alias to diosphere', () => {
        expect(diosphere.diosphere['some-key']).toStrictEqual(
          expect.objectContaining({ id: 'some-id' }),
        )
      })

      describe('when getRoom() with alias key', () => {
        beforeEach(() => {
          room = diosphere.getRoom({ id: 'some-key' })
        })

        it('returns room', () => {
          expect(room.text).toBe('some-text')
        })
      })
    })

    describe('when resetDiosphere()', () => {
      it('resets diosphere to empty object', () => {
        diosphere.resetDiosphere()

        expect(diosphere.diosphere).toStrictEqual({})
      })
    })

    describe('when updateRoom()', () => {
      beforeEach(() => {
        room = diosphere.updateRoom({ id: 'some-id', text: 'updated-text' })
      })

      it('updates room', () => {
        expect(diosphere.diosphere['some-id'].text).toBe('updated-text')
      })

      it('returns updated room', () => {
        expect(room?.text).toBe('updated-text')
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
      let result: boolean | undefined

      beforeEach(() => {
        result = diosphere.removeRoom({ id: 'some-id' })
      })

      it('deletes room', () => {
        expect(diosphere.diosphere['some-id']).toBe(undefined)
      })

      it('returns true', () => {
        expect(result).toBe(true)
      })

      describe('given room does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diosphere.getRoom({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('given diosphere with query text room', () => {
      beforeEach(() => {
        diosphere.addDiosphere({
          'query-id': {
            id: 'query-id',
            text: 'query-text',
          },
        })
      })

      describe('when queryDiosphere() with matching text query', () => {
        let queryDiosphere: IDiosphere
        beforeEach(() => {
          queryDiosphere = diosphere.queryDiosphere({ text: 'query' })
        })

        it('returns diosphere with query room', () => {
          expect(queryDiosphere.diosphere['query-id']).toStrictEqual(
            expect.objectContaining({ id: 'query-id' }),
          )
        })

        describe('when toObject()', () => {
          it('returns diosphere object', () => {
            expect(queryDiosphere.toObject()).toStrictEqual({
              'query-id': expect.objectContaining({ id: 'query-id' }),
            })
          })
        })
      })

      describe('when queryDiosphere() without matching text query', () => {
        let queryDiosphere: IDiosphere
        beforeEach(() => {
          queryDiosphere = diosphere.queryDiosphere({ text: 'other-query' })
        })

        it('returns empty diosphere', () => {
          expect(queryDiosphere.diosphere).toStrictEqual({})
        })

        describe('when toObject()', () => {
          it('returns empty diosphere object', () => {
            expect(queryDiosphere.toObject()).toStrictEqual({})
          })
        })
      })
    })
  })
})
