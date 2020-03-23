import { BaseEntity } from 'typeorm'

export const transformToId = (entity: any, obj: any): any => {
  if (Array.isArray(entity)) {
    return entity.map(value => value.id)
  }

  if (obj?.__proto__ === BaseEntity) {
    return entity.id
  }

  return entity
}
