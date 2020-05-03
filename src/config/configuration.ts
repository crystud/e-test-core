import { Environments } from './environments.enum'

export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || Environments.DEFAULT,
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      name: process.env.DATABASE_NAME || 'etest',
      username: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD || 'root',
    },
  }
}
