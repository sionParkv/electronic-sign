/**
 * 마취구분 조회 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'

import { MsSql } from '@/db/MsSql'
import { logger } from '@/utils/Winston'

const anesthSearch = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[anesthSearch] 마취구분 목록 조회 리퀘스트')
  let query = `exec [UP_HZSMPL_R$031]`
  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length) {
        logger.debug(
          '[anesthSearch] 마취구분 목록 조회에 성공 하였습니다. %o',
          result
        )
        res.json({
          code: 'OK',
          message: '마취구분 목록 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[anesthSearch] 진료과 목록이 없습니다. %o', result)
        res.json({
          code: 'FAIL',
          message: '마취구분 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[anesthSearch] 마취구분 목록 조회중 오류가 발생 하였습니다. : ${error.message}`
        )
      res.json({
        code: 'FAIL',
        message: '마취구분 목록 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default anesthSearch
