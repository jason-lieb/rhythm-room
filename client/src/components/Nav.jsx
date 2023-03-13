import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

import { useLogin } from '../utils/LoginContext'

export default function ButtonAppBar() {
  const navigate = useNavigate()
  const { sessionId, logout, username } = useLogin()

  const handleLoginButtonClick = () => {
    navigate('/login')
  }

  const handleLogoutButtonClick = () => {
    logout()
  }

  const handleDiscover = () => {
    navigate('./')
  }

  const handleProfile = () => {
    navigate('./profile')
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rhythm-Room
          </Typography>
          <Button color="inherit" onClick={handleDiscover}>
            Discover
          </Button>
          {/* toggle login or logout */}
          {sessionId ? (
            <>
              <Button color="inherit" onClick={handleProfile}>
                {username}
              </Button>

              <Button color="inherit" onClick={handleLogoutButtonClick}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLoginButtonClick}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
}