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
interface OutPatientSearchProps {
  state: any
  // eslint-disable-next-line no-unused-vars
  handleStateChange: (newList: any) => void
}

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

const OutPatientSearch: React.FC<OutPatientSearchProps> = ({
  state,
  handleStateChange
}) => {
  const [departments, setDepartments] = useState([])
  const [doctor, setDoctor] = useState([])
  const [selected1, setSelected1] = useState('-')
  const [selected2, setSelected2] = useState('-')
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  )
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
      .post('/api/doctorSearch', {
        DEPT_CD: selected1
      })
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
        CLINIC_YMD: '20220603',
        // CLINIC_YMD : selectedDate.replace(/[-.]/g, ''),
        DEPT_CD: selected1 === '-' ? 'ALL' : selected1,
        DOCT_EMPL_NO: selected2 === '-' ? 'ALL' : selected2,
        PTNT_NM: patNm
      })
      .then((response) => {
        if (response.data.data) {
          localStorage.setItem(
            'patientList',
            `{"outPatient":${JSON.stringify(response.data.data)}}`
          )
          handleStateChange(response.data.data)
          console.log(response.data.data)
          return
        } else {
          localStorage.setItem(
            'patientList',
            `{"outPatient":${JSON.stringify([])}}`
          )
          handleStateChange([])
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    loadItems()
  }, [state])

  const handleSelect1 = (e: any) => {
    setSelected1(e.target?.value)
    axios
      .post('/api/doctorSearch', {
        DEPT_CD: e.target?.value
      })
      .then((respose) => {
        setDoctor(respose?.data?.data || [])
        console.log(respose?.data?.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const handleSelect2 = (e: any) => {
    setSelected2(e.target?.value)
  }

  const handleReset = () => {
    setSelected1('-')
    setSelected2('-')
    setPatNm('')
  }

  const handleDatePicker = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value)
  }
  const handlePatNmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatNm(event.target.value)
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
            {doctor.map((doctor: Doctor, d) => {
              console.log(doctor)
              return (
                <MenuItem key={d} value={doctor.DOCT_EMPL_NO}>
                  {doctor.DOCT_EMPL_NM}
                </MenuItem>
              )
            })}
          </Select>
          <InputLabel disabled={true}>진료일 조회</InputLabel>
          <DatePicker defaultValue={selectedDate} onChange={handleDatePicker} />
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

export default OutPatientSearch
