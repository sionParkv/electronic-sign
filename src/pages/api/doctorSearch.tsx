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

const deptSearch = (req: NextApiRequest, res: NextApiResponse) => {
  mssql.connect(config, async (error) => {
    if (error) {
      console.log('DB connection err')
      res.json({
        error
      })
    }

    await new mssql.Request()
      .input('DEPT_CD', 'IM')
      .execute('UP_H2ORD_R$025')
      .then((result) => {
        console.log(result)
        res.json({
          code: 'OK',
          data: result.recordset
        })
      })
      .catch((error) => {
        console.log(error)
        res.json({
          code: 'LIE-001',
          err: error.toString()
        })
      })
      .finally(() => {
        //TODO
      })
  })
}

export default deptSearch