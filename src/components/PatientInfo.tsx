import { Box, Container, Typography as T } from '@mui/material'
import Image from 'next/image'

import IMGS from '../assets/images'

const PatientInfo = () => {
  return (
    <Container className="PatientInfo">
      <Box className="PatientTitle">
        <Image src={IMGS.PatientIcon} alt="Icon" />
        <T>환자 정보</T>
      </Box>
    </Container>
  )
}
export default PatientInfo
