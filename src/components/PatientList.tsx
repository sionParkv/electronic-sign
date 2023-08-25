/**
 * 환자 테이블 리스트 컴포넌트
 */

import { useStateValue } from '@/context/stateContext'
import {
  Box,
  CircularProgress,
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
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'

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
  division: string
}

interface PatientListProps {
  tabValue: number
}

const PatientList = (props: PatientListProps) => {
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

  const router = useRouter()
  let patList: any = {}
  let patientList: any = ''
  const [isLoading, setIsLoading] = useState(true)
  const [list, setList] = useState<Patient[]>([])
  const [sendInfo, setSendInfo] = useState<Array<any>>([])
  const state = useStateValue()
  const stateList: any[] = state?.list || []
  const tabValue = props.tabValue
  console.log(state)
  // 조회된 데이터 양식에 맞게 포맷
  useEffect(() => {
    if (localStorage.getItem('patientList') !== 'undefined') {
      patMethod()
    } else {
      let mapList: any[] = []
      if (stateList) {
        mapList = stateList?.map((pat: any) => {
          setSendInfo(stateList)
          const sexAge = pat.SEX_AGE.toString().split('/')
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
    setIsLoading(false)
  }, [state])
  // localStorage에 데이터 없을 시 데이터 로드 안되도록
  const patMethod = () => {
    let mapList = []
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('patientList') !== 'undefined'
    ) {
      patientList = localStorage.getItem('patientList')
      if (patientList?.length > 0) {
        patList = JSON.parse(patientList as string)!
      }
    }

    // 입원 탭 클릭 이벤트
    if (tabValue === 0) {
      mapList = patList?.admission?.map((pat: any) => {
        setSendInfo(patList.admission)
        const sexAge = pat?.SEX_AGE.split('/')
        return {
          name: pat.PTNT_NM,
          birth: pat.BIRTH_YMD,
          age: sexAge[1],
          sex: sexAge[0],
          number: pat.PTNT_NO,
          doctor: pat.DOCT_EMPL_NM,
          department: pat.DEPT_NM,
          date: pat.ADM_YMD,
          diagnosis: pat.DIAG_NM,
          division: '입원',
          receptNo: pat.RECEPT_NO
        }
      })
      // 외래 탭 클릭 이벤트
    } else if (tabValue === 1) {
      mapList = patList?.outPatient?.map((pat: any) => {
        setSendInfo(patList.outPatient)
        const sexAge = pat?.SEX_AGE.split('/')
        return {
          name: pat.PTNT_NM,
          birth: pat.BIRTH_YMD,
          age: sexAge[1],
          sex: sexAge[0],
          number: pat.PTNT_NO,
          doctor: pat.DOCT_EMPL_NM,
          department: pat.DEPT_NM,
          date: pat.CLINIC_YMD,
          diagnosis: pat.DIAG_NM,
          division: '외래',
          receptNo: pat.RECEPT_NO
        }
      })
      // 수술 탭 클릭 이벤트
    } else if (tabValue === 2) {
      mapList = patList?.surgery?.map((pat: any) => {
        setSendInfo(patList.surgery)

        return {
          name: pat.PTNT_NM,
          birth: pat.BIRTHDAY_YMD,
          age: pat.AGE,
          sex: pat.SEX,
          number: pat.PTNT_NO,
          doctor: pat.OP_DOCT_NM,
          department: pat.OP_DEPT_NM,
          date: pat.OP_YMD,
          diagnosis: pat.DIAG_NM,
          division: '수술',
          receptNo: pat.RECEPT_NO
        }
      })
    }
    setList(mapList)
  }

  // 환자 클릭시 localStorage에 데이터 담으면서 화면 전환
  const rowClick = (index: any) => () => {
    localStorage.setItem('patientInfo', JSON.stringify(list[index]))
    localStorage.setItem('sendToPatientInfo', JSON.stringify(sendInfo[index]))
    router.push('/patient')
  }

  // 전체 환자 수
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
                {isLoading || list === undefined ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : list?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      조회된 데이터가 없습니다. 검색값 선택 후 조회버튼을
                      눌러주세요.
                    </TableCell>
                  </TableRow>
                ) : (
                  <Fragment>
                    {list?.map((patient: Patient, p: number) => {
                      const columns = Object.keys(patient).slice(0, -2)
                      return (
                        <TableRow key={p}>
                          {columns.map((column, index) => {
                            return (
                              <TableCell key={index} onClick={rowClick(p)}>
                                <T>{patient[column as string]}</T>
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })}
                  </Fragment>
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
