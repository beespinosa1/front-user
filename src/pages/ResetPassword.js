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
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || '';

  const steps = ['Verificación', 'Nueva Contraseña', 'Confirmación'];

  const handleRequestCode = () => {
    // Aquí se enviaría la solicitud a la API para enviar un código de verificación
    console.log('Solicitando código para:', username);
    setActiveStep(1);
  };

  const handleVerifyCode = () => {
    if (!code.trim()) {
      setErrors({...errors, code: 'Por favor ingresa el código de verificación'});
      return;
    }
    
    // Aquí se validaría el código con la API
    console.log('Verificando código:', code);
    setActiveStep(2);
  };

  const handleResetPassword = () => {
    const newErrors = {
      newPassword: '',
      confirmPassword: ''
    };
    
    if (!newPassword.trim()) {
      newErrors.newPassword = 'Por favor ingresa tu nueva contraseña';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Por favor confirma tu nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (newErrors.newPassword || newErrors.confirmPassword) {
      setErrors({...errors, ...newErrors});
      return;
    }
    
    // Aquí se enviaría la nueva contraseña a la API
    console.log('Restableciendo contraseña para:', username);
    
    // Redirigir a la página de login después de restablecer la contraseña
    navigate('/login', { state: { message: 'Contraseña restablecida con éxito' } });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography>
              Se enviará un código de verificación a tu correo electrónico asociado.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              onClick={handleRequestCode}
              sx={{ mt: 3, mb: 2 }}
            >
              Solicitar Código
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="code"
              label="Código de Verificación"
              name="code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={!!errors.code}
              helperText={errors.code}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyCode}
              sx={{ mt: 3, mb: 2 }}
            >
              Verificar Código
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
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
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleResetPassword}
              sx={{ mt: 3, mb: 2 }}
            >
              Restablecer Contraseña
            </Button>
          </Box>
        );
      default:
        return 'Paso desconocido';
    }
  };

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
          <Typography component="h1" variant="h5">
            Restablecer Contraseña
          </Typography>
          {username && (
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Para el usuario: {username}
            </Typography>
          )}
          
          <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
          
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
            sx={{ mt: 1 }}
          >
            Volver a Iniciar Sesión
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword; 