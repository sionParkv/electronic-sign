import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Button, Toolbar, Typography as T } from '@mui/material'
import Image from 'next/image'
import React from 'react'

import IMGS from '../assets/images'

const Header = (props: { userInfo: string }) => {
  const { userInfo } = props

  return (
    <AppBar className="Header">
      <Toolbar>
        <Button className="Logo">
          <Image src={IMGS.Logo} alt="Logo" />
        </Button>
        <T>{userInfo} 님</T>
        <Button className="Logout">로그아웃</Button>
        <Button className="Menu">
          <MenuIcon />
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Header
