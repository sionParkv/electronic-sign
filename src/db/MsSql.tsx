import mssql from 'mssql'

import { logger } from '@/utils/Winston'
import { cfgServer } from '@/config'

const config = cfgServer.db

const executeQuery = (query: string) =>
  new Promise((resolve, reject) => {
    mssql.connect(config, async (error) => {
      if (error) {
        logger.error(`DB connection ERROR : ${error}`)
        reject(error)
      } else {
        await new mssql.Request()
          .query(query)
          .then((result) => {
            logger.debug('프로시저 호출 성공 %o', result.recordset)
            resolve(result.recordset)
          })
          .catch((error) => {
            error &&
              error.message &&
              logger.error(`[MsSql] QUERY ERROR : ${error.message}`)
            reject(error.message)
          })
      }
    })
  })

const MsSql = {
  executeQuery
}

export { MsSql }
