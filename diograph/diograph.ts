import { Diory } from '../diory/diory'

import { allKeysExist, allMatchToQuery, reduceToDiographObject } from '../utils/utils'
import { throwErrorIfDioryAlreadyExists, throwErrorIfDioryNotFound } from '../utils/throwErrors'

import { IDiory, IDioryObject, IDiograph, IDiographObject, IDioryProps } from '../types'
import { RoomClient } from '..'
import { validateDiograph } from './validator'

class Diograph implements IDiograph {
  diograph: { [index: string]: IDiory } = {}

  constructor(diographObject?: IDiographObject) {
    this.addDiograph(diographObject)
  }
  diories = (): Array<IDiory> => Object.values(this.diograph).map((diory) => diory)

  addDiograph = (diographObject: IDiographObject = {}): IDiograph => {
    Object.entries(diographObject).forEach(([key, dioryObject]) => {
      try {
        this.addDiory(dioryObject, key)
      } catch (error: any) {
        console.error(error.toString())
      }
    })

    return this
  }

  queryDiograph = (queryDiory: IDioryProps): IDiograph => {
    const diographObject: IDiographObject = Object.values(this.diograph)
      .filter(allKeysExist(queryDiory))
      .filter(allMatchToQuery(queryDiory))
      .reduce(reduceToDiographObject, {})
    return new Diograph(diographObject)
  }

  resetDiograph = (): IDiograph => {
    this.diograph = {}
    return this
  }

  addDiory = (diory: IDioryProps | IDioryObject, key?: string): IDiory => {
    if (key) {
      throwErrorIfDioryAlreadyExists('addDiory', { id: key }, this.diograph)
    }

    const addedDiory: IDiory = new Diory(diory)
    if (!key) {
      throwErrorIfDioryAlreadyExists('addDiory', addedDiory, this.diograph)
    }

    return (this.diograph[key || addedDiory.id] = addedDiory)
  }

  getDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('getDiory', dioryObject, this.diograph)

    const diory = this.diograph[dioryObject.id]
    if (diory.id !== dioryObject.id) {
      throwErrorIfDioryNotFound('getDiory - alias', diory, this.diograph)
      return this.diograph[diory.id]
    }

    return diory
  }

  updateDiory = (dioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('updateDiory', dioryObject, this.diograph)

    return this.getDiory(dioryObject).update(dioryObject)
  }

  removeDiory = (dioryObject: IDioryObject): boolean => {
    throwErrorIfDioryNotFound('removeDiory', dioryObject, this.diograph)

    return delete this.diograph[dioryObject.id]
  }

  addDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('addDioryLink:diory', dioryObject, this.diograph)
    throwErrorIfDioryNotFound('addDioryLink:linkedDiory', linkedDioryObject, this.diograph)

    return this.getDiory(dioryObject).addLink(linkedDioryObject)
  }

  removeDioryLink = (dioryObject: IDioryObject, linkedDioryObject: IDioryObject): IDiory => {
    throwErrorIfDioryNotFound('removeDioryLink:diory', dioryObject, this.diograph)
    throwErrorIfDioryNotFound('removeDioryLink:linkedDiory', linkedDioryObject, this.diograph)

    return this.getDiory(dioryObject).removeLink(linkedDioryObject)
  }

  toObject = (): IDiographObject => {
    const diographObject: IDiographObject = {}
    Object.entries(this.diograph).forEach(([id, diory]) => {
      diographObject[id] = diory.toObject()
    })
    return diographObject
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)

  loadDiograph = async (roomClient: RoomClient) => {
    const diographContents = await roomClient.readDiograph()

    const diograph = JSON.parse(diographContents)
    validateDiograph(diograph)

    if (diograph && Object.keys(diograph).length) {
      this.addDiograph(diograph)
    }
  }

  saveDiograph = async (roomClient: RoomClient) => {
    validateDiograph(JSON.parse(this.toJson()))
    await roomClient.saveDiograph(this.toJson())
  }
}

export { Diograph }
