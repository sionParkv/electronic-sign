import { connect } from 'socket.io-client'
import axios from 'axios'

const socket = connect({ path: '/s2/socket.io', transports: ['polling'] })

const createSocket = () => {
  axios
    .post('/api/socket', {})
    .then(() => {})
    .catch(() => {})
}

const connectSocket = (EMPL_NO: Number) => {
  // log socket connection
  socket.on('connect', () => {
    socket.emit('joinRoom', EMPL_NO)
    socket.emit('message', { roomName: EMPL_NO, message: '테스트' })
  })
  if (socket) return () => socket.disconnect()
}

const sendSocketMessage = (title: string, EMPL_NO: Number, message: string) => {
  socket.emit(title, { roomName: EMPL_NO, message: message })
}
const closeSocket = () => {
  socket.disconnect()
}
const SocketClient = {
  createSocket,
  connectSocket,
  sendSocketMessage,
  closeSocket,
  socket: socket
}

export { SocketClient }
