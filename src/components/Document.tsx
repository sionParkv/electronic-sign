import { Box, Container, Typography as T } from '@mui/material'
import Image from 'next/image'

import images from '@/assets/images'

const Document = () => {
  return (
    <Container className="DocumentContainer">
      <Box className="Document">
        <Box className="DocumentTitle">
          <Image src={images.DocumentIcon} alt="icon" />
          <T>작성서식 목록</T>
        </Box>
      </Box>
      <Box className="Document">
        <Box className="DocumentTitle">
          <Image src={images.DocumentIcon} alt="icon" />
          <T>서식 목록</T>
        </Box>
      </Box>
    </Container>
  )
}
export default Document
