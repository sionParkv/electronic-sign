import { connect } from 'socket.io-client'
import axios from 'axios'

axios
  .post('/api/socket', {})
  .then(() => {})
  .catch(() => {})

const socket = connect({ path: '/s2/socket.io', transports: ['polling'] })

const connectSocket = (EMPL_NO: Number) => {
  console.log('233322233', socket)
  // log socket connection
  socket.on('connect', () => {
    console.log('SOCKET CONNECTED!', socket.id)
    socket.emit('joinRoom', EMPL_NO)
    socket.emit('message', { roomName: EMPL_NO, message: '테스트' })
  })
  if (socket) return () => socket.disconnect()
}

const sendSocketMessage = (title: string, EMPL_NO: Number, message: string) => {
  console.log('문서열람 ' + title + EMPL_NO + message)
  socket.emit(title, { roomName: EMPL_NO, message: message })
}
const closeSocket = () => {
  console.log('55555555')
  socket.disconnect()
}
const SocketClient = {
  connectSocket,
  sendSocketMessage,
  closeSocket,
  socket: socket
}

export { SocketClient }
