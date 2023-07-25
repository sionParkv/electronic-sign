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
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
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

interface Hospital {
  [key: string]: string
  SMPL_CD: string
  SMPL_NM: string
}

const koLocale = koKR.components.MuiLocalizationProvider.defaultProps.localeText

const AdmissionSearch = () => {
  const [departments, setDepartments] = useState([])
  const [wards, setWards] = useState([])
  const [selected1, setSelected1] = useState('')
  const [selected2, setSelected2] = useState('')
  let patNm = ''

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
      .get('/api/hospital')
      .then((respose) => {
        setWards(respose?.data?.data || [])
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

  const patSearch = async () => {
    await axios
      .post('/api/admission', {
        DEPT_CD: departments,
        WARD_CD: wards,
        PTNT_NM: ''
      })
      .then((resposne) => {
        console.log(resposne.data.data)
        localStorage.setItem('patientList', JSON.stringify(resposne.data.data))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    loadItems()
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
          <LocalizationProvider
            adapterLocale="ko"
            dateAdapter={AdapterDayjs}
            localeText={koLocale}
          >
            <DatePicker
              className="DatePicker"
              disabled
              defaultValue={dayjs(moment().format('YYYY-MM-DD'))}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
        </Box>
        <Box className="Field2">
          <RadioGroup className="RadioGroup" defaultValue="pat">
            <FormControlLabel value="all" control={<Radio />} label="전체" />
            <FormControlLabel value="pat" control={<Radio />} label="환자명" />
          </RadioGroup>
          <TextField
            className="Keyword"
            variant="outlined"
            defaultValue={patNm}
          />
        </Box>
      </Box>
      <Box className="Buttons">
        <Button variant="outlined" startIcon={<RestartAltIcon />}>
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
