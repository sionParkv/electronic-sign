/**
 * 문서 저장 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import * as ftp from 'basic-ftp'
import fs, { existsSync, mkdirSync } from 'fs'

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
    EFORM_DATA,
    TEMP
  } = req.body
  let query = `exec [UP_S1MOBILE_PTNT_EFORM_C] ${RECEPT_NO}, ${FORM_CD}, '${FILE_NM}', ${SEQ}, '${UPLOAD_NM}', ${PTNT_NO}, '${IO_GB}', ${ENT_EMPL_NO}, 'MOBILE', '${EFORM_DATA}', 'Y'`
  MsSql.executeQuery(query)
    .then((result: any) => {
      logger.debug(
        '[completeSave] 작성완료 동의서 저장에 성공 하였습니다. %o',
        result
      )

      const saveDirectory = 'C:\\app\\images'

      if (!existsSync(saveDirectory)) {
        mkdirSync(saveDirectory)
      }

      const currentDate = new Date().toISOString().replace(/:/g, '-')
      const fileName = currentDate + '.jpg'
      const filePath = saveDirectory + '\\' + fileName
      try {
        fs.writeFileSync(filePath, TEMP)
        logger.debug('Data saved successfully')
        upload(fileName, filePath)
          .then((result) => {
            if (result) {
              res.json({
                code: 'OK',
                message: '동의서 저장에 성공 하였습니다.'
              })
            } else {
              res.json({
                code: 'FAIL',
                message: '동의서 저장에 실패 하였습니다.'
              })
            }
          })
          .catch((error) => {
            logger.error(`TEST : ${error}`)
            res.json({
              code: 'FAIL',
              message: 'FTP 업로드중 오류가 발생 하였습니다.',
              error: error
            })
          })
      } catch (error) {
        logger.error('Error saving data:', error)
        res.json({
          code: 'FAIL',
          message: '이미지 파일 저장 중 오류가 발생 하였습니다.',
          error: error
        })
      }
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
  async function upload(fileName: any, filePath: string) {
    return new Promise(function (resolve, reject) {
      const client = new ftp.Client()
      client.ftp.verbose = true // 통신 상세 과정 볼거면 true, 아니면 false
      logger.debug('1111111')
      client
        .access({
          host: '192.168.100.207',
          user: 'medimcc',
          password: 'Medi3574mcc',
          port: 21,
          secure: false
        })
        .then((result) => {
          logger.debug('%o', result)
          logger.debug('22222222')
          client.cd('/EFORM01') // 서버에 접속 후, 업로드할 폴더로 이동
          logger.debug('333333333')
          client.uploadFrom(fileName, filePath)
          logger.debug('4444444')
        })
        .catch((error) => {
          logger.error(`TEST ERROR : ${error}`)
          reject(error)
        })

      client.close()
      resolve(true)
    })
  }
}

export default completeSave
