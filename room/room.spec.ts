import { IRoom, IRoomProps } from '../types'
import { Room } from './room'

jest.mock('uuid', () => ({
  v4: () => 'some-uuid',
}))

describe('Room', () => {
  let room: IRoom

  // Mock new Date()
  const someToday = '2022-01-01T00:00:00.000Z'
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(someToday))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('when new Room(roomObject)', () => {
    let roomProps: IRoomProps

    beforeEach(() => {
      roomProps = {}
    })

    const validStringProps = ['id', 'text']
    validStringProps.forEach((validProp) => {
      describe(`given ${validProp}`, () => {
        beforeEach(() => {
          // @ts-ignore
          roomProps[validProp] = `some-${validProp}`

          room = new Room(roomProps)
        })

        it(`adds ${validProp} to room ${validProp}`, () => {
          // @ts-ignore
          expect(room[validProp]).toBe(`some-${validProp}`)
        })

        it('adds today ISO date to room created', () => {
          expect(room.created).toBe(someToday)
        })

        it('adds today ISO date to room modified', () => {
          expect(room.modified).toBe(someToday)
        })

        describe('when toObject()', () => {
          it(`returns room object with ${validProp}`, () => {
            const roomObject = room.toObject()

            // @ts-ignore
            expect(roomObject[validProp]).toBe(`some-${validProp}`)
          })
        })
      })
    })

    describe('given doors array', () => {
      beforeEach(() => {
        roomProps.doors = [
          {
            id: 'some-door-id',
          },
        ]

        room = new Room(roomProps)
      })

      it('adds doors array to room doors', () => {
        expect(room.doors).toStrictEqual([
          {
            id: 'some-door-id',
          },
        ])
      })

      describe('when toObject()', () => {
        it('returns room object with doors array', () => {
          const roomObject = room.toObject()

          expect(roomObject.doors).toStrictEqual([
            {
              id: 'some-door-id',
            },
          ])
        })
      })
    })

    describe('given connections array', () => {
      const someConnection = {
        id: 'some-connection-id',
        connector: 'some-connector',
        address: 'some-address',
      }

      beforeEach(() => {
        roomProps.connections = [someConnection]

        room = new Room(roomProps)
      })

      it('adds doors array to room doors', () => {
        expect(room.connections).toStrictEqual([someConnection])
      })

      describe('when toObject()', () => {
        it('returns room object with doors array', () => {
          const roomObject = room.toObject()

          expect(roomObject.connections).toStrictEqual([someConnection])
        })
      })
    })

    describe('given created', () => {
      beforeEach(() => {
        roomProps.created = 'some-created'

        room = new Room(roomProps)
      })

      it('adds created to room created', () => {
        expect(room.created).toStrictEqual('some-created')
      })

      it('adds today ISO date to room modified', () => {
        expect(room.modified).toBe(someToday)
      })

      describe('when toObject()', () => {
        it('returns room object with created', () => {
          const roomObject = room.toObject()

          expect(roomObject.created).toStrictEqual('some-created')
        })
      })
    })

    describe('given modified', () => {
      beforeEach(() => {
        roomProps.modified = 'some-modified'

        room = new Room(roomProps)
      })

      it('adds modified to room modified', () => {
        expect(room.modified).toStrictEqual('some-modified')
      })

      it('adds today ISO date to room created', () => {
        expect(room.created).toBe(someToday)
      })

      describe('when toObject()', () => {
        it('returns room object with created', () => {
          const roomObject = room.toObject()

          expect(roomObject.modified).toStrictEqual('some-modified')
        })
      })
    })

    describe('given any other prop', () => {
      it('does not add other prop to room', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        // @ts-ignore
        roomProps.other = 'prop'

        room = new Room(roomProps)

        expect(console.error).toHaveBeenCalledWith(expect.anything(), 'other')
        // @ts-ignore
        expect(room.other).toBe(undefined)
      })
    })

    describe('given no id', () => {
      beforeEach(() => {
        room = new Room({})
      })

      it('adds uuid to id', () => {
        expect(room.id).toStrictEqual('some-uuid')
      })

      describe('when toObject()', () => {
        it('returns room object with uuid', () => {
          const roomObject = room.toObject()

          expect(roomObject.id).toStrictEqual('some-uuid')
        })
      })
    })
  })

  describe('given new Room(roomObject)', () => {
    beforeEach(() => {
      room = new Room({ id: 'some-id' })
    })

    describe('when update(roomProps)', () => {
      let roomProps: IRoomProps

      const laterToday = '2022-01-01T12:00:00.000Z'
      beforeEach(() => {
        roomProps = {}
        jest.setSystemTime(new Date(laterToday))
      })

      const validStringProps = ['text']
      validStringProps.forEach((validProp) => {
        describe(`given ${validProp}`, () => {
          beforeEach(() => {
            // @ts-ignore
            roomProps[validProp] = `some-${validProp}`

            room.update(roomProps)
          })

          it(`adds ${validProp} to room ${validProp}`, () => {
            // @ts-ignore
            expect(room[validProp]).toBe(`some-${validProp}`)
          })

          it('does not update created ISO date to room', () => {
            expect(room.created).toBe(someToday)
          })

          it('updates modified ISO date to room modified', () => {
            expect(room.modified).toBe(laterToday)
          })
        })
      })

      describe('given created', () => {
        beforeEach(() => {
          roomProps.created = 'some-created'

          room.update(roomProps)
        })

        it('adds created to room created', () => {
          expect(room.created).toStrictEqual('some-created')
        })

        it('updates modified ISO date to room modified', () => {
          expect(room.modified).toBe(laterToday)
        })
      })

      describe('given doors array', () => {
        it('adds doors array to room doors', () => {
          roomProps.doors = [
            {
              id: 'some-door-id',
            },
          ]

          room.update(roomProps)

          expect(room.doors).toStrictEqual([
            {
              id: 'some-door-id',
            },
          ])
        })
      })

      describe('given connections array', () => {
        it('adds connections array to room connections', () => {
          const someConnection = {
            id: 'some-connection-id',
            connector: 'some-connector',
            address: 'some-address',
          }
          roomProps.connections = [someConnection]

          room.update(roomProps)

          expect(room.connections).toStrictEqual([someConnection])
        })
      })

      const nonUpdatedProps = ['id', 'modified']
      nonUpdatedProps.forEach((nonUpdatedProp) => {
        describe(`given ${nonUpdatedProp}`, () => {
          it(`does not update ${nonUpdatedProp} to room`, () => {
            // @ts-ignore
            roomProps[nonUpdatedProp] = `other-${nonUpdatedProp}`

            room.update(roomProps)

            // @ts-ignore
            expect(room[nonUpdatedProp]).not.toBe(`other-${nonUpdatedProp}`)
          })
        })
      })

      describe('given other prop', () => {
        it('does not add other prop to room', () => {
          jest.spyOn(console, 'error').mockImplementation(() => {})
          // @ts-ignore
          roomProps.other = 'prop'

          room.update(roomProps)

          expect(console.error).toHaveBeenCalledWith(expect.anything(), 'other')
          // @ts-ignore
          expect(room.other).not.toBe('prop')
        })
      })

      const nullableProps = ['text', 'image', 'latlng', 'date']
      nullableProps.forEach((nullableProp) => {
        describe(`given undefined ${nullableProp}`, () => {
          beforeEach(() => {
            // @ts-ignore
            roomProps[nullableProp] = undefined

            room.update(roomProps)
          })

          it(`sets ${nullableProp} to undefined`, () => {
            // @ts-ignore
            expect(room[nullableProp]).toBeUndefined()
          })

          describe('when toObject()', () => {
            it(`does not include ${nullableProp} key`, () => {
              const roomObject = room.toObject()

              // @ts-ignore
              expect(Object.keys(roomObject)).not.toContain(nullableProps)
            })
          })
        })
      })

      const nonnullableProps = ['id', 'created', 'modified']
      nonnullableProps.forEach((nonnullableProp) => {
        describe(`given undefined ${nonnullableProp}`, () => {
          it(`does not update ${nonnullableProp} to room`, () => {
            // @ts-ignore
            roomProps[nonnullableProp] = undefined

            room.update(roomProps)

            // @ts-ignore
            expect(room[nonnullableProp]).not.toBeUndefined()
          })
        })
      })
    })

    describe('when addDoor() with existing room', () => {
      beforeEach(() => {
        room.addDoor({ id: 'door-to-room-id' })
      })

      it('creates door to room', () => {
        expect(room.doors).toStrictEqual([{ id: 'door-to-room-id' }])
      })

      describe('when removeDoor() with existing room', () => {
        it('deletes door from room', () => {
          room.removeDoor({ id: 'door-to-room-id' })

          expect(room.doors).toBe(undefined)
        })
      })

      describe('when removeDoor() without existing room', () => {
        it('throws error', () => {
          expect(() => {
            room.removeDoor({ id: 'not-existing-id' })
          }).toThrow()
        })
      })
    })
  })
})
