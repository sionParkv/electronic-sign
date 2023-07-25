import { existsSync, mkdirSync } from 'fs'
import moment from 'moment'
import { resolve } from 'path'
import winston, { format, transports } from 'winston'
import 'winston-daily-rotate-file'

import { cfgServer } from '../config'

const colors = {
  error: 'red',
  info: 'green',
  debug: 'blue'
}
winston.addColors(colors)

let pathLog = resolve(cfgServer.path)
!existsSync(pathLog) && mkdirSync(pathLog)

const { combine, label, printf, timestamp } = format
const logFormat = printf(({ level, message, label, timestamp }) => {
  const datetime = moment(timestamp).format('YYYY-MM-DD HH:mm:ss.SSS')
  return `${datetime} [${label}] ${level}: ${message}`
})

const options = {
  datePattern: 'YYYY-MM-DD',
  format: combine(label({ label: 'Eone-Sign' }), timestamp(), logFormat),
  humanReadableUnhandledException: true,
  json: false,
  maxFiles: '30d'
}
const errorTransport = new transports.DailyRotateFile({
  ...options,
  dirname: pathLog + '/error',
  filename: '%DATE%-error.log',
  level: 'error'
})
const debugTransport = new transports.DailyRotateFile({
  ...options,
  dirname: pathLog + '/debug',
  filename: '%DATE%-debug.log',
  level: 'debug'
})
const infoTransport = new transports.DailyRotateFile({
  ...options,
  dirname: pathLog + '/info',
  filename: '%DATE%-info.log',
  level: 'info'
})

const logger = winston.createLogger({
  level: 'silly',
  format: combine(format.splat()),
  transports: [debugTransport, infoTransport, errorTransport]
})

cfgServer.env !== 'production' &&
  logger.add(
    new transports.Console({
      format: format.combine(
        label({ label: 'Eone-Sign' }),
        format.colorize(),
        format.simple(),
        timestamp(),
        logFormat
      )
    })
  )
const stream = {
  write: (message: String) => {
    logger.info(message)
  }
}

export { logger, stream }
