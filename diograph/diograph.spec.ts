import { IDiograph, IDiographObject, IDiory } from '../types'
import { v4 as uuid } from 'uuid'

import { Diograph } from './diograph'

// Mocks
jest.mock('uuid')
jest.spyOn(console, 'error').mockImplementation(() => {})

describe('diograph', () => {
  let diograph: IDiograph
  let diory: IDiory

  describe('when new Diograph() with some diory in diograph object', () => {
    let diographObject: IDiographObject

    beforeEach(() => {
      diographObject = {
        'some-id': {
          id: 'some-id',
          text: 'some-text',
        },
      }
      diograph = new Diograph(diographObject)
    })

    it('adds diory to diograph', () => {
      expect(diograph.diograph['some-id']).toStrictEqual(expect.objectContaining({ id: 'some-id' }))
    })

    describe('when toObject()', () => {
      it('returns diograph object', () => {
        expect(diograph.toObject()).toStrictEqual({
          'some-id': expect.objectContaining({ id: 'some-id' }),
        })
      })
    })

    describe('when addDiograph()', () => {
      describe('given new diory in added diograph object', () => {
        beforeEach(() => {
          diograph.addDiograph({
            'other-id': { id: 'other-id' },
          })
        })

        it('adds diory to diograph', () => {
          expect(diograph.diograph['other-id']).toStrictEqual(
            expect.objectContaining({ id: 'other-id' }),
          )
        })

        describe('when toObject()', () => {
          it('returns diograph object', () => {
            expect(diograph.toObject()).toStrictEqual({
              'other-id': expect.objectContaining({ id: 'other-id' }),
              'some-id': expect.objectContaining({ id: 'some-id' }),
            })
          })
        })

        describe('when addLink()', () => {
          let diory: IDiory
          beforeEach(() => {
            diory = diograph.addDioryLink({ id: 'some-id' }, { id: 'other-id' })
          })

          it('creates link between diories', () => {
            expect(diograph.diograph['some-id'].links).toStrictEqual({
              'other-id': { id: 'other-id' },
            })
          })

          describe('given diory does not exist', () => {
            it('throws error', () => {
              expect(() => {
                diory = diograph.addDioryLink({ id: 'not-existing-id' }, { id: 'other-id' })
              }).toThrow()
            })
          })

          describe('when removeLink()', () => {
            beforeEach(() => {
              diory = diograph.removeDioryLink({ id: 'some-id' }, { id: 'other-id' })
            })

            it('deletes link between diories', () => {
              expect(diograph.diograph['some-id'].links).toBe(undefined)
            })

            describe('given diory does not exist', () => {
              it('throws error', () => {
                expect(() => {
                  diory = diograph.removeDioryLink({ id: 'not-existing-id' }, { id: 'other-id' })
                }).toThrow()
              })
            })

            describe('given linked diory does not exist', () => {
              it('throws error', () => {
                expect(() => {
                  diory = diograph.removeDioryLink({ id: 'some-id' }, { id: 'not-existing-id' })
                }).toThrow()
              })
            })
          })
        })
      })

      describe('given existing diory in diograph object', () => {
        it('throws error', () => {
          diograph.addDiograph({
            'some-id': {
              id: 'some-id',
            },
          })

          expect(console.error).toHaveBeenCalled()
        })
      })
    })

    describe('when addDiory()', () => {
      beforeEach(() => {
        // @ts-ignore
        uuid.mockReturnValue('some-uuid')
        diory = diograph.addDiory({ text: 'created-text' })
      })

      it('creates id to diory', () => {
        expect(uuid).toHaveBeenCalled()
      })

      it('adds id diory', () => {
        expect(diory.id).toBe('some-uuid')
      })

      it('adds text to diory', () => {
        expect(diory.text).toBe('created-text')
      })

      it('adds diory to diograph', () => {
        expect(diograph.diograph['some-uuid']).toStrictEqual(
          expect.objectContaining({ id: 'some-uuid' }),
        )
      })
    })

    describe('when addDiory() with key', () => {
      beforeEach(() => {
        diory = diograph.addDiory({ id: 'some-id' }, 'some-key')
      })

      it('adds id', () => {
        expect(diory.id).toBe('some-id')
      })

      it('adds diory alias to diograph', () => {
        expect(diograph.diograph['some-key']).toStrictEqual(
          expect.objectContaining({ id: 'some-id' }),
        )
      })

      describe('when getDiory() with alias key', () => {
        beforeEach(() => {
          diory = diograph.getDiory({ id: 'some-key' })
        })

        it('returns diory', () => {
          expect(diory.text).toBe('some-text')
        })
      })
    })

    describe('when resetDiograph()', () => {
      it('resets diograph to empty object', () => {
        diograph.resetDiograph()

        expect(diograph.diograph).toStrictEqual({})
      })
    })

    describe('when updateDiory()', () => {
      beforeEach(() => {
        diory = diograph.updateDiory({ id: 'some-id', text: 'updated-text' })
      })

      it('updates diory', () => {
        expect(diograph.diograph['some-id'].text).toBe('updated-text')
      })

      it('returns updated diory', () => {
        expect(diory?.text).toBe('updated-text')
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diograph.getDiory({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('when removeDiory()', () => {
      let result: boolean | undefined

      beforeEach(() => {
        result = diograph.removeDiory({ id: 'some-id' })
      })

      it('deletes diory', () => {
        expect(diograph.diograph['some-id']).toBe(undefined)
      })

      it('returns true', () => {
        expect(result).toBe(true)
      })

      describe('given diory does not exist', () => {
        it('throws error', () => {
          expect(() => {
            diograph.getDiory({ id: 'other-id' })
          }).toThrow()
        })
      })
    })

    describe('given diograph with query text diory', () => {
      beforeEach(() => {
        diograph.addDiograph({
          'query-id': {
            id: 'query-id',
            text: 'query-text',
          },
        })
      })

      describe('when queryDiograph() with matching text query', () => {
        let queryDiograph: IDiograph
        beforeEach(() => {
          queryDiograph = diograph.queryDiograph({ text: 'query' })
        })

        it('returns diograph with query diory', () => {
          expect(queryDiograph.diograph['query-id']).toStrictEqual(
            expect.objectContaining({ id: 'query-id' }),
          )
        })

        describe('when toObject()', () => {
          it('returns diograph object', () => {
            expect(queryDiograph.toObject()).toStrictEqual({
              'query-id': expect.objectContaining({ id: 'query-id' }),
            })
          })
        })
      })

      describe('when queryDiograph() without matching text query', () => {
        let queryDiograph: IDiograph
        beforeEach(() => {
          queryDiograph = diograph.queryDiograph({ text: 'other-query' })
        })

        it('returns empty diograph', () => {
          expect(queryDiograph.diograph).toStrictEqual({})
        })

        describe('when toObject()', () => {
          it('returns empty diograph object', () => {
            expect(queryDiograph.toObject()).toStrictEqual({})
          })
        })
      })
    })
  })
})
