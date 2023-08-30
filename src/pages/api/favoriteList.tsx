/**
 * 즐겨찾기 문서 조회 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'

import { MsSql } from '@/db/MsSql'
import { logger } from '@/utils/Winston'

const favoriteList = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[favoriteList] 즐겨찾기 동의서 목록 조회 리퀘스트 %o', req.body)
  const { EMPL_NO } = req.body
  let query = `exec [UP_S1MOBILE_BOOKMARK_LIST_R] '${EMPL_NO}'`

  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug(
          '[favoriteList] 즐겨찾기 동의서 목록 조회에 성공 하였습니다. %o',
          result
        )
        res.json({
          code: 'OK',
          message: '즐겨찾기 동의서 목록 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[favoriteList] 임시저장 동의서 목록이 없습니다.')
        res.json({
          code: 'OK',
          message: '즐겨찾기 동의서 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[favoriteList] 즐겨찾기 동의서 목록 조회 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        message: '즐겨찾기 동의서 목록 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default favoriteList
