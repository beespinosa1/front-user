import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Chip,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Card,
  CardContent,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  CreditCard as CreditCardIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Send as SendIcon,
  AttachMoney as AttachMoneyIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

// Datos de ejemplo para las solicitudes de tarjetas
const sampleRequests = [
  {
    id: 1,
    applicantName: 'María González',
    userId: 'CLI-045',
    requestDate: '2023-03-01 14:30:22',
    cardType: 'Visa Gold',
    status: 'Pendiente',
    assignedTo: null,
    creditLimit: 5000,
    reasonForRequest: 'Nueva',
    lastUpdate: '2023-03-01 14:30:22',
  },
  {
    id: 2,
    applicantName: 'Jorge Méndez',
    userId: 'CLI-052',
    requestDate: '2023-03-02 09:15:45',
    cardType: 'Mastercard Platinum',
    status: 'En análisis',
    assignedTo: 'Ana Herrera',
    creditLimit: 8000,
    reasonForRequest: 'Nueva',
    lastUpdate: '2023-03-02 15:30:10',
  },
  {
    id: 3,
    applicantName: 'Carolina Torres',
    userId: 'CLI-058',
    requestDate: '2023-03-02 16:45:33',
    cardType: 'Visa Classic',
    status: 'Aprobada',
    assignedTo: 'Luis Sánchez',
    creditLimit: 3000,
    reasonForRequest: 'Nueva',
    lastUpdate: '2023-03-03 11:20:15',
  },
  {
    id: 4,
    applicantName: 'Roberto Castro',
    userId: 'CLI-063',
    requestDate: '2023-03-03 10:22:18',
    cardType: 'American Express',
    status: 'Rechazada',
    assignedTo: 'Carlos Jiménez',
    creditLimit: 0,
    reasonForRequest: 'Nueva',
    reasonForRejection: 'Historial crediticio insuficiente',
    lastUpdate: '2023-03-04 09:45:20',
  },
  {
    id: 5,
    applicantName: 'Patricia Vega',
    userId: 'CLI-073',
    requestDate: '2023-03-04 14:15:30',
    cardType: 'Mastercard Gold',
    status: 'Pendiente',
    assignedTo: null,
    creditLimit: 7000,
    reasonForRequest: 'Nueva',
    lastUpdate: '2023-03-04 14:15:30',
  },
];

// Historial de tarjetas emitidas
const issuedCards = [
  {
    id: 1,
    cardNumber: '4532 **** **** 1245',
    cardHolder: 'Juan Pérez',
    userId: 'CLI-001',
    type: 'Visa Gold',
    issueDate: '2023-02-15',
    expiryDate: '12/2025',
    status: 'Activa',
    requestId: 246,
  },
  {
    id: 2,
    cardNumber: '5412 **** **** 7823',
    cardHolder: 'María Gómez',
    userId: 'CLI-002',
    type: 'Mastercard Platinum',
    issueDate: '2023-02-20',
    expiryDate: '05/2026',
    status: 'Activa',
    requestId: 247,
  },
  {
    id: 3,
    cardNumber: '3782 **** **** 4521',
    cardHolder: 'Carlos Rodríguez',
    userId: 'CLI-003',
    type: 'American Express',
    issueDate: '2023-02-22',
    expiryDate: '09/2024',
    status: 'Bloqueada',
    requestId: 248,
  },
  {
    id: 4,
    cardNumber: '5327 **** **** 9145',
    cardHolder: 'Roberto Díaz',
    userId: 'CLI-005',
    type: 'Mastercard Gold',
    issueDate: '2023-02-28',
    expiryDate: '07/2025',
    status: 'Activa',
    requestId: 250,
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`card-request-tabpanel-${index}`}
      aria-labelledby={`card-request-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CardRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState(sampleRequests);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [openNewRequestDialog, setOpenNewRequestDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedAction, setSelectedAction] = useState('');
  
  // Datos para nueva solicitud
  const [newRequest, setNewRequest] = useState({
    applicantName: '',
    userId: '',
    cardType: '',
    creditLimit: '',
    reasonForRequest: 'Nueva',
  });

  const steps = ['Información del cliente', 'Detalles de la tarjeta', 'Confirmación'];

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // En un escenario real, aquí se haría una petición a la API para obtener los resultados filtrados
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
    // Filtrar por estado
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    // Filtrar por tipo
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterType('');
    setRequests(sampleRequests);
  };

  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAction('');
  };

  const handleActionChange = (event) => {
    setSelectedAction(event.target.value);
  };

  const handleApproveRequest = () => {
    // Aquí se haría la llamada al backend para aprobar la solicitud
    console.log(`Aprobando solicitud: ${selectedRequest.id}`);
    
    // Simular actualización
    const updatedRequests = requests.map(req => 
      req.id === selectedRequest.id 
        ? { ...req, status: 'Aprobada', lastUpdate: new Date().toLocaleString(), assignedTo: 'Ana Herrera' }
        : req
    );
    
    setRequests(updatedRequests);
    setOpenDialog(false);
    
    // Mostrar alerta de éxito
    setAlertMessage(`La solicitud #${selectedRequest.id} ha sido aprobada exitosamente.`);
    setShowSuccessAlert(true);
    
    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  const handleRejectRequest = () => {
    // Aquí se haría la llamada al backend para rechazar la solicitud
    console.log(`Rechazando solicitud: ${selectedRequest.id}`);
    
    // Simular actualización
    const updatedRequests = requests.map(req => 
      req.id === selectedRequest.id 
        ? { 
            ...req, 
            status: 'Rechazada', 
            lastUpdate: new Date().toLocaleString(), 
            assignedTo: 'Ana Herrera',
            reasonForRejection: selectedAction
          }
        : req
    );
    
    setRequests(updatedRequests);
    setOpenDialog(false);
    
    // Mostrar alerta de éxito
    setAlertMessage(`La solicitud #${selectedRequest.id} ha sido rechazada.`);
    setShowSuccessAlert(true);
    
    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  const handleOpenNewRequestDialog = () => {
    setOpenNewRequestDialog(true);
  };

  const handleCloseNewRequestDialog = () => {
    setOpenNewRequestDialog(false);
    setActiveStep(0);
    setNewRequest({
      applicantName: '',
      userId: '',
      cardType: '',
      creditLimit: '',
      reasonForRequest: 'Nueva',
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreateRequest = () => {
    // Aquí se haría la llamada al backend para crear la solicitud
    console.log('Creando nueva solicitud:', newRequest);
    
    // Simular creación
    const newId = Math.max(...requests.map(r => r.id)) + 1;
    const newRequestData = {
      ...newRequest,
      id: newId,
      requestDate: new Date().toLocaleString(),
      status: 'Pendiente',
      assignedTo: null,
      lastUpdate: new Date().toLocaleString(),
    };
    
    setRequests([...requests, newRequestData]);
    handleCloseNewRequestDialog();
    
    // Mostrar alerta de éxito
    setAlertMessage(`La solicitud #${newId} ha sido creada exitosamente.`);
    setShowSuccessAlert(true);
    
    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  const handleNewRequestChange = (field) => (event) => {
    setNewRequest({
      ...newRequest,
      [field]: event.target.value,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobada':
        return 'success';
      case 'Rechazada':
        return 'error';
      case 'En análisis':
        return 'info';
      case 'Pendiente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprobada':
        return <CheckCircleIcon fontSize="small" />;
      case 'Rechazada':
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Calcular métricas para las tarjetas de resumen
  const pendingRequests = requests.filter(r => r.status === 'Pendiente').length;
  const inProgressRequests = requests.filter(r => r.status === 'En análisis').length;
  const approvedRequests = requests.filter(r => r.status === 'Aprobada').length;
  const rejectedRequests = requests.filter(r => r.status === 'Rechazada').length;

  return (
    <Box>
      {/* Alertas */}
      {showSuccessAlert && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setShowSuccessAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Nuevas solicitudes
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {pendingRequests}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Pendientes de revisión
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                En análisis
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                {inProgressRequests}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                En proceso de verificación
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Aprobadas
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {approvedRequests}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Listas para emisión
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Rechazadas
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {rejectedRequests}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                No cumplen requisitos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botón de nueva solicitud y filtros */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleChangeTab} aria-label="Pestañas de solicitudes">
          <Tab label="Solicitudes" />
          <Tab label="Tarjetas Emitidas" />
        </Tabs>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenNewRequestDialog}
        >
          Nueva Solicitud
        </Button>
      </Box>

      {/* Contenido de pestañas */}
      <TabPanel value={activeTab} index={0}>
        {/* Filtros */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Buscar y Filtrar Solicitudes
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Buscar solicitud"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Nombre, ID de cliente o tipo de tarjeta"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                  label="Estado"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                  <MenuItem value="En análisis">En análisis</MenuItem>
                  <MenuItem value="Aprobada">Aprobada</MenuItem>
                  <MenuItem value="Rechazada">Rechazada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo de Tarjeta</InputLabel>
                <Select
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  label="Tipo de Tarjeta"
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Visa Gold">Visa Gold</MenuItem>
                  <MenuItem value="Visa Classic">Visa Classic</MenuItem>
                  <MenuItem value="Mastercard Gold">Mastercard Gold</MenuItem>
                  <MenuItem value="Mastercard Platinum">Mastercard Platinum</MenuItem>
                  <MenuItem value="American Express">American Express</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={1}>
              <Button 
                variant="outlined"
                fullWidth
                onClick={handleResetFilters}
                title="Limpiar filtros"
                sx={{ height: '56px' }}
              >
                <FilterListIcon />
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de solicitudes */}
        <TableContainer component={Paper}>
          <Table aria-label="tabla de solicitudes de tarjetas">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Solicitante</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo de Tarjeta</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Límite</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Asignado a</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.applicantName}</TableCell>
                  <TableCell>{request.userId}</TableCell>
                  <TableCell>{request.requestDate}</TableCell>
                  <TableCell>{request.cardType}</TableCell>
                  <TableCell>
                    {request.creditLimit > 0 ? `$${request.creditLimit.toLocaleString()}` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(request.status)}
                      label={request.status} 
                      color={getStatusColor(request.status)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{request.assignedTo || 'Sin asignar'}</TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleSelectRequest(request)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Asignarme">
                        <span>
                          <IconButton 
                            size="small" 
                            color="info"
                            disabled={request.assignedTo || request.status === 'Aprobada' || request.status === 'Rechazada'}
                          >
                            <PersonIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {/* Tabla de tarjetas emitidas */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Buscar Tarjetas Emitidas
          </Typography>
          <TextField
            fullWidth
            label="Buscar tarjetas emitidas"
            variant="outlined"
            placeholder="Número de tarjeta, nombre del titular o ID de cliente"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <TableContainer component={Paper}>
          <Table aria-label="tabla de tarjetas emitidas">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Número de Tarjeta</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titular</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha de Emisión</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha de Expiración</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issuedCards.map((card) => (
                <TableRow key={card.id} hover>
                  <TableCell>{card.cardNumber}</TableCell>
                  <TableCell>{card.cardHolder}</TableCell>
                  <TableCell>{card.userId}</TableCell>
                  <TableCell>{card.type}</TableCell>
                  <TableCell>{card.issueDate}</TableCell>
                  <TableCell>{card.expiryDate}</TableCell>
                  <TableCell>
                    <Chip 
                      label={card.status} 
                      color={card.status === 'Activa' ? 'success' : 'error'} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver historial">
                        <IconButton size="small" color="info">
                          <CreditCardIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Diálogo de detalles de solicitud */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles de Solicitud #{selectedRequest?.id}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Solicitante:</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedRequest.applicantName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">ID Cliente:</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedRequest.userId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Fecha de solicitud:</Typography>
                  <Typography variant="body1">{selectedRequest.requestDate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Última actualización:</Typography>
                  <Typography variant="body1">{selectedRequest.lastUpdate}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Tipo de tarjeta:</Typography>
                  <Typography variant="body1">{selectedRequest.cardType}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Límite de crédito:</Typography>
                  <Typography variant="body1">${selectedRequest.creditLimit.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Estado:</Typography>
                  <Chip 
                    label={selectedRequest.status} 
                    color={getStatusColor(selectedRequest.status)} 
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Asignado a:</Typography>
                  <Typography variant="body1">{selectedRequest.assignedTo || 'Sin asignar'}</Typography>
                </Grid>
                {selectedRequest.reasonForRejection && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Motivo de rechazo:</Typography>
                    <Typography variant="body1" color="error.main">{selectedRequest.reasonForRejection}</Typography>
                  </Grid>
                )}
              </Grid>

              <Divider sx={{ mb: 3 }} />

              {/* Campos para tomar acción */}
              {(selectedRequest.status === 'Pendiente' || selectedRequest.status === 'En análisis') && (
                <Box>
                  <Typography variant="h6" gutterBottom>Procesar Solicitud</Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Acción</InputLabel>
                    <Select
                      value={selectedAction}
                      onChange={handleActionChange}
                      label="Acción"
                      required
                    >
                      <MenuItem value="">Seleccione una acción</MenuItem>
                      <MenuItem value="Aprobar">Aprobar solicitud</MenuItem>
                      <MenuItem value="Historial crediticio insuficiente">Rechazar: Historial crediticio insuficiente</MenuItem>
                      <MenuItem value="Ingresos insuficientes">Rechazar: Ingresos insuficientes</MenuItem>
                      <MenuItem value="Documentación incompleta">Rechazar: Documentación incompleta</MenuItem>
                      <MenuItem value="Historial negativo">Rechazar: Historial negativo</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cerrar
          </Button>
          {selectedRequest && (selectedRequest.status === 'Pendiente' || selectedRequest.status === 'En análisis') && (
            <>
              {selectedAction === 'Aprobar' ? (
                <Button 
                  onClick={handleApproveRequest} 
                  variant="contained" 
                  color="success"
                  disabled={!selectedAction}
                >
                  Aprobar Solicitud
                </Button>
              ) : (
                <Button 
                  onClick={handleRejectRequest} 
                  variant="contained" 
                  color="error"
                  disabled={!selectedAction || selectedAction === ''}
                >
                  Rechazar Solicitud
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Diálogo de nueva solicitud */}
      <Dialog
        open={openNewRequestDialog}
        onClose={handleCloseNewRequestDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nueva Solicitud de Tarjeta</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mt: 1, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Información del Cliente</Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nombre completo del solicitante"
                  fullWidth
                  value={newRequest.applicantName}
                  onChange={handleNewRequestChange('applicantName')}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ID del cliente"
                  fullWidth
                  value={newRequest.userId}
                  onChange={handleNewRequestChange('userId')}
                  required
                  placeholder="Ejemplo: CLI-001"
                />
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Detalles de la Tarjeta</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Tarjeta</InputLabel>
                  <Select
                    value={newRequest.cardType}
                    onChange={handleNewRequestChange('cardType')}
                    label="Tipo de Tarjeta"
                  >
                    <MenuItem value="">Seleccione un tipo</MenuItem>
                    <MenuItem value="Visa Gold">Visa Gold</MenuItem>
                    <MenuItem value="Visa Classic">Visa Classic</MenuItem>
                    <MenuItem value="Mastercard Gold">Mastercard Gold</MenuItem>
                    <MenuItem value="Mastercard Platinum">Mastercard Platinum</MenuItem>
                    <MenuItem value="American Express">American Express</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Límite de crédito"
                  fullWidth
                  value={newRequest.creditLimit}
                  onChange={handleNewRequestChange('creditLimit')}
                  required
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Motivo de la solicitud</InputLabel>
                  <Select
                    value={newRequest.reasonForRequest}
                    onChange={handleNewRequestChange('reasonForRequest')}
                    label="Motivo de la solicitud"
                  >
                    <MenuItem value="Nueva">Tarjeta nueva</MenuItem>
                    <MenuItem value="Reemplazo">Reemplazo por pérdida</MenuItem>
                    <MenuItem value="Renovación">Renovación</MenuItem>
                    <MenuItem value="Aumento límite">Aumento de límite</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Resumen de la Solicitud</Typography>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Solicitante:</Typography>
                      <Typography variant="body1" fontWeight="bold">{newRequest.applicantName}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">ID Cliente:</Typography>
                      <Typography variant="body1" fontWeight="bold">{newRequest.userId}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Tipo de tarjeta:</Typography>
                      <Typography variant="body1">{newRequest.cardType}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Límite de crédito:</Typography>
                      <Typography variant="body1">${parseInt(newRequest.creditLimit).toLocaleString()}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Motivo de la solicitud:</Typography>
                      <Typography variant="body1">{newRequest.reasonForRequest}</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  La solicitud será creada con estado <strong>Pendiente</strong> y deberá ser procesada por un agente.
                </Alert>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewRequestDialog} color="inherit">
            Cancelar
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} color="inherit">
              Atrás
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              variant="contained"
              disabled={
                (activeStep === 0 && (!newRequest.applicantName || !newRequest.userId)) ||
                (activeStep === 1 && (!newRequest.cardType || !newRequest.creditLimit))
              }
            >
              Siguiente
            </Button>
          ) : (
            <Button 
              onClick={handleCreateRequest} 
              variant="contained" 
              color="primary"
            >
              Crear Solicitud
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CardRequests; 