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
import { useEffect, useState } from 'react'

interface Patient {
  [key: string]: any
  name: string
  date: string
  number: number
  diagnosis: string
  doctor: string
}

const PatientInfo = () => {
  const [patInfo, setList] = useState<Patient>()

  useEffect(() => {
    if (localStorage.getItem('patientInfo') !== 'undefined') {
      patMethod()
    }
  }, [])

  const patMethod = () => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('patientInfo') !== 'undifined'
    ) {
      setList(JSON.parse(localStorage.getItem('patientInfo')!))
      // patInfo = patInfoList as String)!
    }
  }

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
            <TableCell>{patInfo && patInfo.name}</TableCell>
            <TableCell component="th">진료일</TableCell>
            <TableCell>{patInfo && patInfo.date}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">등록번호</TableCell>
            <TableCell>{patInfo && patInfo.number}</TableCell>
            <TableCell component="th">진단명</TableCell>
            <TableCell>{patInfo && patInfo.diagnosis}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">구분</TableCell>
            <TableCell>{patInfo && patInfo.division}</TableCell>
            <TableCell component="th">진료의</TableCell>
            <TableCell>{patInfo && patInfo.doctor}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  )
}
export default PatientInfo
