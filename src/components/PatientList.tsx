import { useStateValue } from '@/context/stateContext'
import {
  Box,
  Container,
  NoSsr,
  Typography as T,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import React, { useEffect, useState } from 'react'

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
  let patList: Array<Patient> = []
  let patientList: any = ''
  const [list, setList] = useState<Patient[]>([])
  const state = useStateValue()
  const stateList: any[] = state?.list || []
  console.log('stateList:: ', stateList)
  useEffect(() => {
    if (localStorage.getItem('patientList') !== 'undefined') {
      tempMethod()
    } else {
      let mapList: any[] = []
      if (stateList) {
        mapList = stateList?.map((pat) => {
          const sexAge = pat.SEX_AGE.split('/')
          return {
            name: pat.PTNT_NM,
            birth: pat.BIRTH_YMD,
            age: sexAge[1],
            sex: sexAge[0],
            number: pat.RECEPT_NO,
            doctor: pat.DOCT_EMPL_NM,
            department: pat.DEPT_NM,
            date: pat.ADM_YMD,
            diagnosis: pat.DIAG_NM
          }
        })
      }
      setList(mapList)
    }
    //const loadedPat = localStorage.getItem('patinetList')
  }, [state])
  const tempMethod = () => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('patientList') !== 'undefined'
    ) {
      patientList = localStorage.getItem('patientList')
      // Perform localStorage action
      patList = JSON.parse(patientList as string)!

      // console.log(patList)
    } else {
      //정보없을때 처리
    }
    let mapList = []
    mapList = patList?.map((pat) => {
      const sexAge = pat.SEX_AGE.split('/')
      return {
        name: pat.PTNT_NM,
        birth: pat.BIRTH_YMD,
        age: sexAge[1],
        sex: sexAge[0],
        number: pat.RECEPT_NO,
        doctor: pat.DOCT_EMPL_NM,
        department: pat.DEPT_NM,
        date: pat.ADM_YMD,
        diagnosis: pat.DIAG_NM
      }
    })
    setList(mapList)
  }

  const total = list?.length

  return (
    <Container className="PatientListContainer">
      <Box>
        <T component="h1">환자목록</T>
        <T>
          총 <T component="em">{total}</T>명
        </T>
      </Box>
      <NoSsr>
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
                {list ? (
                  list.map((patient, p) => {
                    const columns = Object.keys(patient)
                    return (
                      <TableRow key={p}>
                        {columns.map((column, c) => (
                          <TableCell key={c}>
                            {patient[column as string]}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      조회된 데이터가 없습니다. 검색값 선택 후 조회버튼을
                      눌러주세요.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </NoSsr>
    </Container>
  )
}

export default PatientList
