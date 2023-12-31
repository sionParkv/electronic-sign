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
  const [isShow, setIsShow] = useState<boolean>(false) // 로딩 상태 관리
  const [tab, setTab] = useState<number>(0) // 현재 선택된 탭 인덱스
  const [userInfo, setUserInfo] = useState<string>('') // 로그인 사용자 정보
  const className = isShow ? 'Pages HomePage' : 'Pages HomePage hidden'

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
   * 오류 다이얼로그 열기
   */
  const openErrorDialog = () => {
    components.openConfirmDialog({
      contents: (
        <>
          통신 오류가 발생했습니다. <br />
          잠시 후 다시 시도해주세요.
        </>
      ),
      ok: {
        label: '닫기',
        action: () => {
          setTimeout(() => {
            document.getElementsByTagName('input')[0].focus()
          }, 50)
        }
      },
      title: '통신 오류'
    })
    return
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
      .catch(() => {
        openErrorDialog()
      })
  }

  // 페이지 렌더링 완료 시 실행되는 효과 훅
  useEffect(() => {
    if (!hasCookie('loginCookie')) {
      setIsShow(false)
      // 로그인되지 않은 경우 로그인 페이지로 이동
      router.push('/login')
    } else {
      setIsShow(true)
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
      const today = moment()

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
            //TODO 날짜변경
            CLINIC_YMD: '20220603',
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
    </Container>
  )
}

export default HomePage
