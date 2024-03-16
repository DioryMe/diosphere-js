import { v4 as uuid } from 'uuid'

import { propIsValid, valueIsValid, valueExists } from './validators'
import { throwErrorIfNotFound } from '../utils/throwErrorIfNotFound'
import { throwErrorIfAlreadyExists } from '../utils/throwErrorIfAlreadyExists'
import { getIds } from '../utils/getIds'

import { IRoom, IRoomObject, IRoomProps, IDoorObject, IConnectionObject } from '../types'

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

    const doorIndex = getIds(this.doors)?.indexOf(doorObject.id)
    if (doorIndex != -1) {
      this.doors?.splice(doorIndex!, 1)
    }

    if (this.doors!.length === 0) {
      this.doors = undefined
    }

    return this.update({})
  }

  addConnection(connectionObject: IConnectionObject): IRoom {
    throwErrorIfAlreadyExists('addDoor', connectionObject.id, getIds(this.doors))

    if (!this.connections) {
      this.connections = []
    }

    this.connections.push(connectionObject)

    return this.update({})
  }

  removeConnection(connectionObject: IConnectionObject): IRoom {
    throwErrorIfNotFound('removeDoor', connectionObject.id, getIds(this.connections))

    const index = getIds(this.connections)?.indexOf(connectionObject.id)
    if (index != -1) {
      this.connections?.splice(index!, 1)
    }

    if (this.connections!.length === 0) {
      this.connections = undefined
    }

    return this.update({})
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
