/**
 * 하단 Footer 컴포넌트
 */

import { Container, Typography as T } from '@mui/material'
import Image from 'next/image'
import React from 'react'

import IMGS from '../assets/images'

const Footer = () => {
  return (
    <Container className="Footer">
      <Image src={IMGS.LogoBottom} alt="EONE Logo" width="129" height="25" />
      <T>COPYRIGHT(C) 2023 EONE HEALTHCARE. ALL RIGHTS RESERVED.</T>
    </Container>
  )
}

export default Footer
