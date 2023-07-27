import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SearchIcon from '@mui/icons-material/Search'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { koKR } from '@mui/x-date-pickers/locales'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import dayjs from 'dayjs'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import 'dayjs/locale/ko'
import axios from 'axios'

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
  //TODO Search컴포넌트3개에 handleStateChange 인자가 필요한데 인자를 담아도 never used가 뜹니다ㅜ
  // eslint-disable-next-line no-unused-vars
  handleStateChange: (newList: any) => void
}

const koLocale = koKR.components.MuiLocalizationProvider.defaultProps.localeText

const SurgerySearch: React.FC<SurgerySearchProps> = ({
  state,
  handleStateChange
}) => {
  const [departments, setDepartments] = useState([])
  const [surgery, setSurgery] = useState([])
  const [anesth, setAnesth] = useState([])
  const [selectedDate, setSelectedDate] = useState(
    dayjs(moment().format('YYYY-MM-DD'))
  )

  const [selected1, setSelected1] = useState('-')
  const [selected2, setSelected2] = useState('-')
  const [selected3, setSelected3] = useState('-')
  const [patNm, setPatNm] = useState('')

  const loadItems = async () => {
    await axios
      .get('/api/deptSearch')
      .then((response) => {
        setDepartments(response?.data?.data || [])
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .get('/api/surgerySearch')
      .then((respose) => {
        setSurgery(respose?.data?.data || [])
      })
      .catch((error) => {
        console.log(error)
      })

    await axios
      .get('/api/anesthSearch')
      .then((respose) => {
        setAnesth(respose?.data?.data || [])
      })
      .catch((error) => {
        console.log(error)
      })
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
  const patSearch = async () => {
    await axios
      .post('/api/surgery', {
        OP_YMD: '20221011',
        // OP_YMD: selectedDate,
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
          return
        } else {
          localStorage.setItem(
            'patientList',
            `{"surgery":${JSON.stringify([])}}`
          )
          handleStateChange([])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const handlePatNmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatNm(event.target.value)
  }

  const handleDatePicker = (date: any) => {
    setSelectedDate(date)
  }
  const handleReset = () => {
    setSelected1('-')
    setSelected2('-')
    setSelected3('-')
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
          <LocalizationProvider
            adapterLocale="ko"
            dateAdapter={AdapterDayjs}
            localeText={koLocale}
          >
            <DatePicker
              className="DatePicker"
              value={selectedDate}
              format="YYYY-MM-DD"
              onChange={handleDatePicker}
            />
          </LocalizationProvider>
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
