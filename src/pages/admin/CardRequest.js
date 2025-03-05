import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Card,
  CardContent,
  Alert,
  InputAdornment,
  Snackbar,
  Autocomplete,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Check as CheckIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// Datos de ejemplo para tipos de tarjetas
const tiposTarjeta = [
  { id: 1, nombre: 'Clásica', descripcion: 'Tarjeta estándar con beneficios básicos', limiteMin: 5000, limiteMax: 50000 },
  { id: 2, nombre: 'Gold', descripcion: 'Tarjeta con beneficios premium y mayor límite', limiteMin: 50000, limiteMax: 150000 },
  { id: 3, nombre: 'Platinum', descripcion: 'Tarjeta exclusiva con grandes beneficios', limiteMin: 150000, limiteMax: 500000 },
  { id: 4, nombre: 'Black', descripcion: 'Tarjeta de lujo para clientes exclusivos', limiteMin: 500000, limiteMax: 2000000 },
];

const CardRequest = () => {
  // Estado para el stepper
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Buscar Cliente', 'Seleccionar Tipo de Tarjeta', 'Confirmar Solicitud'];
  
  // Estado para la búsqueda de cliente
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [clienteNuevo, setClienteNuevo] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    email: '',
    direccion: '',
    ingresos: '',
  });
  const [mostrarFormNuevoCliente, setMostrarFormNuevoCliente] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Estado para la selección de tipo de tarjeta
  const [tipoTarjetaSeleccionada, setTipoTarjetaSeleccionada] = useState(null);
  const [limiteCredito, setLimiteCredito] = useState('');
  
  // Estado para las alertas
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  
  // Simulación de carga de clientes (en producción esto sería una llamada a API)
  const clientesEjemplo = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', documento: '12345678', telefono: '555-123-4567', email: 'juan.perez@ejemplo.com', direccion: 'Calle Principal 123', ingresos: 85000 },
    { id: 2, nombre: 'María', apellido: 'González', documento: '87654321', telefono: '555-765-4321', email: 'maria.gonzalez@ejemplo.com', direccion: 'Avenida Central 456', ingresos: 92000 },
    { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', documento: '23456789', telefono: '555-234-5678', email: 'carlos.rodriguez@ejemplo.com', direccion: 'Plaza Mayor 789', ingresos: 78000 },
    { id: 4, nombre: 'Ana', apellido: 'Martínez', documento: '34567890', telefono: '555-345-6789', email: 'ana.martinez@ejemplo.com', direccion: 'Calle Secundaria 321', ingresos: 110000 },
    { id: 5, nombre: 'Roberto', apellido: 'López', documento: '45678901', telefono: '555-456-7890', email: 'roberto.lopez@ejemplo.com', direccion: 'Avenida Principal 654', ingresos: 150000 },
  ];
  
  // Cargar clientes al iniciar
  useEffect(() => {
    // Simular carga de clientes (reemplazar con llamada API real)
    setClientes(clientesEjemplo);
  }, []);
  
  // Búsqueda de clientes
  const buscarClientes = () => {
    setIsLoading(true);
    
    // Simular búsqueda (reemplazar con llamada API real)
    setTimeout(() => {
      const resultados = clientesEjemplo.filter(cliente => 
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.documento.includes(searchTerm)
      );
      
      setClientes(resultados);
      setIsLoading(false);
      
      if (resultados.length === 0 && searchTerm.trim() !== '') {
        setMostrarFormNuevoCliente(true);
        // Pre-llenar el documento si parece un número de documento
        if (/^\d+$/.test(searchTerm)) {
          setClienteNuevo({
            ...clienteNuevo,
            documento: searchTerm
          });
        }
      } else {
        setMostrarFormNuevoCliente(false);
      }
    }, 1000);
  };
  
  // Seleccionar un cliente existente
  const seleccionarCliente = (cliente) => {
    setSelectedCliente(cliente);
    setMostrarFormNuevoCliente(false);
  };
  
  // Manejar cambios en el formulario de nuevo cliente
  const handleClienteNuevoChange = (event) => {
    const { name, value } = event.target;
    setClienteNuevo({
      ...clienteNuevo,
      [name]: value
    });
    
    // Limpiar errores cuando el usuario escribe
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validar formulario de nuevo cliente
  const validarFormularioCliente = () => {
    const newErrors = {};
    
    if (!clienteNuevo.nombre) newErrors.nombre = 'El nombre es obligatorio';
    if (!clienteNuevo.apellido) newErrors.apellido = 'El apellido es obligatorio';
    if (!clienteNuevo.documento) newErrors.documento = 'El documento es obligatorio';
    if (!clienteNuevo.telefono) newErrors.telefono = 'El teléfono es obligatorio';
    if (!clienteNuevo.email) newErrors.email = 'El email es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(clienteNuevo.email)) newErrors.email = 'El email no es válido';
    if (!clienteNuevo.direccion) newErrors.direccion = 'La dirección es obligatoria';
    if (!clienteNuevo.ingresos) newErrors.ingresos = 'Los ingresos son obligatorios';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Crear nuevo cliente
  const crearNuevoCliente = () => {
    if (!validarFormularioCliente()) return;
    
    setIsLoading(true);
    
    // Simular creación de cliente (reemplazar con llamada API real)
    setTimeout(() => {
      const nuevoCliente = {
        ...clienteNuevo,
        id: Date.now() // Simular ID generado por el servidor
      };
      
      setSelectedCliente(nuevoCliente);
      setIsLoading(false);
      mostrarAlerta('Cliente creado correctamente', 'success');
    }, 1500);
  };
  
  // Manejar selección de tipo de tarjeta
  const seleccionarTipoTarjeta = (tipo) => {
    setTipoTarjetaSeleccionada(tipo);
    setLimiteCredito(tipo.limiteMin.toString());
  };
  
  // Manejar cambio de límite de crédito
  const handleLimiteCreditoChange = (event) => {
    const valor = event.target.value;
    
    if (!valor) {
      setLimiteCredito('');
      return;
    }
    
    const numero = parseInt(valor.replace(/,/g, ''), 10);
    
    if (isNaN(numero)) return;
    
    if (tipoTarjetaSeleccionada) {
      if (numero < tipoTarjetaSeleccionada.limiteMin) {
        setLimiteCredito(tipoTarjetaSeleccionada.limiteMin.toString());
      } else if (numero > tipoTarjetaSeleccionada.limiteMax) {
        setLimiteCredito(tipoTarjetaSeleccionada.limiteMax.toString());
      } else {
        setLimiteCredito(numero.toString());
      }
    } else {
      setLimiteCredito(numero.toString());
    }
  };
  
  // Manejar pasos del stepper
  const handleNext = () => {
    if (activeStep === 0) {
      // Validar que hay un cliente seleccionado o que se ha creado uno nuevo
      if (!selectedCliente && mostrarFormNuevoCliente) {
        crearNuevoCliente();
        return;
      } else if (!selectedCliente) {
        mostrarAlerta('Debe seleccionar un cliente', 'error');
        return;
      }
    } else if (activeStep === 1) {
      // Validar que se ha seleccionado un tipo de tarjeta y un límite válido
      if (!tipoTarjetaSeleccionada) {
        mostrarAlerta('Debe seleccionar un tipo de tarjeta', 'error');
        return;
      }
      
      if (!limiteCredito) {
        mostrarAlerta('Debe establecer un límite de crédito', 'error');
        return;
      }
      
      const limite = parseInt(limiteCredito, 10);
      if (isNaN(limite) || limite < tipoTarjetaSeleccionada.limiteMin || limite > tipoTarjetaSeleccionada.limiteMax) {
        mostrarAlerta(`El límite debe estar entre ${tipoTarjetaSeleccionada.limiteMin} y ${tipoTarjetaSeleccionada.limiteMax}`, 'error');
        return;
      }
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleReset = () => {
    // Reiniciar todo el proceso
    setActiveStep(0);
    setSearchTerm('');
    setSelectedCliente(null);
    setClienteNuevo({
      nombre: '',
      apellido: '',
      documento: '',
      telefono: '',
      email: '',
      direccion: '',
      ingresos: '',
    });
    setMostrarFormNuevoCliente(false);
    setTipoTarjetaSeleccionada(null);
    setLimiteCredito('');
  };
  
  // Confirmar solicitud
  const confirmarSolicitud = () => {
    setIsLoading(true);
    
    // Simular envío de solicitud (reemplazar con llamada API real)
    setTimeout(() => {
      // Aquí iría el código para enviar la solicitud al servidor
      setIsLoading(false);
      mostrarAlerta('Solicitud enviada correctamente', 'success');
      setActiveStep(3); // Paso final (completado)
    }, 2000);
  };
  
  const mostrarAlerta = (mensaje, severidad = 'info') => {
    setAlertMessage(mensaje);
    setAlertSeverity(severidad);
    setAlertOpen(true);
  };
  
  const handleCloseAlert = () => {
    setAlertOpen(false);
  };
  
  // Formatear número para mostrar con separadores de miles
  const formatearNumero = (numero) => {
    if (!numero) return '';
    return parseInt(numero).toLocaleString('es-ES');
  };
  
  // Contenido de cada paso
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Buscar Cliente
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Ingrese el nombre, apellido o documento del cliente para buscarlo en el sistema.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={9}>
                <TextField
                  fullWidth
                  label="Buscar cliente"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nombre, apellido o documento"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ height: '56px' }}
                  onClick={buscarClientes}
                  disabled={isLoading || !searchTerm.trim()}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Buscar'}
                </Button>
              </Grid>
            </Grid>
            
            {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}
            
            {/* Lista de clientes encontrados */}
            {!isLoading && !mostrarFormNuevoCliente && clientes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Resultados encontrados ({clientes.length})
                </Typography>
                <Grid container spacing={2}>
                  {clientes.map((cliente) => (
                    <Grid item xs={12} key={cliente.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          cursor: 'pointer',
                          bgcolor: selectedCliente?.id === cliente.id ? 'primary.light' : 'background.paper',
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                        onClick={() => seleccionarCliente(cliente)}
                      >
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item>
                              <PersonIcon fontSize="large" color={selectedCliente?.id === cliente.id ? 'primary' : 'action'} />
                            </Grid>
                            <Grid item xs>
                              <Typography variant="h6" component="div">
                                {cliente.nombre} {cliente.apellido}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Documento: {cliente.documento} | Teléfono: {cliente.telefono}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Email: {cliente.email}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {selectedCliente?.id === cliente.id && (
                                <Chip 
                                  icon={<CheckIcon />} 
                                  label="Seleccionado" 
                                  color="primary" 
                                />
                              )}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Mensaje de no resultados */}
            {!isLoading && !mostrarFormNuevoCliente && searchTerm && clientes.length === 0 && (
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                action={
                  <Button 
                    color="inherit" 
                    size="small"
                    onClick={() => setMostrarFormNuevoCliente(true)}
                  >
                    Crear Nuevo
                  </Button>
                }
              >
                No se encontraron clientes con los datos ingresados
              </Alert>
            )}
            
            {/* Formulario para nuevo cliente */}
            {mostrarFormNuevoCliente && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Registrar Nuevo Cliente
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      name="nombre"
                      value={clienteNuevo.nombre}
                      onChange={handleClienteNuevoChange}
                      required
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Apellido"
                      name="apellido"
                      value={clienteNuevo.apellido}
                      onChange={handleClienteNuevoChange}
                      required
                      error={!!errors.apellido}
                      helperText={errors.apellido}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Documento"
                      name="documento"
                      value={clienteNuevo.documento}
                      onChange={handleClienteNuevoChange}
                      required
                      error={!!errors.documento}
                      helperText={errors.documento}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="telefono"
                      value={clienteNuevo.telefono}
                      onChange={handleClienteNuevoChange}
                      required
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Email"
                      name="email"
                      value={clienteNuevo.email}
                      onChange={handleClienteNuevoChange}
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Dirección"
                      name="direccion"
                      value={clienteNuevo.direccion}
                      onChange={handleClienteNuevoChange}
                      required
                      error={!!errors.direccion}
                      helperText={errors.direccion}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Ingresos Mensuales"
                      name="ingresos"
                      value={clienteNuevo.ingresos}
                      onChange={handleClienteNuevoChange}
                      required
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={!!errors.ingresos}
                      helperText={errors.ingresos}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    color="inherit" 
                    onClick={() => setMostrarFormNuevoCliente(false)} 
                    sx={{ mr: 1 }}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={crearNuevoCliente}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Guardar Cliente'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Seleccionar Tipo de Tarjeta
            </Typography>
            
            {/* Información del cliente seleccionado */}
            {selectedCliente && (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Cliente Seleccionado
                  </Typography>
                  <Typography variant="h6">
                    {selectedCliente.nombre} {selectedCliente.apellido}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Documento: {selectedCliente.documento} | Ingresos: ${formatearNumero(selectedCliente.ingresos)}
                  </Typography>
                </CardContent>
              </Card>
            )}
            
            <Typography variant="subtitle1" gutterBottom>
              Seleccione el tipo de tarjeta a solicitar
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {tiposTarjeta.map((tipo) => (
                <Grid item xs={12} sm={6} key={tipo.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      cursor: 'pointer', 
                      bgcolor: tipoTarjetaSeleccionada?.id === tipo.id ? 'primary.light' : 'background.paper',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                    onClick={() => seleccionarTipoTarjeta(tipo)}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        Tarjeta {tipo.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {tipo.descripcion}
                      </Typography>
                      <Typography variant="body2">
                        Límite de crédito: ${formatearNumero(tipo.limiteMin)} - ${formatearNumero(tipo.limiteMax)}
                      </Typography>
                      {tipoTarjetaSeleccionada?.id === tipo.id && (
                        <Chip 
                          icon={<CheckIcon />} 
                          label="Seleccionada" 
                          color="primary" 
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {tipoTarjetaSeleccionada && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Establecer límite de crédito
                </Typography>
                <TextField
                  fullWidth
                  label="Límite de Crédito"
                  variant="outlined"
                  value={formatearNumero(limiteCredito)}
                  onChange={handleLimiteCreditoChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  helperText={`El límite debe estar entre $${formatearNumero(tipoTarjetaSeleccionada.limiteMin)} y $${formatearNumero(tipoTarjetaSeleccionada.limiteMax)}`}
                />
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Confirmar Solicitud de Tarjeta
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              Revise la información antes de confirmar la solicitud
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Información del Cliente
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Nombre:</strong> {selectedCliente?.nombre} {selectedCliente?.apellido}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Documento:</strong> {selectedCliente?.documento}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Teléfono:</strong> {selectedCliente?.telefono}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Email:</strong> {selectedCliente?.email}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Dirección:</strong> {selectedCliente?.direccion}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Ingresos Mensuales:</strong> ${formatearNumero(selectedCliente?.ingresos)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Detalles de la Tarjeta
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      <strong>Tipo de Tarjeta:</strong> {tipoTarjetaSeleccionada?.nombre}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Descripción:</strong> {tipoTarjetaSeleccionada?.descripcion}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Límite de Crédito:</strong> ${formatearNumero(limiteCredito)}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Fecha de Solicitud:</strong> {new Date().toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                Al confirmar, se enviará la solicitud para revisión y aprobación. El cliente será notificado una vez que se procese la solicitud.
              </Typography>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom color="primary">
              ¡Solicitud Enviada Correctamente!
            </Typography>
            <Box sx={{ my: 2 }}>
              <CheckIcon color="success" sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="body1" paragraph>
              La solicitud de tarjeta para <strong>{selectedCliente?.nombre} {selectedCliente?.apellido}</strong> ha sido enviada para su procesamiento.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Se notificará al cliente una vez que la solicitud sea aprobada y la tarjeta esté lista para ser entregada.
            </Typography>
            <Button
              variant="contained"
              onClick={handleReset}
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
            >
              Nueva Solicitud
            </Button>
          </Box>
        );
      default:
        return 'Paso Desconocido';
    }
  };
  
  // Botones de navegación para el stepper
  const getStepButtons = () => {
    if (activeStep === steps.length) {
      return null; // No mostrar botones en el último paso (completado)
    }
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Atrás
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={confirmarSolicitud}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Confirmar Solicitud'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Siguiente
            </Button>
          )}
        </Box>
      </Box>
    );
  };
  
  return (
    <Box>
      <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
        Solicitud de Nueva Tarjeta
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
        
        {getStepButtons()}
      </Paper>
      
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alertSeverity} 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CardRequest; 