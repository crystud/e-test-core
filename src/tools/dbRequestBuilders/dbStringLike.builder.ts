import { Like } from 'typeorm'

export const dbStringLikeBuilder = (
  filterObj: object,
): { [k: string]: any } => {
  const filter: { [k: string]: any } = {}

  for (const filterItem in filterObj) {
    if (!filterObj.hasOwnProperty(filterItem)) continue

    const item = filterObj[filterItem]

    if (!isNaN(Number(item))) {
      filter[filterItem] = item

      continue
    }

    if (typeof filterObj[filterItem] === 'string') {
      filter[filterItem] = Like(`%${item}%`)
    } else {
      filter[filterItem] = item
    }
  }

  return filter
}
