import { v4 as uuid } from 'uuid'

import { IRoom, IRoomObject, IRoomProps, IDoorObject, IConnectionObject } from '../types'

import { propIsValid, valueIsValid, valueExists } from '../utils/validators'
import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'
import { getIds } from '../utils/getIds'
import { removeById } from '../utils/removeById'

class Room implements IRoom {
  id: string
  text?: string = undefined
  doors?: IDoorObject[] = undefined
  connections?: IConnectionObject[] = undefined
  created?: string = undefined
  modified?: string = undefined

  constructor(roomObject: IRoomObject | IRoomProps) {
    this.id = 'id' in roomObject ? roomObject.id : uuid()
    this.update(roomObject, false)
  }

  update = (roomProps: IRoomProps, modify = true): IRoom => {
    Object.entries(roomProps).forEach(([prop, value]) => {
      // @ts-ignore
      if (!propIsValid(this, prop) || !valueIsValid(value)) {
        return
      }

      // @ts-ignore
      this[prop] = value
    })

    if (!this.created) {
      this.created = new Date().toISOString()
    }

    if (modify || !this.modified) {
      this.modified = new Date().toISOString()
    }

    return this
  }

  addDoor(doorObject: IDoorObject): IRoom {
    throwErrorIfAlreadyExists('addDoor', doorObject.id, getIds(this.doors))

    if (!this.doors) {
      this.doors = []
    }

    this.doors.push(doorObject)

    return this.update({})
  }

  removeDoor(doorObject: IDoorObject): IRoom {
    throwErrorIfNotFound('removeDoor', doorObject.id, getIds(this.doors))

    this.doors = removeById(doorObject.id, this.doors)

    return this.update({})
  }

  addConnection(connectionObject: IConnectionObject): IRoom {
    throwErrorIfAlreadyExists('addConnection', connectionObject.id, getIds(this.connections))

    if (!this.connections) {
      this.connections = []
    }

    this.connections.push(connectionObject)

    return this.update({})
  }

  removeConnection(connectionObject: IConnectionObject): IRoom {
    throwErrorIfNotFound('removeConnection', connectionObject.id, getIds(this.connections))

    this.connections = removeById(connectionObject.id, this.connections)

    return this.update({})
  }

  then = (callback?: () => void): IRoom => {
    if (callback) {
      callback()
    }

    return this
  }

  toObject = (): IRoomObject => {
    const roomObject: IRoomObject = { id: this.id }
    Object.getOwnPropertyNames(this).forEach((prop) => {
      // @ts-ignore
      const value: any = this[prop]
      if (valueIsValid(value) && valueExists(value)) {
        // @ts-ignore
        roomObject[prop] = value
      }
    })
    return roomObject
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Room }
