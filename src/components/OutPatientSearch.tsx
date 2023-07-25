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

interface Doctor {
  [key: string]: string
  DOC_CD: string
  DOC_NM: string
}

const koLocale = koKR.components.MuiLocalizationProvider.defaultProps.localeText

const OutPatientSearch = () => {
  const [departments, setDepartments] = useState([])
  const [doctor, setDoctor] = useState([])
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
      .post('/api/doctorSearch')
      .then((respose) => {
        setDoctor(respose?.data?.data || [])
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const patSearch = async () => {
    await axios
      .post('/api/outPatient', {
        DEPT_CD: departments,
        WARD_CD: doctor,
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

  const handleSelect1 = (e: any) => {
    setSelected1(e.target?.value)
  }
  const handleSelect2 = (e: any) => {
    setSelected2(e.target?.value)
  }

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
          <InputLabel>진료의</InputLabel>
          <Select value={selected2} onChange={handleSelect2}>
            <MenuItem disabled value="-">
              <em>진료의 선택</em>
            </MenuItem>
            {doctor.map((doctor: Doctor, d) => (
              <MenuItem key={d} value={doctor.DOC_CD}>
                {doctor.DOC_NM}
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
              defaultValue={dayjs(moment().format('YYYY-MM-DD'))}
              format="YYYY-MM-DD"
            />
          </LocalizationProvider>
        </Box>
        <Box className="Field2">
          <RadioGroup className="RadioGroup" defaultValue="pat">
            <FormControlLabel
              disabled
              value="all"
              control={<Radio />}
              label="전체"
            />
            <FormControlLabel
              disabled
              value="pat"
              control={<Radio />}
              label="환자명"
            />
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

export default OutPatientSearch
