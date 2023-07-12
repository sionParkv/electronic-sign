import { Container } from '@mui/material'
import { Typography as T } from '@mui/material'
import Image from 'next/image'
import React from 'react'

import IMGS from '../assets/images'

const Footer = () => {
  return (
    <Container className="Footer">
      <Image src={IMGS.LogoBottom} alt="EONE Logo" />
      <T>COPYRIGHT(C) 2023 EONE HEALTHCARE. ALL RIGHTS RESERVED.</T>
    </Container>
  )
}

export default Footer
