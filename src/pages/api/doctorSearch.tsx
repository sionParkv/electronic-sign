import type { NextApiRequest, NextApiResponse } from 'next'

import { MsSql } from '@/db/MsSql'
import { logger } from '@/utils/Winston'

const doctorSearch = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[doctorSearch] 의사 목록 조회 리퀘스트 %o', req.body)
  const { DEPT_CD } = req.body
  let query = `exec [UP_H2ORD_R$025] '${DEPT_CD}'`

  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug(
          '[doctorSearch] 의사 목록 조회에 성공 하였습니다. %o',
          result
        )
        res.json({
          code: 'OK',
          meesage: '의사 환자 목록 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[doctorSearch] 의사 목록이 없습니다.')
        res.json({
          code: 'OK',
          meesage: '의사 환자 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[doctorSearch] 의사 목록 조회 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '의사 목록 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default doctorSearch
