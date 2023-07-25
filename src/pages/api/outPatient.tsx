import type { NextApiRequest, NextApiResponse } from 'next'

import { logger } from '@/utils/Winston'
import { MsSql } from '@/db/MsSql'

const outPatinet = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[outPatinet] 외래 환자 목록 조회 리퀘스트 %o', req.body)
  const { clinic_ymd, dept_cd, doct_empl_no, ptnt_nm } = req.body
  let query = `UP_S1MOBILE_OPD_LIST_R '${clinic_ymd}', '${dept_cd}', '${doct_empl_no}', '${ptnt_nm}'`

  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug(
          '[outPatinet] 외래 환자목록 조회에 성공 하였습니다. %o',
          result
        )
        res.json({
          code: 'OK',
          meesage: '외래 환자 목록 조회에 성공 하였습니다.',
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
          `[outPatinet] 외래 환자 목록 조회 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '외래 환자 목록 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default outPatinet
