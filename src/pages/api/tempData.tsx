/**
 * 임시저장 문서 데이터 조회 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'

import { MsSql } from '@/db/MsSql'
import { logger } from '@/utils/Winston'

const tempData = (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[tempData] 임시저장 동의서 데이터 조회 리퀘스트 %o', req.body)
  const { RECEPT_NO, FILE_NM, FORM_CD } = req.body

  let query = `exec [UP_S1MOBILE_TEMP_LIST_R$001] ${RECEPT_NO}, ${FORM_CD}, '${FILE_NM}'`
  MsSql.executeQuery(query)
    .then((result: any) => {
      if (result?.length > 0) {
        logger.debug(
          '[tempData] 임시 저장 동의서 데이터 조회에 성공 하였습니다. %o',
          result
        )
        res.json({
          code: 'OK',
          message: '임시저장 동의서 목록 조회에 성공 하였습니다.',
          data: result
        })
      } else {
        logger.debug(
          '[tempData] 임시 저장 동의서 데이터가 없습니다. %o',
          result
        )
        res.json({
          code: 'FAIL',
          message: '임시저장 동의서 데이터가 없습니다.'
        })
      }
    })
    .catch((error) => {
      error &&
        error.message &&
        logger.error(
          `[tempData] 임시저장 동의서 데이터 조회 중 오류가 발생 하였습니다. : ${error.message}`
        )
      res.json({
        code: 'FAIL',
        message: '임시저장 동의서 데이터 조회 중 오류가 발생 하였습니다.',
        error: error.message
      })
    })
}

export default tempData
