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
      .input('OP_YMD', '20230707')
      .input('OP_DEPT_CD', '')
      .input('AN_TYPE_GB', '11')
      .input('OP_GB', '')
      .input('PTNT_NM', '')
      .execute('UP_S1MOBILE_OP_LIST_R')
      .then((result) => {
        console.log(result)
        res.json({
          code: 'OK',
          result
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

export default deptSearch
