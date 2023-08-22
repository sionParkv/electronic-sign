/**
 * 문서 저장 api.
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import * as ftp from 'basic-ftp'

import { logger } from '@/utils/Winston'
import { MsSql } from '@/db/MsSql'
import { Readable } from 'stream'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

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

      res.json({
        code: 'OK',
        meesage: '작성완료 동의서 저장에 성공 하였습니다.'
      })

      const allowedOrigins = ['https://210.107.85.113']
      const origin: any = req.headers.origin

      app.use(bodyParser.json())

      if (allowedOrigins.includes(origin)) {
        // 허용된 도메인일 경우 해당 도메인을 허용합니다.
        res.setHeader('Access-Control-Allow-Origin', origin)
      }

      res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      )

      // 이원서버에 이미지 저장
      app.use(bodyParser.urlencoded({ extended: true }))
      app.use(bodyParser.json())

      const saveDirectory = path.join('/C/app', TEMP)

      if (!fs)
        if (!fs.existsSync(saveDirectory)) {
          fs.mkdirSync(saveDirectory)
        }

      const currentDate = new Date().toISOString().replace(/:/g, '-')
      const fileName = `${currentDate}`
      const filePath = path.join(saveDirectory, fileName)

      fs.writeFile(filePath, JSON.stringify(TEMP, null, 2), (err: any) => {
        if (err) {
          console.error('Error saving data:', err)
          res.status(500).send('Error saving data')
        } else {
          console.log('Data saved successfully')
          res.status(200).send('Data saved successfully')
        }
      })

      // ftp서버에 이미지 저장
      const client = new ftp.Client()

      client.access({
        host: '210.107.85.117',
        user: 'medimcc',
        password: 'Medi3574mcc',
        port: 21
      })

      const source = new Readable()
      source.push(TEMP)
      source.push(null)

      client
        .uploadFrom(source, '')
        .then(() => {
          console.log('업로드 성공')
        })
        .catch((e) => {
          console.log(e)
        })
      client.close
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
