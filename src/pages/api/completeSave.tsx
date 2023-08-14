import type { NextApiRequest, NextApiResponse } from 'next'

import { logger } from '@/utils/Winston'
import { MsSql } from '@/db/MsSql'

const completeSave = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[completeSave] 작성완료 동의서 저장 리퀘스트 %o', req.body)
  const {
    RECEPT_NO,
    FORM_CD,
    FILE_NM,
    SEQ,
    UPLOAD_NM,
    PTNT_NO,
    IO_GB,
    ENT_EMPL_NO,
    EFORM_DATA
  } = req.body
  let query = `exec [UP_S1MOBILE_PTNT_EFORM_C] ${RECEPT_NO}, ${FORM_CD}, '${FILE_NM}', ${SEQ}, '${UPLOAD_NM}', ${PTNT_NO}, '${IO_GB}', ${ENT_EMPL_NO}, 'MOBILE', '${EFORM_DATA}', 'Y'`
  MsSql.executeQuery(query)
    .then((result: any) => {
      logger.debug(
        '[completeSave] 작성완료 동의서 저장에 성공 하였습니다. %o',
        result
      )
      res.json({
        code: 'OK',
        meesage: '작성완료 동의서 저장에 성공 하였습니다.'
      })
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[completeSave] 작성완료 동의서 저장 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        meesage: '작성완료 동의서 저장 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default completeSave
