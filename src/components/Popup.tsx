import React from 'react'
import Modal from '@mui/material/Modal'

interface PopupProps {
  open: boolean
  onClose: () => void
  url: string
}

const Popup: React.FC<PopupProps> = ({ open, onClose, url }) => {
  const body = (
    <iframe
      title="URL 화면"
      src={url}
      width="1000px"
      height="1000px"
      style={{ border: 'none' }}
    />
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {body}
      </div>
    </Modal>
  )
}

export default Popup
