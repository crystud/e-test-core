export const transformToId = (entity: any, obj: any): any => {
  if (!entity) {
    return entity
  }

  if (Array.isArray(entity)) {
    return entity.map(value => value.id)
  }

  if (obj?.id) {
    return entity.id
  }

  return entity
}
