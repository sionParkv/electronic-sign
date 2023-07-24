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
  Select
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

interface Surgery {
  [key: string]: string
  code: string
  name: string
}

interface Anesthesia {
  [key: string]: string
  code: string
  name: string
}

const koLocale = koKR.components.MuiLocalizationProvider.defaultProps.localeText

const SurgerySearch = () => {
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
  const surgery: Array<Surgery> = [
    {
      code: '10',
      name: '수술'
    },
    {
      code: '20',
      name: '응급수술'
    },
    {
      code: '30',
      name: '처치'
    },
    {
      code: '40',
      name: '하이푸'
    },
    {
      code: '41',
      name: '비비부'
    },
    {
      code: '50',
      name: '시술'
    },
    {
      code: '60',
      name: '응급시술'
    },
    {
      code: '71',
      name: '정규(IR)'
    },
    {
      code: '72',
      name: '응급(IR)'
    },
    {
      code: '80',
      name: '유도분만'
    },
    {
      code: '81',
      name: '분만'
    }
  ]

  const anesthesia: Array<Anesthesia> = [
    {
      code: '10',
      name: 'General(Endotracheal)'
    },
    {
      code: '11',
      name: 'General(Mask)'
    },
    {
      code: '12',
      name: 'General(LMA)'
    },
    {
      code: '20',
      name: 'Spinal'
    },
    {
      code: '30',
      name: 'Epidural'
    },
    {
      code: '40',
      name: 'IV Block'
    },
    {
      code: '50',
      name: 'B.P.B'
    },
    {
      code: '60',
      name: 'Caudal'
    },
    {
      code: '62',
      name: 'Local'
    },
    {
      code: '70',
      name: 'MON(IV)'
    },
    {
      code: '80',
      name: 'None'
    },
    {
      code: '99',
      name: '진정'
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
          <InputLabel>마취구분</InputLabel>
          <Select value="-">
            <MenuItem disabled value="-">
              <em>마취구분 선택</em>
            </MenuItem>
            {anesthesia.map((anesthesia, a) => (
              <MenuItem key={a} value={anesthesia.code}>
                {anesthesia.name}
              </MenuItem>
            ))}
          </Select>
          <InputLabel>수술구분</InputLabel>
          <Select value="-">
            <MenuItem disabled value="-">
              <em>구분 선택</em>
            </MenuItem>
            {surgery.map((surgery, s) => (
              <MenuItem key={s} value={surgery.code}>
                {surgery.name}
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

export default SurgerySearch
