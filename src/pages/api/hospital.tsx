/**
 * 병동 조회 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'

import { MsSql } from '@/db/MsSql'
import { logger } from '@/utils/Winston'

const hospital = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[hospital] 병동 목록 조회 리퀘스트')
  let query = 'exec [UP_HZSMPL_R$001]'
  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug(
          '[hospital] 병동 환자 목록 조회에 성공 하였습니다.',
          result
        )
        res.json({
          code: 'OK',
          message: '병동 목록 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[hospital] 병동 목록이 없습니다.')
        res.json({
          code: 'OK',
          message: '병동 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[hospital] 병동 목록 조회 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        message: '병동 목록 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default hospital
