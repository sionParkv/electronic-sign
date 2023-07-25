import type { NextApiRequest, NextApiResponse } from 'next'

import { MsSql } from '@/db/MsSql'
import { logger } from '@/utils/Winston'

const givenList = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[givenList] 작성된 동의서 목록 조회 리퀘스트 %o', req.body)
  const { PTNT_NO } = req.body
  let query = `exec [UP_S1MOBILE_PTNT_LIST_R] '${PTNT_NO}'`

  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug(
          '[givenList] 임시저장 동의서 목록 조회에 성공 하였습니다. %o',
          result
        )
        res.json({
          code: 'OK',
          meesage: '작성된 동의서 목록 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[givenList] 작성된 동의서 목록이 없습니다.')
        res.json({
          code: 'OK',
          meesage: '작성된 동의서 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[givenList] 작성된 동의서 목록 조회 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '작성된 동의서 목록 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default givenList
