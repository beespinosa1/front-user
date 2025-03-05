import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Paper, 
  IconButton, 
  InputAdornment,
  Alert,
  LinearProgress
} from '@mui/material';
import { Visibility, VisibilityOff, LockReset } from '@mui/icons-material';
import authService from '../services/authService';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Validar la fortaleza de la contraseña
  const validatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return `La contraseña debe tener al menos ${minLength} caracteres`;
    }
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return 'La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales';
    }
    
    return '';
  };
  
  // Calcular la fortaleza de la contraseña (0-100)
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    // Criterios de fortaleza
    const criterios = [
      password.length >= 8,                  // Mínimo 8 caracteres
      /[A-Z]/.test(password),                // Mayúsculas
      /[a-z]/.test(password),                // Minúsculas
      /\d/.test(password),                   // Números
      /[!@#$%^&*(),.?":{}|<>]/.test(password) // Caracteres especiales
    ];
    
    // Calcular fortaleza (0-100)
    const puntosPorCriterio = 100 / criterios.length;
    const fortaleza = criterios.filter(Boolean).length * puntosPorCriterio;
    
    return fortaleza;
  };
  
  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return 'error.main';
    if (strength < 70) return 'warning.main';
    return 'success.main';
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async () => {
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    // Validar fortaleza de la contraseña
    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    try {
      // Llamar al servicio de autenticación para cambiar la contraseña
      await authService.changePassword(newPassword);
      
      // Mostrar mensaje de éxito
      setSuccess(true);
      setError('');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al cambiar la contraseña');
    }
  };
  
  const passwordStrength = getPasswordStrength(newPassword);
  const strengthColor = getPasswordStrengthColor(passwordStrength);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
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
          }}
        >
          <LockReset color="primary" sx={{ fontSize: 40, mb: 2 }} />
          <Typography component="h1" variant="h5" gutterBottom>
            Cambiar Contraseña
          </Typography>
          
          {success ? (
            <Alert severity="success" sx={{ mt: 2, width: '100%' }}>
              ¡Contraseña cambiada con éxito! Redirigiendo...
            </Alert>
          ) : (
            <Box sx={{ width: '100%', mt: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="Nueva Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
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
              />
              
              {newPassword && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Fortaleza de la contraseña:
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    color={
                      passwordStrength < 40 ? 'error' :
                      passwordStrength < 70 ? 'warning' : 'success'
                    }
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
              )}
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleResetPassword}
                  sx={{ mb: 2 }}
                  disabled={!newPassword || !confirmPassword}
                >
                  Cambiar Contraseña
                </Button>
                
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword; 