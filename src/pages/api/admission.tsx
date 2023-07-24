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

const admission = (req: NextApiRequest, res: NextApiResponse) => {
  // const { departments, wards } = req.body
  mssql.connect(config, async (error) => {
    if (error) {
      console.log('DB connection err')
      res.json({
        error
      })
    }

    await new mssql.Request()
      .input('WARD_CD', 'ALL')
      .input('DEPT_CD', 'ALL')
      .input('PTNT_NM', '')
      .input('BOOKMARK_YN', 'Y')
      .execute('UP_S1MOBILE_ADM_LIST_R')
      .then((result) => {
        console.log(result)
        res.json({
          code: 'OK',
          data: result.recordsets
        })
      })
      .catch((error) => {
        console.log(error)
        res.json({
          err: error.toString()
        })
      })
      .finally(() => {
        //TODO
      })
  })
}

export default admission
