import type { NextApiRequest, NextApiResponse } from 'next'
import mssql from 'mssql'
import { setCookie } from 'cookies-next'

import { AES256 } from '@/utils/AES256'

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
  const { EMPL_NO, EMPL_NM, DEPT, PASS_WORD } = req.body

  if (isNaN(Number(EMPL_NO))) {
    return res.json({
      code: 'LIE-001',
      message: '사원번호가 잘못 되었습니다.',
      error: new Error('아이디가 전달되지 않았습니다.')
    })
  }

  if (!PASS_WORD?.length) {
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
      .input('EMPL_NO', EMPL_NO)
      .input('PASSWORD', PASS_WORD)
      .execute('UP_S1MOBILE_EMPL_INFO_R')
      .then((result) => {
        if (!result?.recordset?.length) {
          res.json({
            code: 'LIE-004',
            message: '일치하는 직원정보가 없습니다.',
            data: result.recordset
          })
        } else if (EMPL_NM !== result.recordset[0].EMPL_NM) {
          res.json({
            code: 'LIE-005',
            message: '이름이 불일치 합니다.',
            data: result.recordset
          })
        } else if (DEPT !== result.recordset[0].DEPT_GB) {
          res.json({
            code: 'LIE-006',
            message: '부서구분이 불일치 합니다.',
            data: result.recordset
          })
        } else {
          let temp = AES256.AES_encrypt(
            JSON.stringify(result.recordset),
            'Qsj23missdaxX2BjyskV6bs#adada6ds'
          )
          const expiryDate = new Date(Number(new Date()) + 315360000000)
          setCookie('testCookie', temp, { req, res, expires: expiryDate })
          res.json({
            code: 'OK',
            message: '로그인되었습니다.',
            data: result.recordset
          })
        }
        console.log(result.recordset)
      })
      .catch((error) => {
        res.json({
          code: 'LIE-007',
          message: error?.message,
          error
        })
      })
  })
}

export default login
