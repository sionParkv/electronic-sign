/**
 * 외래 조회 컴포넌트
 */
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import 'dayjs/locale/ko'
import axios from 'axios'

import { startScanner } from '../pages/_app'
import { useDispatch, useStateValue } from '@/context/stateContext'
import components from '@/components'

interface Department {
  [key: string]: string
  DEPT_CD: string
  DEPT_NM: string
}

interface Doctor {
  [key: string]: string
  DOC_CD: string
  DOC_NM: string
}

interface OutpatientSearchRequest {
  DEPT_CD: string
  DOCT_EMPL_NO: string
  CLINIC_YMD: string
  PTNT_NM: string
}
interface OutPatientSearchProps {
  state: any
  // eslint-disable-next-line no-unused-vars
  handleStateChange: (newList: Array<any>) => void
}

// 날짜 포맷 레이아웃
const DatePicker = (props: {
  value: string
  onChange: React.ChangeEventHandler
}) => {
  return (
    <div className="DatePicker">
      <input
        value={props.value}
        onChange={props.onChange}
        onKeyDown={(event) => {
          event.preventDefault()
        }}
        pattern="\d{4}-\d{2}-\d{2}"
        type="date"
      />
      <CalendarMonthIcon />
    </div>
  )
}

const OutPatientSearch: React.FC<OutPatientSearchProps> = ({
  handleStateChange
}) => {
  const [departments, setDepartments] = useState([])
  const [doctor, setDoctor] = useState([])
  const [selected1, setSelected1] = useState('ALL')
  const [selected2, setSelected2] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  )
  const [radio, setRadio] = useState('all')
  const [patNm, setPatNm] = useState('')

  const state = useStateValue()
  const scannedData = state?.scannedData
  const dispatch = useDispatch()
  // const extractHyphen = selectedDate.replace(/[-.]/g, '')

  //Qr스캔 후 환자번호를 가져올 거
  const onQRCodeScanned = () => {
    window.onQRCodeScanned = (data: any) => {
      if (!data) return

      let parsedData: any

      if (!isNaN(data)) {
        parsedData = parseInt(data)
      } else if (typeof data === 'string') {
        parsedData = data
      } else {
        openErrorDialog()
        return // 데이터가 숫자나 문자열이 아니면 함수 종료
      }

      if (dispatch) {
        dispatch({ type: 'QR_CODE_SCANNED', data: parsedData })
      }
    }
  }
  useEffect(() => {
    if (scannedData) {
      setPatNm(scannedData)
      axios
        .post('/api/outPatient', {
          CLINIC_YMD: '20220603',
          // TODO: 임시 테스트를 위해 날짜 고정
          // CLINIC_YMD: selectedDate.replace(/[-.]/g, ''),
          DEPT_CD: selected1,
          DOCT_EMPL_NO: selected2,
          PTNT_NM: scannedData
        })
        .then((response) => {
          const newData = response.data.data || []
          localStorage.setItem(
            'patientList',
            `{"outPatient":${JSON.stringify(newData)}}`
          )
          handleStateChange(newData)
          const setStorage: any = {
            selected1,
            selected2,
            patNm: scannedData,
            selectedDate
          }
          localStorage.setItem('filters', JSON.stringify(setStorage))
        })
        .catch(() => {
          openErrorDialog()
        })
    }
  }, [scannedData])

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

  // 진료과, 진료의 api 호출
  const loadItems = async () => {
    const getStorage = JSON.parse(localStorage.getItem('filters') as string)
    await axios
      .get('/api/deptSearch')
      .then((response) => {
        setDepartments(response?.data?.data || [])
      })
      .catch(() => {
        openErrorDialog()
      })

    await axios
      .post('/api/doctorSearch', {
        DEPT_CD: getStorage ? getStorage.selected1 : selected1
      })
      .then((respose) => {
        setDoctor(respose?.data?.data || [])
      })
      .catch(() => {
        openErrorDialog()
      })
    if (getStorage) {
      setSelected1(getStorage.selected1)
      setSelected2(getStorage.selected2)
      setPatNm(getStorage.patNm)
      setSelectedDate(getStorage.selectedDate)
    }
  }

  useEffect(() => {
    loadItems()
    onQRCodeScanned()
  }, [])

  // 조회 클릭 이벤트
  const patSearch = async () => {
    handleRequestOutpatients({
      CLINIC_YMD: '20220603',
      // TODO: 임시 테스트를 위해 날짜 고정
      // CLINIC_YMD: extractHyphen,
      DEPT_CD: selected1,
      DOCT_EMPL_NO: selected2,
      PTNT_NM: patNm
    })
  }

  // 진료과 상태관리
  const handleSelect1 = async (e: any) => {
    const value = e.target?.value
    setSelected1(value)
    await axios
      .post('/api/doctorSearch', {
        DEPT_CD: value
      })
      .then((respose) => {
        setDoctor(respose?.data?.data || [])
      })
      .catch(() => {
        openErrorDialog()
      })

    await handleRequestOutpatients({
      CLINIC_YMD: '20220603',
      DEPT_CD: value,
      DOCT_EMPL_NO: selected2,
      PTNT_NM: patNm
    })
  }

  // 진료의 상태관리
  const handleSelect2 = (e: any) => {
    const value = e.target?.value
    setSelected2(value)
    handleRequestOutpatients({
      CLINIC_YMD: '20220603',
      DEPT_CD: selected1,
      DOCT_EMPL_NO: value,
      PTNT_NM: patNm
    })
  }

  // 날짜 상태관리
  const handleDatePicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value
    setSelectedDate(value)
    handleRequestOutpatients({
      CLINIC_YMD: value,
      DEPT_CD: selected1,
      DOCT_EMPL_NO: selected2,
      PTNT_NM: patNm
    })
  }

  //환자명 라디오 박스 상태관리
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === 'all') {
      setPatNm('')
      handleRequestOutpatients({
        CLINIC_YMD: '20220603',
        DEPT_CD: selected1,
        DOCT_EMPL_NO: selected2,
        PTNT_NM: ''
      })
    }
    setRadio(value)
  }
  // 환자 인풋박스 상태관리
  const handlePatNmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value
    setPatNm(value)
    handleRequestOutpatients({
      CLINIC_YMD: '20220603',
      DEPT_CD: selected1,
      DOCT_EMPL_NO: selected2,
      PTNT_NM: value
    })
  }

  // 조회 조건 선택 시 바로 데이터 요청 및 검색버튼 클릭시 요청하는 API
  const handleRequestOutpatients = async (
    sendForm: OutpatientSearchRequest
  ) => {
    await axios
      .post('/api/outPatient', sendForm)
      .then((response) => {
        if (response.data.data) {
          localStorage.setItem(
            'patientList',
            `{"outPatient":${JSON.stringify(response.data.data)}}`
          )
          handleStateChange(response.data.data)
        } else {
          localStorage.setItem(
            'patientList',
            `{"outPatient":${JSON.stringify([])}}`
          )
          handleStateChange([])
        }
        const setStorage: any = {
          selectedDate: sendForm.CLINIC_YMD,
          selected1: sendForm.DEPT_CD,
          selected2: sendForm.DOCT_EMPL_NO,
          patNm: sendForm.PTNT_NM
        }
        localStorage.setItem('filters', JSON.stringify(setStorage))
      })
      .catch(() => {
        openErrorDialog()
      })
  }

  // 초기화 버튼 클릭 이벤트
  const handleReset = () => {
    const newDate = moment().format('YYYY-MM-DD')
    localStorage.removeItem('filters')
    setSelected1('ALL')
    setSelected2('ALL')
    setSelectedDate(newDate)
    setPatNm('')
  }

  return (
    <Container className="SearchBar">
      <Box className="Fields">
        <Box className="Field1">
          <InputLabel>진료과</InputLabel>
          <Select value={selected1} onChange={handleSelect1}>
            <MenuItem value="ALL">
              <em>진료과 선택</em>
            </MenuItem>
            {departments.map((department: Department, d) => (
              <MenuItem key={d} value={department.DEPT_CD}>
                {department.DEPT_NM}
              </MenuItem>
            ))}
          </Select>
          <InputLabel>진료의</InputLabel>
          <Select value={selected2} onChange={handleSelect2}>
            <MenuItem value="ALL">
              <em>진료의 선택</em>
            </MenuItem>
            {doctor.map((doctor: Doctor, d) => {
              return (
                <MenuItem key={d} value={doctor.DOCT_EMPL_NO}>
                  {doctor.DOCT_EMPL_NM}
                </MenuItem>
              )
            })}
          </Select>
          <InputLabel disabled={true}>진료일 조회</InputLabel>
          <DatePicker value={selectedDate} onChange={handleDatePicker} />
        </Box>
        <Box className="Field2">
          <RadioGroup
            className="RadioGroup"
            value={radio}
            onChange={handleRadioChange}
          >
            <FormControlLabel value="all" control={<Radio />} label="전체" />
            <FormControlLabel value="pat" control={<Radio />} label="환자명" />
          </RadioGroup>
          <TextField
            autoComplete="off"
            className="Keyword"
            variant="outlined"
            value={patNm}
            onChange={handlePatNmChange}
          />
        </Box>
      </Box>
      <Box className="Buttons">
        <Button
          variant="outlined"
          startIcon={<CenterFocusWeakIcon />}
          onClick={startScanner}
        >
          QR바코드
        </Button>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
        >
          초기화
        </Button>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={patSearch}
        >
          조회
        </Button>
      </Box>
    </Container>
  )
}

export default OutPatientSearch
