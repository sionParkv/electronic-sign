/**
 * 수술 조회 컴포넌트
 */

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

import components from '@/components'

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

// 날짜 포맷
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
        pattern="\d{4}-\d{2}-\d{2}"
        type="date"
      />
      <CalendarMonthIcon />
    </div>
  )
}

const SurgerySearch: React.FC<SurgerySearchProps> = ({
  state,
  handleStateChange
}) => {
  const [departments, setDepartments] = useState([])
  const [surgery, setSurgery] = useState([])
  const [anesth, setAnesth] = useState([])
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  )

  const [selected1, setSelected1] = useState('-')
  const [selected2, setSelected2] = useState('-')
  const [selected3, setSelected3] = useState('-')
  const [patNm, setPatNm] = useState('')

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

  const handleSelect1 = (e: any) => {
    setSelected1(e.target?.value)
  }
  const handleSelect2 = (e: any) => {
    setSelected2(e.target?.value)
  }
  const handleSelect3 = (e: any) => {
    setSelected3(e.target?.value)
  }

  // 수술 조회 클릭 이벤트
  const patSearch = async () => {
    await axios
      .post('/api/surgery', {
        OP_YMD: '20221011',
        // CLINIC_YMD : selectedDate.replace(/[-.]/g, ''),
        OP_DEPT_CD: selected1 === '-' ? '' : selected1,
        AN_TYPE_GB: selected2 === '-' ? '' : selected2,
        OP_GB: selected3 === '-' ? '' : selected3,
        PTNT_NM: patNm
      })
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
          selected1: selected1,
          selected2: selected2,
          selected3: selected3,
          patNm: patNm,
          selectedDate: selectedDate
        }
        localStorage.setItem('filters', JSON.stringify(setStorage))
      })
      .catch(() => {
        openErrorDialog()
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

  // 초기화 버튼 클릭 이벤트
  const handleReset = () => {
    localStorage.removeItem('filters')
    setSelected1('-')
    setSelected2('-')
    setSelected3('-')
    setPatNm('')
  }

  useEffect(() => {
    loadItems()
  }, [state])

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
          <InputLabel>마취구분</InputLabel>
          <Select value={selected2} onChange={handleSelect2}>
            <MenuItem disabled value="-">
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
            <MenuItem disabled value="-">
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
          <DatePicker defaultValue={selectedDate} onChange={handleDatePicker} />
          <TextField
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
