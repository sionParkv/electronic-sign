import { Box, CircularProgress, Container, Tab, Tabs } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getCookie, hasCookie } from 'cookies-next'

import components from '@/components'
import { AES256 } from '@/utils/AES256'
import { useRouter } from 'next/router'
import { useStateValue, useDispatch } from '@/context/stateContext'
import axios from 'axios'
import moment from 'moment'

interface TabPanelProps {
  children: React.ReactNode
  index: number
  value: number
}

const PatientListTabPanel = (props: TabPanelProps) => {
  const { children, index, value } = props
  return (
    <Container className="TabPanel" hidden={value != index}>
      {value === index && <Box className="Panel">{children}</Box>}
    </Container>
  )
}

/**
 * 메인페이지 컴포넌트
 * @returns {React.ReactNode} 메인페이지 컴포넌트
 */
const HomePage = () => {
  const router = useRouter() // Next.js의 라우터 훅 사용
  const state = useStateValue() // 전역 상태 컨텍스트 사용
  const dispatch = useDispatch() // 전역 상태 업데이트 디스패치 함수
  const [isLoading, setIsLoading] = useState<boolean>(true) // 로딩 상태 관리
  const [tab, setTab] = useState<number>(0) // 현재 선택된 탭 인덱스
  const [userInfo, setUserInfo] = useState<string>('') // 로그인 사용자 정보
  const className = 'Pages HomePage'

  /**
   * 환자 목록 상태 업데이트 함수
   * @param {Array} newList - 새로운 환자 목록 데이터
   */
  const handleStateChange = (newList: Array<any>) => {
    if (dispatch) {
      dispatch({ type: 'PATIENT_LIST', list: newList, isLoading: isLoading })
    }
  }

  /**
   * 탭 변경 핸들러
   * @param {React.SyntheticEvent} event - 이벤트 객체
   * @param {number} newTab - 변경할 탭 인덱스
   */
  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    localStorage.setItem('newTab', newTab.toString())
    setTab(newTab)
    localStorage.removeItem('filters')
  }

  let cookie = getCookie('loginCookie')
  let decodeCookie
  let loginCookie: any = []
  if (hasCookie('loginCookie')) {
    decodeCookie = AES256.AES_decrypt(cookie)
    loginCookie = JSON.parse(decodeCookie)
  }

  /**
   * Axios 요청을 통해 환자 목록을 가져오는 함수
   * @param {string} endpoint - 요청할 API 엔드포인트
   * @param {object} data - 요청 데이터
   * @param {string} storageKey - localStorage에 저장할 데이터의 키
   */
  const fetchPatientList = (
    endpoint: string,
    data: object,
    storageKey: string
  ) => {
    axios
      .post(endpoint, data)
      .then((response) => {
        const newData = response.data.data || []
        localStorage.setItem(
          'patientList',
          `{"${storageKey}":${JSON.stringify(newData)}}`
        )
        handleStateChange(newData)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // 페이지 렌더링 완료 시 실행되는 효과 훅
  useEffect(() => {
    if (!hasCookie('loginCookie')) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      router.push('/login')
    } else {
      if (loginCookie.length) {
        const { EMPL_NM, DEPT_CD, EMPL_NO } = loginCookie[0]
        setUserInfo(`${EMPL_NM} ${DEPT_CD} ${EMPL_NO} 님`)
      }

      const getItem = parseInt(localStorage.getItem('newTab')!)
      setTab(getItem ? getItem : 0)

      const patientList = localStorage.getItem('patientList') || '{}'
      const jsonPatientList = JSON.parse(patientList)

      const existsAdmission = jsonPatientList?.admission?.length
      const existsOutpatient = jsonPatientList?.outPatient?.length
      const existsSurgery = jsonPatientList?.surgery?.length

      // 선택한 탭에 따라 환자 목록 가져오기
      if (getItem === 0 && !existsAdmission) {
        if (patientList && jsonPatientList['admission']) {
          setIsLoading(false)
          return
        }
        fetchPatientList(
          '/api/admission',
          {
            DEPT_CD: 'ALL',
            WARD_CD: 'ALL',
            PTNT_NM: ''
          },
          'admission'
        )
      } else if (getItem === 1 && !existsOutpatient) {
        if (patientList && jsonPatientList['outpatient']) {
          setIsLoading(false)
          return
        }
        fetchPatientList(
          '/api/outPatient',
          {
            CLINIC_YMD: '20220603',
            // TODO: 임시 테스트를 위해 날짜 고정
            // CLINIC_YMD: today.format('YYYYMMDD'),
            DEPT_CD: 'ALL',
            DOCT_EMPL_NO: 'ALL',
            PTNT_NM: ''
          },
          'outPatient'
        )
      } else if (getItem === 2 && !existsSurgery) {
        if (patientList && jsonPatientList['surgery']) {
          setIsLoading(false)
          return
        }
        const today = moment()
        fetchPatientList(
          '/api/surgery',
          {
            OP_YMD: today.format('YYYYMMDD'),
            OP_DEPT_CD: '-',
            AN_TYPE_GB: '-',
            OP_GB: '-',
            PTNT_NM: ''
          },
          'surgery'
        )
      }
    }
    setIsLoading(false)
  }, [tab])
  const propsHeader = {
    userInfo: userInfo
  }
  return (
    <Container className={className}>
      {/* {hasCookie('loginCookie') && (
        <React.Fragment> */}
      <components.Header {...propsHeader} />
      <Container className="PageWrapper">
        {isLoading ? (
          <Box className="Progress">
            <CircularProgress />
          </Box>
        ) : (
          <Container className="Contents">
            {tab === 0 && (
              <components.AdmissionSearch
                state={state}
                handleStateChange={handleStateChange}
              />
            )}
            {tab === 1 && (
              <components.OutPatientSearch
                state={state}
                handleStateChange={handleStateChange}
              />
            )}
            {tab === 2 && (
              <components.SurgerySearch
                state={state}
                handleStateChange={handleStateChange}
              />
            )}
            <Container className="TabContainer">
              <Box>
                <Tabs
                  value={tab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                >
                  <Tab label="입원" />
                  <Tab label="외래" />
                  <Tab label="수술" />
                </Tabs>
              </Box>
              <React.Fragment>
                <PatientListTabPanel value={tab} index={0}>
                  <components.PatientList tabValue={tab} />
                </PatientListTabPanel>
                <PatientListTabPanel value={tab} index={1}>
                  <components.PatientList tabValue={tab} />
                </PatientListTabPanel>
                <PatientListTabPanel value={tab} index={2}>
                  <components.PatientList tabValue={tab} />
                </PatientListTabPanel>
              </React.Fragment>
            </Container>
          </Container>
        )}
      </Container>
      <components.Footer />
      {/* </React.Fragment>
      )} */}
    </Container>
  )
}

export default HomePage
