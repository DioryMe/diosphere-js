import { IDiory, IDioryProps } from '../types'
import { Diory } from './diory'

jest.mock('uuid', () => ({
  v4: () => 'some-uuid',
}))

const mockDioryDataObject = {
  '@context': 'http://schema.org',
  '@type': 'ImageObject',
  contentUrl: 'https://example.com/image.jpg',
  encodingFormat: 'image/jpeg',
}

describe('Diory', () => {
  let diory: IDiory

  // Mock new Date()
  const someToday = '2022-01-01T00:00:00.000Z'
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(someToday))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('when new Diory(dioryObject)', () => {
    let dioryProps: IDioryProps

    beforeEach(() => {
      dioryProps = {}
    })

    const validStringProps = ['id', 'text', 'image', 'latlng', 'date']
    validStringProps.forEach((validProp) => {
      describe(`given ${validProp}`, () => {
        beforeEach(() => {
          // @ts-ignore
          dioryProps[validProp] = `some-${validProp}`

          diory = new Diory(dioryProps)
        })

        it(`adds ${validProp} to diory ${validProp}`, () => {
          // @ts-ignore
          expect(diory[validProp]).toBe(`some-${validProp}`)
        })

        it('adds today ISO date to diory created', () => {
          expect(diory.created).toBe(someToday)
        })

        it('adds today ISO date to diory modified', () => {
          expect(diory.modified).toBe(someToday)
        })

        describe('when toObject()', () => {
          it(`returns diory object with ${validProp}`, () => {
            const dioryObject = diory.toObject()

            // @ts-ignore
            expect(dioryObject[validProp]).toBe(`some-${validProp}`)
          })
        })
      })
    })

    describe('given data array', () => {
      beforeEach(() => {
        dioryProps.data = [mockDioryDataObject]

        diory = new Diory(dioryProps)
      })

      it('adds data array to diory data', () => {
        expect(diory.data).toStrictEqual([mockDioryDataObject])
      })

      describe('when toObject()', () => {
        it('returns diory object with data array', () => {
          const dioryObject = diory.toObject()

          expect(dioryObject.data).toStrictEqual([mockDioryDataObject])
        })
      })
    })

    describe('given links', () => {
      beforeEach(() => {
        dioryProps.links = { 4: { id: 'some-link' } }

        diory = new Diory(dioryProps)
      })

      it('adds links to diory links', () => {
        expect(diory.links).toStrictEqual({ 4: { id: 'some-link' } })
      })

      describe('when toObject()', () => {
        it('returns diory object with links', () => {
          const dioryObject = diory.toObject()

          expect(dioryObject.links).toStrictEqual({ 4: { id: 'some-link' } })
        })
      })
    })

    describe('given created', () => {
      beforeEach(() => {
        dioryProps.created = 'some-created'

        diory = new Diory(dioryProps)
      })

      it('adds created to diory created', () => {
        expect(diory.created).toStrictEqual('some-created')
      })

      it('adds today ISO date to diory modified', () => {
        expect(diory.modified).toBe(someToday)
      })

      describe('when toObject()', () => {
        it('returns diory object with created', () => {
          const dioryObject = diory.toObject()

          expect(dioryObject.created).toStrictEqual('some-created')
        })
      })
    })

    describe('given modified', () => {
      beforeEach(() => {
        dioryProps.modified = 'some-modified'

        diory = new Diory(dioryProps)
      })

      it('adds modified to diory modified', () => {
        expect(diory.modified).toStrictEqual('some-modified')
      })

      it('adds today ISO date to diory created', () => {
        expect(diory.created).toBe(someToday)
      })

      describe('when toObject()', () => {
        it('returns diory object with created', () => {
          const dioryObject = diory.toObject()

          expect(dioryObject.modified).toStrictEqual('some-modified')
        })
      })
    })

    describe('given any other prop', () => {
      it('does not add other prop to diory', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        // @ts-ignore
        dioryProps.other = 'prop'

        diory = new Diory(dioryProps)

        expect(console.error).toHaveBeenCalledWith(expect.anything(), 'other')
        // @ts-ignore
        expect(diory.other).toBe(undefined)
      })
    })

    describe('given no id', () => {
      beforeEach(() => {
        diory = new Diory({})
      })

      it('adds uuid to id', () => {
        expect(diory.id).toStrictEqual('some-uuid')
      })

      describe('when toObject()', () => {
        it('returns diory object with uuid', () => {
          const dioryObject = diory.toObject()

          expect(dioryObject.id).toStrictEqual('some-uuid')
        })
      })
    })
  })

  describe('given new Diory(dioryObject)', () => {
    beforeEach(() => {
      diory = new Diory({ id: 'some-id' })
    })

    describe('when update(dioryProps)', () => {
      let dioryProps: IDioryProps

      const laterToday = '2022-01-01T12:00:00.000Z'
      beforeEach(() => {
        dioryProps = {}
        jest.setSystemTime(new Date(laterToday))
      })

      const validStringProps = ['text', 'image', 'latlng', 'date']
      validStringProps.forEach((validProp) => {
        describe(`given ${validProp}`, () => {
          beforeEach(() => {
            // @ts-ignore
            dioryProps[validProp] = `some-${validProp}`

            diory.update(dioryProps)
          })

          it(`adds ${validProp} to diory ${validProp}`, () => {
            // @ts-ignore
            expect(diory[validProp]).toBe(`some-${validProp}`)
          })

          it('does not update created ISO date to diory', () => {
            expect(diory.created).toBe(someToday)
          })

          it('updates modified ISO date to diory modified', () => {
            expect(diory.modified).toBe(laterToday)
          })
        })
      })

      describe('given created', () => {
        beforeEach(() => {
          dioryProps.created = 'some-created'

          diory.update(dioryProps)
        })

        it('adds created to diory created', () => {
          expect(diory.created).toStrictEqual('some-created')
        })

        it('updates modified ISO date to diory modified', () => {
          expect(diory.modified).toBe(laterToday)
        })
      })

      describe('given data array', () => {
        it('adds data array to diory data', () => {
          dioryProps.data = [mockDioryDataObject]

          diory.update(dioryProps)

          expect(diory.data).toStrictEqual([mockDioryDataObject])
        })
      })

      describe('given links', () => {
        beforeEach(() => {
          dioryProps.links = {
            5: {
              id: 'link-id',
              path: 'some-path',
            },
          }

          diory.update(dioryProps)
        })

        it('adds links to diory', () => {
          expect(diory.links).toStrictEqual({
            5: {
              id: 'link-id',
              path: 'some-path',
            },
          })
        })
      })

      const nonUpdatedProps = ['id', 'modified']
      nonUpdatedProps.forEach((nonUpdatedProp) => {
        describe(`given ${nonUpdatedProp}`, () => {
          it(`does not update ${nonUpdatedProp} to diory`, () => {
            // @ts-ignore
            dioryProps[nonUpdatedProp] = `other-${nonUpdatedProp}`

            diory.update(dioryProps)

            // @ts-ignore
            expect(diory[nonUpdatedProp]).not.toBe(`other-${nonUpdatedProp}`)
          })
        })
      })

      describe('given other prop', () => {
        it('does not add other prop to diory', () => {
          jest.spyOn(console, 'error').mockImplementation(() => {})
          // @ts-ignore
          dioryProps.other = 'prop'

          diory.update(dioryProps)

          expect(console.error).toHaveBeenCalledWith(expect.anything(), 'other')
          // @ts-ignore
          expect(diory.other).not.toBe('prop')
        })
      })

      const nullableProps = ['text', 'image', 'latlng', 'date']
      nullableProps.forEach((nullableProp) => {
        describe(`given undefined ${nullableProp}`, () => {
          beforeEach(() => {
            // @ts-ignore
            dioryProps[nullableProp] = undefined

            diory.update(dioryProps)
          })

          it(`sets ${nullableProp} to undefined`, () => {
            // @ts-ignore
            expect(diory[nullableProp]).toBeUndefined()
          })

          describe('when toObject()', () => {
            it(`does not include ${nullableProp} key`, () => {
              const dioryObject = diory.toObject()

              // @ts-ignore
              expect(Object.keys(dioryObject)).not.toContain(nullableProps)
            })
          })
        })
      })

      const nonnullableProps = ['id', 'created', 'modified']
      nonnullableProps.forEach((nonnullableProp) => {
        describe(`given undefined ${nonnullableProp}`, () => {
          it(`does not update ${nonnullableProp} to diory`, () => {
            // @ts-ignore
            dioryProps[nonnullableProp] = undefined

            diory.update(dioryProps)

            // @ts-ignore
            expect(diory[nonnullableProp]).not.toBeUndefined()
          })
        })
      })
    })

    describe('when addLink() with existing linked diory', () => {
      beforeEach(() => {
        diory.addLink({ id: 'linked-id' })
      })

      it('creates link to diory', () => {
        expect(diory.links).toStrictEqual({ 'linked-id': { id: 'linked-id' } })
      })

      describe('when removeLink() with existing linked diory', () => {
        it('deletes link from diory', () => {
          diory.removeLink({ id: 'linked-id' })

          expect(diory.links).toBe(undefined)
        })
      })

      describe('when removeLink() without existing linked diory', () => {
        it('throws error', () => {
          expect(() => {
            diory.removeLink({ id: 'not-existing-id' })
          }).toThrow()
        })
      })
    })
  })
})
