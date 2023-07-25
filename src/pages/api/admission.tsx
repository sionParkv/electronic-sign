import type { NextApiRequest, NextApiResponse } from 'next'

import { logger } from '@/utils/Winston'
import { MsSql } from '@/db/MsSql'

const admission = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[admission] 입원 환자 목록 조회 리퀘스트 %o', req.body)
  // const { departments, wards } = req.body
  let query = `exec [UP_S1MOBILE_ADM_LIST_R] 'ALL', 'ALL', '', 'Y'`
  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug(
          '[admission] 입원 환자목록 조회에 성공 하였습니다. %o',
          result
        )
        res.json({
          code: 'OK',
          meesage: '입원 환자 목록 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[admission] 입원 환자목록이 없습니다.')
        res.json({
          code: 'OK',
          meesage: '입원 환자 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[admission] 입원 환자 목록 조회 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '입원 환자 목록 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default admission
