/**
 * 문서 저장 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import * as ftp from 'basic-ftp'
import fs, { existsSync, mkdirSync } from 'fs'
import moment from 'moment'

import { logger } from '@/utils/Winston'
import { MsSql } from '@/db/MsSql'

const upload = (fileName: any, filePath: string) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
    logger.debug(fileName)
    logger.debug(filePath)
    const client = new ftp.Client()
    client.ftp.verbose = true // 통신 상세 과정 볼거면 true, 아니면 false
    logger.debug('FTP Client: %o', client)

    await client
      .access({
        host: '192.168.100.207',
        user: 'medimcc',
        password: 'Medi3574mcc',
        port: 21,
        secure: false
      })
      .then(async (response) => {
        try {
          logger.debug('FTP Client connection response: %o', response)
          response = await client.cd('/EFORM01') // 서버에 접속 후, 업로드할 폴더로 이동
          logger.debug('FTP Client change directory response: %o', response)
          response = await client.uploadFrom(filePath, fileName)
          logger.debug('FTP Client file upload response: %o', response)
          resolve(true)
        } catch (error) {
          logger.error('FTP Client cd or upload error: %o', error)
          reject(error)
        } finally {
          client.close && client.close()
        }
      })
      .catch((error) => {
        logger.error('FTP Client connection error : %o', error)
        return reject(error)
      })
  })

const completeSave = async (req: NextApiRequest, res: NextApiResponse) => {
  logger.debug('[completeSave] 작성완료 동의서 저장 리퀘스트 %o', req.body)
  const {
    RECEPT_NO,
    FORM_CD,
    FILE_NM,
    PTNT_NO,
    IO_GB,
    ENT_EMPL_NO,
    EFORM_DATA,
    TEMP
  } = req.body
  let query = ''
  logger.debug(typeof JSON.parse(TEMP))
  const imageObject = JSON.parse(TEMP)
  for (var i = 0; i < imageObject.length; i++) {
    const saveDirectory = 'C:\\app\\images'
    const fileName = FILE_NM + '_' + i + '.jpg'
    const filePath = saveDirectory + '\\' + fileName

    query = `exec [UP_S1MOBILE_PTNT_EFORM_C] ${RECEPT_NO}, ${FORM_CD}, '${FILE_NM}', ${
      i + 1
    }, '${fileName}', ${PTNT_NO}, '${IO_GB}', ${ENT_EMPL_NO}, 'MOBILE', '${EFORM_DATA}', 'Y'`
    let result: any
    try {
      logger.debug('>>>>>> ' + query)
      result = await MsSql.executeQuery(query)
    } catch (error: any) {
      error &&
        error.message &&
        logger.error(
          `[completeSave] 작성완료 동의서 저장 중 오류가 발생 하였습니다. : ${error.messgae}`
        )
      res.json({
        code: 'FAIL',
        message: '작성완료 동의서 저장 중 오류가 발생 하였습니다.',
        error: error.message
      })
    }

    logger.debug(
      '[completeSave] 작성완료 동의서 저장에 성공 하였습니다. %o',
      result
    )
    logger.debug('23232323232' + i)
    logger.debug('45454545454' + imageObject.length)

    if (!existsSync(saveDirectory)) {
      mkdirSync(saveDirectory)
    }

    try {
      fs.writeFileSync(filePath, imageObject[i], 'base64')
      logger.debug('Data saved successfully')
    } catch (error) {
      logger.error('Error saving data:', error)
      res.json({
        code: 'FAIL',
        message: '이미지 파일 저장 중 오류가 발생 하였습니다.',
        error
      })
    }

    upload(fileName, filePath)
      .then(() => {
        if (i === imageObject.length) {
          res.json({ code: 'OK', message: '동의서 저장에 성공 하였습니다.' })
        }
      })
      .catch((error) => {
        logger.error('File upload error: %o', error)
        res.json({
          code: 'FAIL',
          message: 'FTP 업로드중 오류가 발생 하였습니다.',
          error
        })
      })
  }
}

export default completeSave

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '25mb'
    }
  }
}
