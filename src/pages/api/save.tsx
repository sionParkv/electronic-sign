import type { NextApiRequest, NextApiResponse } from 'next'

import { logger } from '@/utils/Winston'
import { MsSql } from '@/db/MsSql'

const save = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[save] 동의서 저장 리퀘스트 %o', req.body)
  const {
    RECEPT_NO,
    FORM_CD,
    FILE_NM,
    UPLOAD_NM,
    PTNT_NO,
    IO_GB,
    ENT_EMPL_NO
  } = req.body
  let query = `exec [UP_S1MOBILE_PTNT_EFORM_C] '${RECEPT_NO}', '${FORM_CD}', '${FILE_NM}', '${UPLOAD_NM}', '${PTNT_NO}', '${IO_GB}', '${ENT_EMPL_NO}', 'MOBILE' `
  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug('[save] 동의서 저장에 성공 하였습니다. %o', result)
        res.json({
          code: 'OK',
          meesage: '동의서 저장에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug('[save] 동의서 저장목록이 없습니다. %o', result)
        res.json({
          code: 'OK',
          meesage: '동의서 저장 목록이 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[save] 동의서 저장 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '동의서 저장 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default save
