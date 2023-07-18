import type { NextApiRequest, NextApiResponse } from 'next'
import mssql, { VarChar } from 'mssql'
import { log } from 'console'

const login = (req: NextApiRequest, res: NextApiResponse) => {
  console.log('00000000000')
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

  console.log('1111111111')

  mssql.connect(config, async (error) => {
    console.log('2222222222')
    if (error) {
      console.log('333333333')
      console.log('DB connection err')
      res.json({
        error
      })
    }

    console.log('44444444444')

    await new mssql.Request()
      .input('EMPL_NO', `12324`)
      .input('PASS_WORD', `1234`)
      .output('EMPL_NM', VarChar)
      .output('EMPL_ENM', VarChar)
      .output('DEPT_GB', VarChar)
      .output('DEPT_GB_NM', VarChar)
      .output('DUTY_GB', VarChar)
      .output('DUTY_NM', VarChar)
      .output('DEPT_CD', VarChar)
      .output('DEPT_NM', VarChar)
      .execute('UP_S1MOBILE_EMPL_INFO_R')
      .then((result) => {
        console.log('55555555555')
        log.call(result.recordset[0][0])
        res.json({
          code: 'OK',
          result: result.recordset[0][0].EMPL_NO || '',
          result2: result.recordset[0][0].EMPL_NM || '',
          result3: result.recordset[0][0].EMPL_ENM || '',
          result4: result.recordset[0][0].DEPT_GB || '',
          result5: result.recordset[0][0].DEPT_GB_NM || '',
          result6: result.recordset[0][0].DUTY_GB || '',
          result7: result.recordset[0][0].DUTY_NM || '',
          result8: result.recordset[0][0].DEPT_CD || '',
          result9: result.recordset[0][0].DEPT_NM || ''
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
