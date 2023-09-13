/**
 * 수술 조회 컴포넌트
 */
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { startScanner } from '../pages/_app'
import components from '@/components'
import { useDispatch, useStateValue } from '@/context/stateContext'

interface Department {
  [key: string]: string
  DEPT_CD: string
  DEPT_NM: string
}

interface Surgery {
  [key: string]: string
  SUG_CD: string
  SUG_NM: string
}

interface Anesthesia {
  [key: string]: string
  ANE_CD: string
  ANE_NM: string
}

interface SurgerySearchProps {
  state: any
  // eslint-disable-next-line no-unused-vars
  handleStateChange: (newList: Array<any>) => void
}

interface SurgerySearchRequest {
  OP_YMD: string
  OP_DEPT_CD: string
  AN_TYPE_GB: string
  OP_GB: string
  PTNT_NM: string
}

// 날짜 포맷
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

const SurgerySearch: React.FC<SurgerySearchProps> = ({ handleStateChange }) => {
  const [departments, setDepartments] = useState([])
  const [surgery, setSurgery] = useState([])
  const [anesth, setAnesth] = useState([])
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  )
  const [selected1, setSelected1] = useState(' ')
  const [selected2, setSelected2] = useState(' ')
  const [selected3, setSelected3] = useState(' ')
  const [patNm, setPatNm] = useState('')
  const qrState = useStateValue()
  const scannedData = qrState?.scannedData
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
        .post('/api/surgery', {
          OP_YMD: '20221011',
          // TODO 날짜변경
          // OP_YMD: extractHyphen,
          OP_DEPT_CD: selected1,
          AN_TYPE_GB: selected2,
          OP_GB: selected3,
          PTNT_NM: scannedData
        })
        .then((response) => {
          const newData = response.data.data || []
          localStorage.setItem(
            'patientList',
            `{"surgery":${JSON.stringify(newData)}}`
          )
          handleStateChange(newData)
          const setStorage: any = {
            selected1,
            selected2,
            selected3: selected3,
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
  // 진료과, 마취구분, 수술구분 api 호출
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
      .get('/api/surgerySearch')
      .then((respose) => {
        setSurgery(respose?.data?.data || [])
      })
      .catch(() => {
        openErrorDialog()
      })

    await axios
      .get('/api/anesthSearch')
      .then((respose) => {
        setAnesth(respose?.data?.data || [])
      })
      .catch(() => {
        openErrorDialog()
      })

    const getStorage = JSON.parse(localStorage.getItem('filters') as string)
    if (getStorage) {
      setSelected1(getStorage?.selected1)
      setSelected2(getStorage?.selected2)
      setSelected3(getStorage?.selected3)
      setPatNm(getStorage?.patNm)
      setSelectedDate(getStorage?.selectedDate)
    }
  }

  // 진료과 상태관리
  const handleSelect1 = (e: any) => {
    const value = e.target?.value
    setSelected1(value)
    handleRequestSurgeries({
      OP_YMD: '20221011',
      OP_DEPT_CD: value,
      AN_TYPE_GB: selected2,
      OP_GB: selected3,
      PTNT_NM: patNm
    })
  }

  // 마취구분 선택 상태관리
  const handleSelect2 = (e: any) => {
    const value = e.target?.value
    setSelected2(value)
    handleRequestSurgeries({
      OP_YMD: '20221011',
      OP_DEPT_CD: selected1,
      AN_TYPE_GB: value,
      OP_GB: selected3,
      PTNT_NM: patNm
    })
  }

  //수술구분 선택 상태관리
  const handleSelect3 = (e: any) => {
    const value = e.target?.value
    setSelected3(value)
    handleRequestSurgeries({
      OP_YMD: '20221011',
      OP_DEPT_CD: selected1,
      AN_TYPE_GB: selected2,
      OP_GB: value,
      PTNT_NM: patNm
    })
  }

  // 검색조건 조회버튼 이벤트
  const patSearch = () => {
    handleRequestSurgeries({
      OP_YMD: '20221011',
      OP_DEPT_CD: selected1,
      AN_TYPE_GB: selected2,
      OP_GB: selected3,
      PTNT_NM: patNm
    })
  }

  // 환자명 인풋박스 상태관리
  const handlePatNmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatNm(event.target.value)
  }
  // 날짜 포맷 상태관리
  const handleDatePicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value)
  }

  // 조회 조건 선택 시 바로 데이터 요청 및 검색버튼 클릭시 요청하는 API
  const handleRequestSurgeries = async (sendForm: SurgerySearchRequest) => {
    await axios
      .post('/api/surgery', sendForm)
      .then((response) => {
        if (response.data.data) {
          localStorage.setItem(
            'patientList',
            `{"surgery":${JSON.stringify(response.data.data)}}`
          )
          handleStateChange(response.data.data)
        } else {
          localStorage.setItem(
            'patientList',
            `{"surgery":${JSON.stringify([])}}`
          )
          handleStateChange([])
        }
        const setStorage: any = {
          selectedDate: sendForm.OP_YMD,
          selected1: sendForm.OP_DEPT_CD,
          selected2: sendForm.AN_TYPE_GB,
          selected3: sendForm.OP_GB,
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
    setSelected1(' ')
    setSelected2(' ')
    setSelected3(' ')
    setSelectedDate(newDate)
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
            <MenuItem value=" ">
              <em>진료과 선택</em>
            </MenuItem>
            {departments.map((department: Department, d) => (
              <MenuItem key={d} value={department.DEPT_CD}>
                {department.DEPT_NM}
              </MenuItem>
            ))}
          </Select>
          <InputLabel>마취구분</InputLabel>
          <Select value={selected2} onChange={handleSelect2}>
            <MenuItem value=" ">
              <em>마취구분 선택</em>
            </MenuItem>
            {anesth.map((anesthesia: Anesthesia, a) => (
              <MenuItem key={a} value={anesthesia.SMPL_CD}>
                {anesthesia.SMPL_NM}
              </MenuItem>
            ))}
          </Select>
          <InputLabel>수술구분</InputLabel>
          <Select value={selected3} onChange={handleSelect3}>
            <MenuItem value=" ">
              <em>구분 선택</em>
            </MenuItem>
            {surgery.map((surgery: Surgery, s) => (
              <MenuItem key={s} value={surgery.SMPL_CD}>
                {surgery.SMPL_NM}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className="Field2">
          <InputLabel disabled={true}>진료일 조회</InputLabel>
          <DatePicker value={selectedDate} onChange={handleDatePicker} />
          <TextField
            autoComplete="off"
            className="Keyword"
            placeholder="환자명"
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

export default SurgerySearch
