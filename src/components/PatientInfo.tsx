import {
  Box,
  Container,
  Typography as T,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material'
import Image from 'next/image'

import IMGS from '../assets/images'

const PatientInfo = () => {
  return (
    <Container className="PatientInfo">
      <Box className="PatientTitle">
        <Image src={IMGS.PatientIcon} alt="Icon" />
        <T>환자 정보</T>
      </Box>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell component="th">환자명</TableCell>
            <TableCell>홍*동</TableCell>
            <TableCell component="th">진료일</TableCell>
            <TableCell>20170102 / 16A / 1601</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">등록번호</TableCell>
            <TableCell>12345678</TableCell>
            <TableCell component="th">진단명</TableCell>
            <TableCell>병적 골 NOS, 대퇴골</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">입원/외래</TableCell>
            <TableCell>입원</TableCell>
            <TableCell component="th">진료의</TableCell>
            <TableCell>홍*동</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  )
}
export default PatientInfo
