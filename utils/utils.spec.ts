import { IDioryObject } from '../types'
import { allKeysExist } from './utils'

describe('allKeysExist()', () => {
  describe('given text query', () => {
    let allKeysExistWithTextQuery: (dioryObject: IDioryObject) => boolean
    beforeEach(() => {
      allKeysExistWithTextQuery = allKeysExist({ text: 'some-text' })
    })

    it('returns true with text prop', () => {
      const result = allKeysExistWithTextQuery({ id: 'some-id', text: 'other-text' })

      expect(result).toBe(true)
    })

    it('returns false without text prop', () => {
      const result = allKeysExistWithTextQuery({ id: 'some-id' })

      expect(result).toBe(false)
    })
  })
})
