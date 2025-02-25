import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  Tooltip
} from '@mui/material'
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Save as SaveIcon,
  Stars as StarsIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material'
import axios from 'axios'
import { toast } from 'react-toastify'

interface UserData {
  fullName: string
  email: string
  phoneNumber: string
  loyaltyPoints: number
  level: number
  nextLevelPoints: number
}

interface PasswordData {
  newPassword: string
  confirmPassword: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const getLevelInfo = (level: number) => {
  const levels = {
    1: { title: 'Bronz Üye', color: '#CD7F32', requiredPoints: 100 },
    2: { title: 'Gümüş Üye', color: '#C0C0C0', requiredPoints: 300 },
    3: { title: 'Altın Üye', color: '#FFD700', requiredPoints: 600 },
    4: { title: 'Platin Üye', color: '#E5E4E2', requiredPoints: 1000 },
    5: { title: 'Elmas Üye', color: '#B9F2FF', requiredPoints: 2000 }
  }
  return levels[level as keyof typeof levels] || levels[1]
}

const Profile: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'personal' | 'password'>('personal')
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    loyaltyPoints: 0,
    level: 1,
    nextLevelPoints: 100
  })
  const [passwordData, setPasswordData] = useState<PasswordData>({
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      toast.error('Lütfen önce giriş yapın')
      navigate('/login')
      return
    }
    fetchUserData()
  }, [navigate])

  const fetchUserData = async () => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    if (!token || !userId) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.')
      navigate('/login')
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.get(`${API_BASE_URL}/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUserData(response.data)
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.')
        navigate('/login')
      } else {
        toast.error('Kullanıcı bilgileri alınamadı.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    if (!token || !userId) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.')
      navigate('/login')
      return
    }

    try {
      setIsLoading(true)
      await axios.put(`${API_BASE_URL}/User/${userId}`, {
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      toast.success('Profil bilgileriniz başarıyla güncellendi!')
      await fetchUserData()
    } catch (error: any) {
      console.error('Profil güncellenirken hata:', error)
      toast.error(error.response?.data?.message || 'Profil güncellenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor!')
      return
    }

    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    
    if (!token || !userId) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.')
      navigate('/login')
      return
    }

    try {
      setIsLoading(true)
      await axios.put(`${API_BASE_URL}/User/${userId}/change-password`, {
        newPassword: passwordData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      toast.success('Şifreniz başarıyla güncellendi!')
      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      console.error('Şifre güncellenirken hata:', error)
      toast.error(error.response?.data?.message || 'Şifre güncellenirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Sol Menü */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: getLevelInfo(userData.level).color,
                  mb: 2
                }}
              >
                {userData.fullName?.[0]}
              </Avatar>
              <Typography variant="h6" align="center" gutterBottom>
                {userData.fullName}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                {getLevelInfo(userData.level).title}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem
                button
                selected={activeSection === 'personal'}
                onClick={() => setActiveSection('personal')}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Kişisel Bilgiler" />
              </ListItem>
              <ListItem
                button
                selected={activeSection === 'password'}
                onClick={() => setActiveSection('password')}
              >
                <ListItemIcon>
                  <LockIcon />
                </ListItemIcon>
                <ListItemText primary="Şifre Değiştir" />
              </ListItem>
            </List>
          </Paper>

          {/* Sadakat Kartı */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <StarsIcon sx={{ color: getLevelInfo(userData.level).color, mr: 1 }} />
                <Typography variant="h6">
                  Sadakat Puanı: {userData.loyaltyPoints}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Sonraki seviye için ilerleme
                </Typography>
                <Tooltip title={`${Math.round((userData.loyaltyPoints / getLevelInfo(userData.level).requiredPoints) * 100)}%`}>
                  <LinearProgress
                    variant="determinate"
                    value={(userData.loyaltyPoints / getLevelInfo(userData.level).requiredPoints) * 100}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getLevelInfo(userData.level).color
                      }
                    }}
                  />
                </Tooltip>
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Sonraki seviye için gereken: {getLevelInfo(userData.level).requiredPoints - userData.loyaltyPoints} puan
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <EmojiEventsIcon sx={{ color: getLevelInfo(userData.level).color, mr: 1 }} />
                <Typography variant="body1">
                  Seviye {userData.level}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sağ İçerik */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {activeSection === 'personal' ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Kişisel Bilgiler
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <form onSubmit={handleUpdateProfile}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Ad Soyad"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleUserDataChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="E-posta"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleUserDataChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Telefon Numarası"
                        name="phoneNumber"
                        value={userData.phoneNumber}
                        onChange={handleUserDataChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Şifre Değiştir
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <form onSubmit={handleUpdatePassword}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Yeni Şifre"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Yeni Şifre (Tekrar)"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<LockIcon />}
                        disabled={isLoading}
                      >
                        {isLoading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile 