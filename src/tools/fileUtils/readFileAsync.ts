import * as fs from 'fs'

export const readFileAsync = (path: string) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) reject(error)

      global.console.log(path)

      resolve(data)
    })
  })
