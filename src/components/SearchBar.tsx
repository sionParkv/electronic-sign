import RestartAltIcon from '@mui/icons-material/RestartAlt'
import SearchIcon from '@mui/icons-material/Search'
import {
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material'
import React from 'react'

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

const SearchBar = () => {
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
        <Box>
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
        </Box>
        <Box>필드 2</Box>
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

export default SearchBar
