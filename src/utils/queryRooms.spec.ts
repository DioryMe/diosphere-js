import { v4 as uuid } from 'uuid'
import { IRoomsObject } from '@diory/types'

import { queryRooms } from './queryRooms'

// Mocks
jest.mock('uuid')

describe('queryRooms', () => {
  let rooms: IRoomsObject

  describe('given rooms with query text in a room', () => {
    beforeEach(() => {
      rooms = {
        'query-id': {
          id: 'query-id',
          text: 'query-text',
        }
      }
    })

    describe('when queryRooms() with matching text query', () => {
      let queriedRooms: IRoomsObject
      beforeEach(() => {
        queriedRooms = queryRooms({ text: 'query' }, rooms)
      })

      it('returns diosphere with query room', () => {
        expect(queriedRooms['query-id']).toStrictEqual(expect.objectContaining({ id: 'query-id' }))
      })
    })

    describe('when queryRooms() without matching text query', () => {
      let queriedRooms: IRoomsObject
      beforeEach(() => {
        queriedRooms = queryRooms({ text: 'other-query' }, rooms)
      })

      it('returns empty diosphere', () => {
        expect(queriedRooms).toStrictEqual({})
      })
    })
  })
})
