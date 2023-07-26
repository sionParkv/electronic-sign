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
  const [list, setList] = useState<Patient[]>([])
  let patInfoList: any = ''

  console.log('patientInfo::', list)

  useEffect(() => {
    if (localStorage.getItem('patientInfo') !== 'undefined') {
      tempMethod()
    }
  }, [])

  const tempMethod = () => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('patientInfo') !== 'undifined'
    ) {
      patInfoList = JSON.parse(localStorage.getItem('patientInfo')!)
      setList(patInfoList)
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
            <TableCell>{list.name}</TableCell>
            <TableCell component="th">진료일</TableCell>
            <TableCell>{list.date}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">등록번호</TableCell>
            <TableCell>{list.number}</TableCell>
            <TableCell component="th">진단명</TableCell>
            <TableCell>{list.diagnosis}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th">입원/외래</TableCell>
            <TableCell>입원</TableCell>
            <TableCell component="th">진료의</TableCell>
            <TableCell>{list.doctor}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  )
}
export default PatientInfo
