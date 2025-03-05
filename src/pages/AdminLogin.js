import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Link,
  InputAdornment,
  Divider
} from '@mui/material';
import { AccountCircle, AdminPanelSettings } from '@mui/icons-material';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Verificar si ya hay una sesión activa de administrador
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (adminToken && adminUser) {
      console.log('Ya hay una sesión activa de administrador, redirigiendo al dashboard administrativo');
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Por favor ingresa tu nombre de usuario');
      return;
    }
    
    // Aquí se haría la validación con la API para verificar que sea un usuario administrativo
    // Por ahora simulamos una respuesta exitosa
    console.log('Nombre de usuario administrativo enviado:', username);
    
    // Redirigir a la página de contraseña administrativa
    navigate('/admin/password', { state: { username } });
  };

  const demoAdmin = 'admin123';

  const setDemoUser = () => {
    setUsername(demoAdmin);
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
                Acceso exclusivo para personal del banco
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Usuario Administrativo"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!error}
                helperText={error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color="primary" />
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
                Continuar
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Problemas con el acceso?
                </Typography>
              </Divider>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link href="#" variant="body2" color="primary.main" sx={{ fontWeight: 'medium' }}>
                  Contactar a Soporte TI
                </Link>
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Para acceso de demostración, use el usuario: <Link component="button" onClick={setDemoUser} sx={{ fontWeight: 'bold' }}>{demoAdmin}</Link>
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

export default AdminLogin; 