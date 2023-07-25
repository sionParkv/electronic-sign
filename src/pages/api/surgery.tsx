import type { NextApiRequest, NextApiResponse } from 'next'

import { MsSql } from '@/db/MsSql'
import { logger } from '@/utils/Winston'

const surgery = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[surgery] 수술 환자 목록 조회 리퀘스트 %o', req.body)
  const { OP_YMD, OP_DEPT_CD, AN_TYPE_GB, OP_GB, PTNT_NM } = req.body
  let query = `exec [UP_S1MOBILE_OP_LIST_R] '${OP_YMD}', '${OP_DEPT_CD}', '${AN_TYPE_GB}', '${OP_GB}', '${PTNT_NM}'`

  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug(
          '[surgery] 수술 환자목록 조회에 성공 하였습니다. %o',
          result
        )
        res.json({
          code: 'OK',
          meesage: '수술 환자 목록 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[surgery] 수술 환자목록이 없습니다.')
        res.json({
          code: 'OK',
          meesage: '수술 환자 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[surgery] 수술 환자 목록 조회 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '수술 환자 목록 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default surgery
