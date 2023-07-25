import {
  Box,
  Container,
  Typography as T,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import React from 'react'

interface Patient {
  [key: string]: string
  name: string
  birth: string
  age: string
  sex: string
  number: string
  doctor: string
  department: string
  date: string
  diagnosis: string
}

const PatientList = () => {
  const colHeaders = [
    '환자명',
    '생년월일',
    '나이',
    '성별',
    '등록번호',
    '진료의',
    '진료과',
    '진료일',
    '진단명'
  ]
  // TODO: 데이터베이스 데이터 연동
  const patients: Array<Patient> = [
    {
      name: '홍길동',
      birth: '19950505',
      age: '28',
      sex: 'F',
      number: '12345678',
      doctor: '홍의사',
      department: '마취통증의학과',
      date: '20230712/16A/1601',
      diagnosis: '병적 골, NOS, 대퇴골'
    },
    {
      name: '홍길동',
      birth: '19950505',
      age: '28',
      sex: 'F',
      number: '12345678',
      doctor: '홍의사',
      department: '마취통증의학과',
      date: '20230712/16A/1601',
      diagnosis: '병적 골, NOS, 대퇴골'
    },
    {
      name: '홍길동',
      birth: '19950505',
      age: '28',
      sex: 'F',
      number: '12345678',
      doctor: '홍의사',
      department: '마취통증의학과',
      date: '20230712/16A/1601',
      diagnosis: '병적 골, NOS, 대퇴골'
    },
    {
      name: '정미소',
      birth: '20000405',
      age: '23',
      sex: 'M',
      number: '18771678',
      doctor: '권의사',
      department: '성형외과',
      date: '20230228/16A/1601',
      diagnosis: '안면함몰, NOS, 대퇴골'
    },
    {
      name: '김연자',
      birth: '19750505',
      age: '47',
      sex: 'F',
      number: '12092778',
      doctor: '박의사',
      department: '정형외과',
      date: '20230301/16A/1601',
      diagnosis: '사지분리, NOS, 대퇴골'
    },
    {
      name: '전강쇠',
      birth: '19880505',
      age: '37',
      sex: 'M',
      number: '12296878',
      doctor: '정의사',
      department: '정신의학과',
      date: '20230712/16A/1601',
      diagnosis: '정신병, NOS, 대퇴골'
    }
  ]
  const total = patients.length

  return (
    <Container className="PatientListContainer">
      <Box>
        <T component="h1">환자목록</T>
        <T>
          총 <T component="em">{total}</T>명
        </T>
      </Box>
      <Box className="PatientListTable">
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {colHeaders.map((header, h) => (
                  <TableCell key={h}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient, p) => {
                const columns = Object.keys(patient)
                return (
                  <TableRow key={p}>
                    {columns.map((column, c) => (
                      <TableCell key={c}>{patient[column as string]}</TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  )
}

export default PatientList
