import moment from 'moment'

export const getLocalTime = (): Date => {
  return moment()
    .utc(true)
    .toDate()
}
