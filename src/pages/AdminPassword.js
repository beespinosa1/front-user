import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Link,
  InputAdornment,
  IconButton,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, AdminPanelSettings, Lock } from '@mui/icons-material';

const AdminPassword = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  // Si no hay un nombre de usuario en el estado, redirigir al login
  useEffect(() => {
    if (!username) {
      navigate('/admin/login');
    }
  }, [username, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }
    
    // Aquí se haría la validación con la API para verificar las credenciales administrativas
    // Por ahora simulamos una respuesta exitosa
    console.log('Contraseña enviada para usuario administrativo:', username);
    
    // En un escenario real, aquí se enviarían las credenciales al backend
    // y se procesaría la respuesta
    
    // Simular autenticación exitosa
    localStorage.setItem('adminToken', 'admin-jwt-token-example');
    localStorage.setItem('adminUser', JSON.stringify({ username, role: 'admin' }));
    
    // Redirigir al dashboard administrativo
    navigate('/admin/dashboard');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Contraseña demo para facilitar pruebas
  const demoPassword = 'Admin123!';

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
            Banco BanQuito - Portal Administrativo
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
                mb: 4 
              }}
            >
              <Box 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  bgcolor: 'secondary.main', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 2,
                  boxShadow: 2,
                }}
              >
                <AdminPanelSettings sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography component="h1" variant="h4" fontWeight="bold" color="primary.main">
                Portal Administrativo
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                Hola, {username}
              </Typography>
            </Box>

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
                      <Lock color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
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
                  mb: 3,
                  py: 1.5,
                  fontWeight: 'bold',
                }}
              >
                Iniciar sesión
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Problemas con el acceso?
                </Typography>
              </Divider>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link href="/admin/reset-password" variant="body2" color="primary.main" sx={{ fontWeight: 'medium' }}>
                  Restablecer contraseña
                </Link>
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
            <Link href="#" color="inherit">Uso interno</Link>
            {' | '}
            <Link href="#" color="inherit">Política de Seguridad</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminPassword; 