import { v4 as uuid } from 'uuid'
import { propIsValid, valueIsValid, valueExists } from '../utils/validators'
import { throwErrorIfLinkAlreadyExists, throwErrorIfLinkNotFound } from '../utils/throwErrors'

import { IDataObject, IDiory, IDioryObject, IDioryProps, ILinkObject } from '../types'

function getLinkKey(linkObject: ILinkObject, links: { [key: string]: ILinkObject }) {
  const linkEntry = Object.entries(links).find(([_, link]) => link.id === linkObject.id)
  return linkEntry![0]
}

class Diory implements IDiory {
  id: string
  text?: string = undefined
  image?: string = undefined
  latlng?: string = undefined
  date?: string = undefined
  data?: IDataObject[] = undefined
  links?: { [index: string]: ILinkObject } = undefined
  created?: string = undefined
  modified?: string = undefined

  constructor(dioryObject: IDioryObject | IDioryProps) {
    this.id = 'id' in dioryObject ? dioryObject.id : uuid()
    this.update(dioryObject, false)
  }

  update = (dioryProps: IDioryProps, modify = true): IDiory => {
    Object.entries(dioryProps).forEach(([prop, value]) => {
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

  addLink(linkObject: ILinkObject): IDiory {
    throwErrorIfLinkAlreadyExists('addLink', linkObject, this.links)

    if (!this.links) {
      this.links = {}
    }

    this.links[linkObject.id] = {
      id: linkObject.id,
      ...(linkObject.path && { path: linkObject.path }),
    }
    return this.update({})
  }

  removeLink(linkObject: ILinkObject): IDiory {
    throwErrorIfLinkNotFound('removeLink', linkObject, this.links)

    const linkKey = getLinkKey(linkObject, this.links!)
    delete this.links![linkKey]

    if (Object.keys(this.links!).length === 0) {
      this.links = undefined
    }

    return this.update({})
  }

  changeContentUrl = (contentUrl: string) => {
    if (this.data) {
      const data = this.data[0]
      data.contentUrl = contentUrl
    }
  }

  getContentUrl = () => {
    if (this.data) {
      const data = this.data[0]
      return data.contentUrl
    }
  }

  toObject = (): IDioryObject => {
    const dioryObject: IDioryObject = { id: this.id }
    Object.getOwnPropertyNames(this).forEach((prop) => {
      // @ts-ignore
      const value: any = this[prop]
      if (valueIsValid(value) && valueExists(value)) {
        // @ts-ignore
        dioryObject[prop] = value
      }
    })
    return dioryObject
  }

  toObjectWithoutImage = (): IDioryObject => {
    const dioryObject = this.toObject()
    dioryObject.image = '[omitted]'
    return dioryObject
  }

  toJson = (): string => JSON.stringify(this.toObject(), null, 2)
}

export { Diory }
