import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
} from '@mui/material'
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from '@mui/icons-material'

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setMobileMenuAnchorEl(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="menu"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={handleMobileMenu}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Hotel Booking
          </Typography>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <Button color="inherit" component={RouterLink} to="/search">
              Search
            </Button>
            <IconButton color="inherit" onClick={handleMenu}>
              <AccountCircle />
            </IconButton>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={RouterLink} to="/account" onClick={handleClose}>
              My Account
            </MenuItem>
            <MenuItem component={RouterLink} to="/owner" onClick={handleClose}>
              Hotel Owner Panel
            </MenuItem>
            <MenuItem component={RouterLink} to="/admin" onClick={handleClose}>
              Admin Panel
            </MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>

          <Menu
            anchorEl={mobileMenuAnchorEl}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={RouterLink} to="/search" onClick={handleClose}>
              Search
            </MenuItem>
            <MenuItem component={RouterLink} to="/account" onClick={handleClose}>
              My Account
            </MenuItem>
            <MenuItem component={RouterLink} to="/owner" onClick={handleClose}>
              Hotel Owner Panel
            </MenuItem>
            <MenuItem component={RouterLink} to="/admin" onClick={handleClose}>
              Admin Panel
            </MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar 