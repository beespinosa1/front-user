import React, { useState, useEffect } from 'react';
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
  LinearProgress,
  Alert,
  Divider,
  FormControlLabel,
  Switch,
  FormHelperText,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  SecurityUpdateGood as SecurityUpdateGoodIcon,
  SecurityUpdateWarning as SecurityUpdateWarningIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

// Importar el servicio
import adminCuentaTarjetaService from '../../services/AdminCuentaTarjetaService';
import adminTarjetaService from '../../services/AdminTarjetaService';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [confirmActionDialogOpen, setConfirmActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [accountCards, setAccountCards] = useState([]);
  
  // Estado para nueva cuenta
  const [newAccount, setNewAccount] = useState({
    numeroCliente: '',
    tipoTarjeta: '',
    limiteCredito: 1000,
    diaCorte: 1,
    diaPago: 15,
    estado: 'ACTIVA'
  });

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({});

  // Cargar las cuentas al iniciar
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Cargar cuentas
  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await adminCuentaTarjetaService.listarTodos();
      setAccounts(data);
      showAlert('Cuentas cargadas correctamente', 'success');
    } catch (error) {
      console.error('Error al cargar cuentas:', error);
      showAlert('Error al cargar las cuentas. Por favor, intente nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar tarjetas asociadas a una cuenta
  const fetchAccountCards = async (accountId) => {
    setIsLoading(true);
    try {
      const data = await adminTarjetaService.listarTarjetasPorCuenta(accountId);
      setAccountCards(data);
    } catch (error) {
      console.error('Error al cargar tarjetas de la cuenta:', error);
      showAlert('Error al cargar las tarjetas asociadas a esta cuenta.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar alerta
  const showAlert = (message, severity = 'info') => {
    setAlert({
      open: true,
      message,
      severity
    });
    
    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
      setAlert(prev => ({ ...prev, open: false }));
    }, 5000);
  };

  // Manejar búsqueda
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Cambio de filtro de estado
  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  // Cambio de filtro de tipo
  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  // Limpiar filtros
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterType('');
  };

  // Ver detalles de cuenta
  const handleViewDetails = async (account) => {
    setSelectedAccount(account);
    // Cargar tarjetas asociadas a esta cuenta
    await fetchAccountCards(account.id);
    setDetailsDialogOpen(true);
  };

  // Cerrar diálogo de detalles
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedAccount(null);
    setAccountCards([]);
  };

  // Abrir diálogo de creación
  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(true);
    setFormErrors({});
    setNewAccount({
      numeroCliente: '',
      tipoTarjeta: '',
      limiteCredito: 1000,
      diaCorte: 1,
      diaPago: 15,
      estado: 'ACTIVA'
    });
  };

  // Cerrar diálogo de creación
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  // Cambios en el formulario de creación
  const handleCreateFormChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : (field === 'limiteCredito' || field === 'diaCorte' || field === 'diaPago') 
        ? Number(event.target.value) 
        : event.target.value;
    
    setNewAccount(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar errores cuando el usuario corrige
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!newAccount.numeroCliente) {
      errors.numeroCliente = 'El número de cliente es obligatorio';
    }
    
    if (!newAccount.tipoTarjeta) {
      errors.tipoTarjeta = 'El tipo de tarjeta es obligatorio';
    }
    
    if (newAccount.limiteCredito <= 0) {
      errors.limiteCredito = 'El límite de crédito debe ser mayor a 0';
    }
    
    if (newAccount.diaCorte < 1 || newAccount.diaCorte > 31) {
      errors.diaCorte = 'El día de corte debe estar entre 1 y 31';
    }
    
    if (newAccount.diaPago < 1 || newAccount.diaPago > 31) {
      errors.diaPago = 'El día de pago debe estar entre 1 y 31';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Crear nueva cuenta
  const handleCreateAccount = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const createdAccount = await adminCuentaTarjetaService.crearCuentaTarjeta(newAccount);
      showAlert('Cuenta de tarjeta creada exitosamente.', 'success');
      
      // Actualizar la lista de cuentas
      await fetchAccounts();
      
      // Cerrar el diálogo
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Error al crear cuenta de tarjeta:', error);
      showAlert('Error al crear la cuenta de tarjeta. Por favor, intente nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Preparar acción de activar/inactivar
  const handlePrepareAction = (account, action) => {
    setSelectedAccount(account);
    setActionType(action);
    setConfirmActionDialogOpen(true);
  };

  // Cerrar diálogo de confirmación
  const handleCloseConfirmActionDialog = () => {
    setConfirmActionDialogOpen(false);
    setSelectedAccount(null);
    setActionType('');
  };

  // Ejecutar acción de activar/inactivar
  const handleConfirmAction = async () => {
    if (!selectedAccount || !actionType) return;
    
    setIsLoading(true);
    try {
      if (actionType === 'activar') {
        await adminCuentaTarjetaService.activarCuenta(selectedAccount.id);
        showAlert('Cuenta activada exitosamente.', 'success');
      } else if (actionType === 'inactivar') {
        await adminCuentaTarjetaService.inactivarCuenta(selectedAccount.id);
        showAlert('Cuenta inactivada exitosamente.', 'success');
      }
      
      // Actualizar la lista de cuentas
      await fetchAccounts();
      
      // Cerrar el diálogo
      setConfirmActionDialogOpen(false);
      setSelectedAccount(null);
      setActionType('');
    } catch (error) {
      console.error(`Error al ${actionType} cuenta:`, error);
      showAlert(`Error al ${actionType} la cuenta. Por favor, intente nuevamente.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Emitir tarjeta para la cuenta
  const handleIssueCard = async (accountId) => {
    setIsLoading(true);
    try {
      await adminTarjetaService.emitirTarjeta(accountId);
      showAlert('Tarjeta emitida exitosamente.', 'success');
      
      // Si estamos en diálogo de detalles, actualizar las tarjetas
      if (selectedAccount && selectedAccount.id === accountId) {
        await fetchAccountCards(accountId);
      }
    } catch (error) {
      console.error('Error al emitir tarjeta:', error);
      showAlert('Error al emitir la tarjeta. Por favor, intente nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVA':
        return 'success';
      case 'INACTIVA':
        return 'error';
      case 'PENDIENTE':
        return 'warning';
      case 'BLOQUEADA':
        return 'error';
      default:
        return 'default';
    }
  };

  // Obtener ícono según estado
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVA':
        return <CheckCircleIcon fontSize="small" />;
      case 'INACTIVA':
        return <CancelIcon fontSize="small" />;
      case 'PENDIENTE':
        return <InfoIcon fontSize="small" />;
      case 'BLOQUEADA':
        return <SecurityUpdateWarningIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Filtrar cuentas según búsqueda y filtros
  const filteredAccounts = accounts.filter(account => {
    // Filtrar por término de búsqueda
    const matchesSearch = 
      !searchTerm || 
      account.id?.toString().includes(searchTerm) ||
      account.numeroCliente?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.tipoTarjeta?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por estado
    const matchesStatus = !filterStatus || account.estado === filterStatus;
    
    // Filtrar por tipo de tarjeta
    const matchesType = !filterType || account.tipoTarjeta === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Obtener opciones únicas para filtros
  const statusOptions = [...new Set(accounts.map(account => account.estado))];
  const typeOptions = [...new Set(accounts.map(account => account.tipoTarjeta))];

  return (
    <Box>
      {/* Alertas */}
      {alert.open && (
        <Alert severity={alert.severity} sx={{ mb: 3 }} onClose={() => setAlert(prev => ({ ...prev, open: false }))}>
          {alert.message}
        </Alert>
      )}
      
      {/* Indicador de carga */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Encabezado y botón de nueva cuenta */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gestión de Cuentas de Tarjetas
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Nueva Cuenta
        </Button>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total de Cuentas
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {accounts.length}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Cuentas registradas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Cuentas Activas
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {accounts.filter(a => a.estado === 'ACTIVA').length}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Cuentas en funcionamiento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Cuentas Inactivas
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {accounts.filter(a => a.estado === 'INACTIVA').length}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Cuentas sin funcionamiento
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Promedio Límite
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                ${accounts.length > 0 
                  ? (accounts.reduce((sum, a) => sum + a.limiteCredito, 0) / accounts.length).toFixed(2) 
                  : '0.00'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Límite promedio de crédito
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filtros de búsqueda */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Buscar y Filtrar Cuentas
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar cuenta"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="ID, cliente o tipo de tarjeta"
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
                {statusOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
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
                {typeOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined"
                fullWidth
                onClick={handleResetFilters}
                title="Limpiar filtros"
              >
                <FilterListIcon />
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={fetchAccounts}
                title="Actualizar"
              >
                <RefreshIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabla de cuentas */}
      <TableContainer component={Paper}>
        <Table aria-label="tabla de cuentas de tarjetas">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo de Tarjeta</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Límite de Crédito</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Día Corte</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Día Pago</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>{account.id}</TableCell>
                  <TableCell>{account.numeroCliente}</TableCell>
                  <TableCell>{account.tipoTarjeta}</TableCell>
                  <TableCell>${account.limiteCredito?.toLocaleString()}</TableCell>
                  <TableCell>{account.diaCorte}</TableCell>
                  <TableCell>{account.diaPago}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(account.estado)}
                      label={account.estado} 
                      color={getStatusColor(account.estado)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewDetails(account)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {account.estado === 'ACTIVA' ? (
                        <Tooltip title="Inactivar cuenta">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handlePrepareAction(account, 'inactivar')}
                          >
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Activar cuenta">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handlePrepareAction(account, 'activar')}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Emitir tarjeta">
                        <IconButton 
                          size="small" 
                          color="info"
                          onClick={() => handleIssueCard(account.id)}
                        >
                          <CreditCardIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No hay cuentas que coincidan con los criterios de búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Diálogo de detalles de cuenta */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalanceIcon sx={{ mr: 1 }} color="primary" />
          Detalles de Cuenta #{selectedAccount?.id}
        </DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Box>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Información de la Cuenta
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">ID de Cuenta:</Typography>
                    <Typography variant="body1" fontWeight="medium">{selectedAccount.id}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Número de Cliente:</Typography>
                    <Typography variant="body1">{selectedAccount.numeroCliente}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Tipo de Tarjeta:</Typography>
                    <Typography variant="body1">{selectedAccount.tipoTarjeta}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Límite de Crédito:</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${selectedAccount.limiteCredito?.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Día de Corte:</Typography>
                    <Typography variant="body1">{selectedAccount.diaCorte}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Día de Pago:</Typography>
                    <Typography variant="body1">{selectedAccount.diaPago}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Estado:</Typography>
                    <Chip 
                      icon={getStatusIcon(selectedAccount.estado)}
                      label={selectedAccount.estado} 
                      color={getStatusColor(selectedAccount.estado)} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Fecha de Creación:</Typography>
                    <Typography variant="body1">{selectedAccount.fechaCreacion}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Tarjetas Asociadas
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<CreditCardIcon />}
                    onClick={() => handleIssueCard(selectedAccount.id)}
                  >
                    Emitir Nueva Tarjeta
                  </Button>
                </Box>
                
                {accountCards.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Número de Tarjeta</TableCell>
                          <TableCell>Titular</TableCell>
                          <TableCell>Fecha Emisión</TableCell>
                          <TableCell>Fecha Expiración</TableCell>
                          <TableCell>Estado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {accountCards.map((card) => (
                          <TableRow key={card.id}>
                            <TableCell>{card.numeroTarjeta}</TableCell>
                            <TableCell>{card.titular}</TableCell>
                            <TableCell>{card.fechaEmision}</TableCell>
                            <TableCell>{card.fechaExpiracion}</TableCell>
                            <TableCell>
                              <Chip 
                                label={card.estado} 
                                color={getStatusColor(card.estado)} 
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No hay tarjetas asociadas a esta cuenta
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog} color="inherit">
            Cerrar
          </Button>
          {selectedAccount && (
            <>
              {selectedAccount.estado === 'ACTIVA' ? (
                <Button 
                  onClick={() => handlePrepareAction(selectedAccount, 'inactivar')} 
                  variant="contained" 
                  color="error"
                >
                  Inactivar Cuenta
                </Button>
              ) : (
                <Button 
                  onClick={() => handlePrepareAction(selectedAccount, 'activar')} 
                  variant="contained" 
                  color="success"
                >
                  Activar Cuenta
                </Button>
              )}
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de confirmación de acción */}
      <Dialog
        open={confirmActionDialogOpen}
        onClose={handleCloseConfirmActionDialog}
      >
        <DialogTitle>
          {actionType === 'activar' ? 'Confirmar Activación' : 'Confirmar Inactivación'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === 'activar' 
              ? `¿Está seguro que desea activar la cuenta #${selectedAccount?.id}?`
              : `¿Está seguro que desea inactivar la cuenta #${selectedAccount?.id}?`
            }
          </DialogContentText>
          {selectedAccount && (
            <Box sx={{ mt: 2, p: 2, bgcolor: actionType === 'activar' ? 'success.light' : 'error.light', borderRadius: 1 }}>
              <Typography variant="body2" color={actionType === 'activar' ? 'success.dark' : 'error.dark'}>
                {actionType === 'activar' 
                  ? 'Esta acción habilitará la cuenta y todas sus funcionalidades.'
                  : 'Esta acción deshabilitará la cuenta y todas sus tarjetas asociadas.'
                }
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmActionDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained" 
            color={actionType === 'activar' ? 'success' : 'error'}
          >
            {actionType === 'activar' ? 'Activar' : 'Inactivar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de creación de cuenta */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <AddIcon sx={{ mr: 1 }} color="primary" />
          Crear Nueva Cuenta de Tarjeta
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Complete los siguientes datos para crear una nueva cuenta de tarjeta de crédito:
          </DialogContentText>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Número de Cliente"
                value={newAccount.numeroCliente}
                onChange={handleCreateFormChange('numeroCliente')}
                error={!!formErrors.numeroCliente}
                helperText={formErrors.numeroCliente}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!formErrors.tipoTarjeta}>
                <InputLabel>Tipo de Tarjeta</InputLabel>
                <Select
                  value={newAccount.tipoTarjeta}
                  onChange={handleCreateFormChange('tipoTarjeta')}
                  label="Tipo de Tarjeta"
                >
                  <MenuItem value="">Seleccione un tipo</MenuItem>
                  <MenuItem value="VISA_GOLD">Visa Gold</MenuItem>
                  <MenuItem value="VISA_PLATINUM">Visa Platinum</MenuItem>
                  <MenuItem value="MASTERCARD_GOLD">Mastercard Gold</MenuItem>
                  <MenuItem value="MASTERCARD_PLATINUM">Mastercard Platinum</MenuItem>
                  <MenuItem value="AMERICAN_EXPRESS">American Express</MenuItem>
                </Select>
                {formErrors.tipoTarjeta && (
                  <FormHelperText>{formErrors.tipoTarjeta}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Límite de Crédito"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                value={newAccount.limiteCredito}
                onChange={handleCreateFormChange('limiteCredito')}
                error={!!formErrors.limiteCredito}
                helperText={formErrors.limiteCredito}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                label="Día de Corte"
                type="number"
                InputProps={{
                  inputProps: { min: 1, max: 31 }
                }}
                value={newAccount.diaCorte}
                onChange={handleCreateFormChange('diaCorte')}
                error={!!formErrors.diaCorte}
                helperText={formErrors.diaCorte}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                required
                fullWidth
                label="Día de Pago"
                type="number"
                InputProps={{
                  inputProps: { min: 1, max: 31 }
                }}
                value={newAccount.diaPago}
                onChange={handleCreateFormChange('diaPago')}
                error={!!formErrors.diaPago}
                helperText={formErrors.diaPago}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newAccount.estado === 'ACTIVA'}
                    onChange={(e) => setNewAccount(prev => ({
                      ...prev,
                      estado: e.target.checked ? 'ACTIVA' : 'INACTIVA'
                    }))}
                    color="success"
                  />
                }
                label="Cuenta Activa"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateAccount} 
            variant="contained" 
            color="primary"
          >
            Crear Cuenta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountManagement; 