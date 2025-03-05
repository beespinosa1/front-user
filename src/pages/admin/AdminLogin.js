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
  Divider,
  Alert
} from '@mui/material';
import { 
  AccountCircle, 
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

const AdminLogin = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  // Verificar si ya hay una sesión activa
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (adminToken && adminUser) {
      console.log('Ya hay una sesión administrativa activa, redirigiendo al dashboard administrativo');
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!employeeId.trim()) {
      setError('Por favor ingresa tu ID de empleado');
      return;
    }
    
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }
    
    // Aquí se haría la validación con la API
    // Por ahora simulamos una respuesta exitosa con un usuario de prueba
    if (employeeId === 'admin123' && password === 'admin123') {
      // Guardar información de sesión
      localStorage.setItem('adminToken', 'admin-token-test-1234');
      localStorage.setItem('adminUser', JSON.stringify({ 
        id: employeeId,
        nombre: 'Administrador',
        rol: 'ADMIN'
      }));
      
      // Redirigir al dashboard administrativo
      navigate('/admin/dashboard');
    } else {
      setError('ID de empleado o contraseña incorrectos');
      setShowAlert(true);
    }
  };

  const demoEmployee = 'admin123';
  const demoPassword = 'admin123';

  const setDemoCredentials = () => {
    setEmployeeId(demoEmployee);
    setPassword(demoPassword);
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
        backgroundImage: 'linear-gradient(to bottom, rgba(25,118,210,0.05) 0%, rgba(25,118,210,0) 100%)',
      }}
    >
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          py: 1.5, 
          boxShadow: 1,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminIcon sx={{ mr: 1.5, color: 'white' }} />
            <Typography variant="h5" color="white" fontWeight="bold">
              Banco BanQuito - Panel Administrativo
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container component="main" maxWidth="sm">
        {showAlert && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={() => setShowAlert(false)}
          >
            Credenciales inválidas. Por favor, verifica tu ID de empleado y contraseña.
          </Alert>
        )}
        
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
                  bgcolor: 'primary.dark', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mb: 2,
                  boxShadow: 2,
                }}
              >
                <AdminIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography component="h1" variant="h4" fontWeight="bold" color="primary.dark">
                Panel Administrativo
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                Acceso exclusivo para personal autorizado
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="employeeId"
                label="ID de Empleado"
                name="employeeId"
                autoComplete="username"
                autoFocus
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                error={!!error && !password}
                helperText={!!error && !password ? error : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Contraseña"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error && !!employeeId}
                helperText={!!error && !!employeeId ? error : ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SecurityIcon color="primary" />
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
                  bgcolor: 'primary.dark',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    opacity: 0.9
                  }
                }}
              >
                Iniciar Sesión
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Problemas para acceder?
                </Typography>
              </Divider>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link href="#" variant="body2" color="primary.dark" sx={{ fontWeight: 'medium' }}>
                  Contactar a Soporte Técnico
                </Link>
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Para acceso de demostración, use: <Link component="button" onClick={setDemoCredentials} sx={{ fontWeight: 'bold' }}>admin123 / admin123</Link>
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Banco BanQuito. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            <Link href="#" color="inherit">Manual de Uso</Link>
            {' | '}
            <Link href="#" color="inherit">Política de Seguridad</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminLogin; 