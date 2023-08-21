/**
 * 서버 조회 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'

import { logger } from '@/utils/Winston'
import { MsSql } from '@/db/MsSql'

const server = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[save] 동의서 저장 리퀘스트 %o', req.body)
  let query = `exec [UP_S1MOBILE_SERVER_INFO_R]`
  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug('[server] 서버 조회 성공 하였습니다. %o', result)
        res.json({
          code: 'OK',
          meesage: '서버 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[server] 서버 목록이 없습니다. %o', result)
        res.json({
          code: 'OK',
          meesage: '서버 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[server] 서버 조회 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '서버 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default server
