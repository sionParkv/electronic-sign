/**
 * 로그인 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'cookies-next'

import { AES256 } from '@/utils/AES256'
import { MsSql } from '@/db/MsSql'
import { logger } from '@/utils/Winston'

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[login] 로그인 리퀘스트 %o', req.body)
  const { EMPL_NO, PASS_WORD } = req.body
  let query = `exec [UP_S1MOBILE_EMPL_INFO_R] '${EMPL_NO}', '${PASS_WORD}'`

  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result.length === 0) {
        logger.debug('[login] 일치하는 정보가 업습니다.')
        res.json({
          code: 'FAIL',
          message: '일치하는 직원정보가 없습니다.',
          data: result
        })
      }
      // else if (PASS_WORD !== result[0]?.PASS_WORD) {
      //   logger.debug('[login] 패스워드가 불일치 합니다.')
      //   res.json({
      //     code: 'FAIL',
      //     message: '패스워드가 불일치 합니다.',
      //     data: result
      //   })
      // }
      // else if (DEPT !== result[0]?.DEPT_GB) {
      //   logger.debug('[login] 부서구분이 불일치 합니다.')
      //   res.json({
      //     code: 'FAIL',
      //     message: '부서구분이 불일치 합니다.',
      //     data: result
      //   })
      // }
      else {
        logger.debug('[login] 로그인에 성공 하였습니다. %o', result)
        let incoding = AES256.AES_encrypt(JSON.stringify(result))
        const expiryDate = new Date(Number(new Date()) + 315360000000)
        setCookie('loginCookie', incoding, { req, res, expires: expiryDate })
        res.json({
          code: 'OK',
          message: '로그인되었습니다.',
          data: result
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[login] 로그인 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '로그인 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })

  if (isNaN(Number(EMPL_NO))) {
    return res.json({
      code: 'FAIL',
      message: '사원번호가 잘못 되었습니다.'
    })
  }

  // if (!PASS_WORD?.length) {
  //   res.json({
  //     code: 'FAIL',
  //     message: '비밀번호가 전달되지 않았습니다.'
  //   })
  // }
}

export default login
