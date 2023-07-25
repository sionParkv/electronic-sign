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
import React from 'react'
import 'dayjs/locale/ko'

interface Department {
  [key: string]: string
  code: string
  name: string
}

interface Doctor {
  [key: string]: string
  code: string
  name: string
}

const koLocale = koKR.components.MuiLocalizationProvider.defaultProps.localeText

const OutPatientSearch = () => {
  // TODO: 데이터베이스 데이터 연동
  const departments: Array<Department> = [
    {
      code: 'AA',
      name: '마취통증의학과'
    },
    {
      code: 'IF',
      name: '산부인과'
    },
    {
      code: 'US',
      name: '영상의학과'
    }
  ]
  // TODO: 데이터베이스 데이터 연동
  const doctors: Array<Doctor> = [
    {
      code: 'AA',
      name: '나의사'
    },
    {
      code: 'IF',
      name: '홍길동'
    }
  ]

  return (
    <Container className="SearchBar">
      <Box className="Fields">
        <Box className="Field1">
          <InputLabel>진료과</InputLabel>
          <Select value="-">
            <MenuItem disabled value="-">
              <em>진료과 선택</em>
            </MenuItem>
            {departments.map((department, d) => (
              <MenuItem key={d} value={department.code}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
          <InputLabel>진료의</InputLabel>
          <Select value="-">
            <MenuItem disabled value="-">
              <em>진료의 선택</em>
            </MenuItem>
            {doctors.map((doctor, d) => (
              <MenuItem key={d} value={doctor.code}>
                {doctor.name}
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
              value="sta"
              control={<Radio />}
              label="담당"
            />
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
          <TextField className="Keyword" variant="outlined" />
        </Box>
      </Box>
      <Box className="Buttons">
        <Button variant="outlined" startIcon={<RestartAltIcon />}>
          초기화
        </Button>
        <Button variant="contained" startIcon={<SearchIcon />}>
          조회
        </Button>
      </Box>
    </Container>
  )
}

export default OutPatientSearch
