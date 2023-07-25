import type { NextApiRequest, NextApiResponse } from 'next'
import mssql from 'mssql'

var config = {
  user: 'mobile_base',
  password: 'mobile_!jj1m',
  server: '210.107.85.113',
  database: 'MEDIPLUS_MEDIYIN',
  steram: true,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
}

const hospital = (req: NextApiRequest, res: NextApiResponse) => {
  const tag = 'hospital'
  mssql.connect(config, async (error) => {
    if (error) {
      console.error(`${tag} DB connection err`)
      res.json({
        error
      })
    }

    await new mssql.Request()
      .execute('UP_HZSMPL_R$001')
      .then((result) => {
        console.debug(`${tag} UP_HZSMPL_R$001 result: `, result?.recordset)
        res.json({
          code: 'OK',
          data: result.recordset
        })
      })
      .catch((error) => {
        console.error(error)
        res.json({
          err: error.toString()
        })
      })
      .finally(() => {
        //TODO
      })
  })
}

export default hospital
