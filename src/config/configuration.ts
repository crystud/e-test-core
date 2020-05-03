import { Environments } from './environments.enum'

export default () => {
  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.DATABASE_HOST || Environments.DEFAULT,
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      name: process.env.DATABASE_NAME || 'e-test',
    },
  }
}
