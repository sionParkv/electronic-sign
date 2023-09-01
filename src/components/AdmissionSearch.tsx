/**
 * 입원 조회 컴포넌트
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

import components from '@/components'
import { useDispatch, useStateValue } from '@/context/stateContext'

interface Department {
  [key: string]: string
  DEPT_CD: string
  DEPT_NM: string
}

interface Hospital {
  [key: string]: string
  SMPL_CD: string
  SMPL_NM: string
}

interface AdmissionSearchProps {
  state: any
  // eslint-disable-next-line no-unused-vars
  handleStateChange: (newList: Array<any>) => void
}

// 달력 UI 포맷
const DatePicker = (props: {
  defaultValue: string
  onChange: React.ChangeEventHandler
}) => {
  return (
    <div className="DatePicker">
      <input
        defaultValue={props.defaultValue}
        onChange={props.onChange}
        onKeyDown={(event) => {
          event.preventDefault()
        }}
        disabled
        pattern="\d{4}-\d{2}-\d{2}"
        type="date"
      />
      <CalendarMonthIcon />
    </div>
  )
}

const AdmissionSearch: React.FC<AdmissionSearchProps> = ({
  handleStateChange
}) => {
  const [departments, setDepartments] = useState([])
  const [wards, setWards] = useState([])
  const [selected1, setSelected1] = useState('-')
  const [selected2, setSelected2] = useState('-')
  const [radio, setRadio] = useState('all')
  const [patNm, setPatNm] = useState('')
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  )
  const state = useStateValue()
  const scannedData = state?.scannedData
  const dispatch = useDispatch()
  console.log()
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
        .post('/api/admission', {
          DEPT_CD: selected1 === '-' ? 'ALL' : selected1,
          WARD_CD: selected2 === '-' ? 'ALL' : selected2,
          PTNT_NM: scannedData
        })
        .then((response) => {
          const newData = response.data.data || []
          localStorage.setItem(
            'patientList',
            `{"admission":${JSON.stringify(newData)}}`
          )
          handleStateChange(newData)
          const setStorage: any = {
            selected1: selected1,
            selected2: selected2,
            patNm: scannedData,
            selectedDate: selectedDate
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

  // api 호출
  const loadItems = async () => {
    await axios
      .get('/api/deptSearch')
      .then((response) => {
        setDepartments(response?.data?.data || [])
      })
      .catch(() => {
        openErrorDialog()
      })

    await axios
      .get('/api/hospital')
      .then((respose) => {
        setWards(respose?.data?.data || [])
      })
      .catch(() => {
        openErrorDialog()
      })
    const getStorage = JSON.parse(localStorage.getItem('filters') as string)
    if (getStorage) {
      setSelected1(getStorage?.selected1)
      setSelected2(getStorage?.selected2)
      setPatNm(getStorage?.patNm)
      setSelectedDate(getStorage?.selectedDate)
    }
  }

  // 진료과 상태관리
  const handleSelect1 = (e: any) => {
    setSelected1(e.target?.value)
  }
  // 병동 상태관리
  const handleSelect2 = (e: any) => {
    setSelected2(e.target?.value)
  }

  // 조회 버튼 클릭 이벤트
  const patSearch = async () => {
    await axios
      .post('/api/admission', {
        DEPT_CD: selected1 === '-' ? 'ALL' : selected1,
        WARD_CD: selected2 === '-' ? 'ALL' : selected2,
        PTNT_NM: patNm
      })
      .then((response) => {
        if (response.data.data) {
          localStorage.setItem(
            'patientList',
            `{"admission":${JSON.stringify(response.data.data)}}`
          )
          handleStateChange(response.data.data)
        } else {
          localStorage.setItem(
            'patientList',
            `{"admission":${JSON.stringify([])}}`
          )
          handleStateChange([])
        }
        const setStorage: any = {
          selected1: selected1,
          selected2: selected2,
          patNm: patNm,
          selectedDate: selectedDate
        }
        localStorage.setItem('filters', JSON.stringify(setStorage))
      })
      .catch(() => {
        openErrorDialog()
      })
  }
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === 'all') {
      setPatNm('')
    }
    setRadio(e.target.value)
  }
  // 환자 인풋박스 상태관리
  const handlePatNmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatNm(event.target.value)
  }
  // 날짜 상태관리
  const handleDatePicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value)
  }
  // 초기화 버튼 이벤트
  const handleReset = () => {
    localStorage.removeItem('filters')
    setSelected1('-')
    setSelected2('-')
    setPatNm('')
  }

  useEffect(() => {
    loadItems()
    onQRCodeScanned()
  }, [])

  return (
    <Container className="SearchBar">
      <Box className="Fields">
        <Box className="Field1">
          <InputLabel>진료과</InputLabel>
          <Select value={selected1} onChange={handleSelect1}>
            <MenuItem disabled value="-">
              <em>진료과 선택</em>
            </MenuItem>
            {departments.map((department: Department, d) => (
              <MenuItem key={d} value={department.DEPT_CD}>
                {department.DEPT_NM}
              </MenuItem>
            ))}
          </Select>
          <InputLabel>병동</InputLabel>
          <Select value={selected2} onChange={handleSelect2}>
            <MenuItem disabled value="-">
              <em>병동 선택</em>
            </MenuItem>
            {wards.map((ward: Hospital, h) => (
              <MenuItem key={h} value={ward.SMPL_CD}>
                {ward.SMPL_NM}
              </MenuItem>
            ))}
          </Select>
          <InputLabel disabled={true}>진료일 조회</InputLabel>
          <DatePicker defaultValue={selectedDate} onChange={handleDatePicker} />
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

export default AdmissionSearch
