import { logger } from '@/utils/Winston'
import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/utils/NextApiResponseServerIO'
import { Server as ServerIO } from 'socket.io'
import { Server as NetServer } from 'http'

export const config = {
  api: {
    bodyParser: false
  }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  logger.debug('[Socket] 소켓 서버 실행 리퀘스트')
  if (!res.socket.server.io) {
    logger.debug('[Socket] 소켓 서버 실행')
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/s2'
    })
    res.socket.server.io = io
    io.on('connection', (socket) => {
      logger.debug('소켓 연결 성공')
      socket.on('disconnect', () => {
        logger.debug('[Socket] 소켓 서버 연결 끊김')
      })
      socket.on('message', (data) => {
        logger.debug('[Socket] 소켓통신 메시지 수신 %o', data)
        io.to(data.roomName).emit('message', data.message) // 모든 클라이언트에게 메시지 보내기
      })
      socket.on('joinRoom', (EMPL_NO) => {
        logger.debug('[Socket] 방입장 방이름 : ' + EMPL_NO)
        socket.join(EMPL_NO)
      })
      socket.on('openDocument', (data) => {
        logger.debug('[Socket] 문서열람 %o', data)
        io.to(data.roomName).emit('openDocument', data.message) // 모든 클라이언트에게 메시지 보내기
      })
    })
  } else {
    logger.debug('[Socket] 소켓 서버가 이미 실행 중입니다.')
  }
  res.end()
}
export default ioHandler
