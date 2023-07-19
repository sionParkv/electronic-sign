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

const login = (req: NextApiRequest, res: NextApiResponse) => {
  console.log('1111111111')

  mssql.connect(config, async (error) => {
    if (error) {
      console.log('333333333')
      console.log('DB connection err')
      res.json({
        error
      })
    }

    console.log('44444444444')

    await new mssql.Request()
      .input('EMPL_NO', 1234)
      .input('PASSWORD', '1234')
      .execute('UP_S1MOBILE_EMPL_INFO_R')
      .then((result) => {
        console.log('55555555555')
        console.log(result)
        res.json({
          code: 'OK',
          result
        })
      })
      .catch((error) => {
        console.log('66666666666', error)
        res.json({
          err: error.toString()
        })
      })
      .finally(() => {
        console.log('777777777')
        //TODO
      })
  })
}

export default login
