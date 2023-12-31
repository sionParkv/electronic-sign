/**
 * 환자 정보 컴포넌트
 */

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

  // localStorage 데이터가 있을 때만 로드 되도록
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
    }
  }

  // 진료일 년월일 포맷
  const formatDate = (dateString: string) => {
    const year = dateString.slice(0, 4)
    const month = dateString.slice(4, 6)
    const day = dateString.slice(6, 8)
    return `${year}년 ${month}월 ${day}일`
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
            <TableCell>{patInfo && formatDate(patInfo.date)}</TableCell>
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
