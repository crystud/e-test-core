import { Environments } from './environments.enum'
import { database } from './database.config'
import { attempt } from './attempt.config'

export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || Environments.DEFAULT,
    database,
    attempt,
  }
}
