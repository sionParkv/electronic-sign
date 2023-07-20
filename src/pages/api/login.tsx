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

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, pw } = req.body
  console.log(req.body)

  if (isNaN(id)) {
    return res.json({
      code: 'LIE-001',
      message: '사원번호가 잘못 되었습니다.',
      error: new Error('아이디가 전달되지 않았습니다.')
    })
  }

  if (!pw?.length) {
    res.json({
      code: 'LIE-002',
      message: '비밀번호가 전달되지 않았습니다.',
      error: new Error('비밀번호가 전달되지 않았습니다.')
    })
  }

  mssql.connect(config, async (error) => {
    if (error) {
      res.json({
        code: 'LIE-003',
        message: error?.message || '데이터베이스 접속 오류입니다.',
        error
      })
    }

    await new mssql.Request()
      .input('EMPL_NO', id)
      .input('PASSWORD', pw)
      .execute('UP_S1MOBILE_EMPL_INFO_R')
      .then((result) => {
        if (!result?.recordset?.length) {
          res.json({
            code: 'LIE-004',
            message: '일치하는 직원정보가 없습니다.',
            data: result.recordset
          })
        } else {
          res.json({
            code: 'OK',
            message: '로그인되었습니다.',
            data: result.recordset
          })
        }
      })
      .catch((error) => {
        res.json({
          code: 'LIE-005',
          message: error?.message,
          error
        })
      })
  })
}

export default login
