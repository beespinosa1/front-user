import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  IconButton, 
  InputAdornment,
  Link,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Password = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const username = location.state?.username || '';

  // Si no hay username en el estado, redirigir al login
  React.useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [username, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }
    
    // Para demostración, verificar las credenciales localmente
    if (username === 'cliente123' && password === 'Seguro123') {
      // Simular login exitoso
      console.log('Credenciales correctas, autenticando...');
      
      // Almacenar en localStorage para simular autenticación
      localStorage.setItem('token', 'demo-token-123456');
      localStorage.setItem('user', JSON.stringify({
        name: 'Cliente Ejemplar',
        email: 'cliente123@email.com',
        username: 'cliente123'
      }));
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas. Intenta con cliente123/Seguro123');
      setSnackbarMessage('Credenciales incorrectas. Usa las credenciales de demostración.');
      setOpenSnackbar(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    navigate('/reset-password', { state: { username } });
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Para demostración
  const demoPassword = 'Seguro123';
  const setDemoPassword = () => {
    setPassword(demoPassword);
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        backgroundImage: 'linear-gradient(to bottom, rgba(0,51,102,0.05) 0%, rgba(0,51,102,0) 100%)',
      }}
    >
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          py: 1.5, 
          boxShadow: 1,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h5" color="white" fontWeight="bold">
            Banco BanQuito
          </Typography>
        </Container>
      </Box>

      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              borderRadius: 2,
              mb: 4,
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                mb: 3 
              }}
            >
              <Box 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 2,
                  boxShadow: 2,
                }}
              >
                <Typography variant="h3" color="white" fontWeight="bold">BQ</Typography>
              </Box>
              <Typography component="h1" variant="h4" fontWeight="bold" color="primary.main">
                Verificación
              </Typography>
            </Box>

            {username && (
              <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
                Ingresa tu contraseña para el usuario <strong>{username}</strong>
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ 
                  mt: 1, 
                  mb: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                Iniciar Sesión
              </Button>

              <Box sx={{ textAlign: 'center', mt: 1, mb: 3 }}>
                <Button
                  type="button"
                  variant="text"
                  onClick={handleForgotPassword}
                  sx={{ fontWeight: 'medium' }}
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </Box>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Seguridad
                </Typography>
              </Divider>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Por tu seguridad, nunca compartas tus credenciales con terceros.
                </Typography>
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Para acceso de demostración, use la contraseña: <Link component="button" onClick={setDemoPassword} sx={{ fontWeight: 'bold' }}>{demoPassword}</Link>
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Banco BanQuito. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            <Link href="#" color="inherit">Términos y Condiciones</Link>
            {' | '}
            <Link href="#" color="inherit">Política de Privacidad</Link>
          </Typography>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Password; 