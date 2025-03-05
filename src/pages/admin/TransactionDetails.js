import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  InputAdornment,
  Alert,
  Collapse,
  Breadcrumbs,
  Link,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  Person as PersonIcon,
  NoteAdd as NoteAddIcon,
  AttachMoney as AttachMoneyIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  GetApp as GetAppIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  History as HistoryIcon,
  LocalAtm as LocalAtmIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

// Importar el servicio
import adminTransaccionService from '../../services/AdminTransaccionService';

// Datos de ejemplo para la transacción
const sampleTransaction = {
  id: 'TRX-8753-4284-9621',
  date: '2023-03-15 14:32:45',
  cardNumber: '4532 **** **** 1245',
  cardHolder: 'Juan Pérez',
  cardType: 'Visa Gold',
  merchantName: 'Supermercado El Ahorro',
  merchantId: 'MERCH-45789',
  amount: 356.75,
  currency: 'MXN',
  status: 'Aprobada',
  type: 'Compra',
  category: 'Supermercado',
  description: 'Compra en Supermercado El Ahorro',
  authorizationCode: 'AUTH-78542',
  location: 'Ciudad de México, México',
  deviceInfo: {
    device: 'Terminal POS',
    serialNumber: 'POS-78542',
    ipAddress: '192.168.1.45'
  },
  issuerDetail: {
    bank: 'Banco Nacional',
    responseCode: '00',
    responseMessage: 'Aprobada'
  },
  acquirerDetail: {
    bank: 'Banco Comercial',
    terminalId: 'TERM-45789',
    merchantCategory: 'Supermercado'
  },
};

// Datos de ejemplo para historial de eventos
const sampleEvents = [
  {
    id: 1,
    date: '2023-03-15 14:32:40',
    type: 'Autorización iniciada',
    user: 'Sistema',
    description: 'Transacción iniciada desde terminal POS',
  },
  {
    id: 2,
    date: '2023-03-15 14:32:42',
    type: 'Validación de tarjeta',
    user: 'Sistema',
    description: 'Tarjeta validada correctamente',
  },
  {
    id: 3,
    date: '2023-03-15 14:32:43',
    type: 'Verificación de fondos',
    user: 'Sistema',
    description: 'Fondos suficientes disponibles',
  },
  {
    id: 4,
    date: '2023-03-15 14:32:44',
    type: 'Autorización',
    user: 'Sistema',
    description: 'Transacción autorizada por el banco emisor',
  },
  {
    id: 5,
    date: '2023-03-15 14:32:45',
    type: 'Transacción completada',
    user: 'Sistema',
    description: 'Transacción completada exitosamente',
  },
];

// Datos de ejemplo para otras transacciones del mismo cliente
const sampleRelatedTransactions = [
  {
    id: 'TRX-8423-1284-7891',
    date: '2023-03-14 10:15:22',
    merchantName: 'Restaurante La Terraza',
    amount: 245.50,
    status: 'Aprobada',
    type: 'Compra',
  },
  {
    id: 'TRX-7523-3371-6423',
    date: '2023-03-12 16:45:10',
    merchantName: 'Gasolinera Express',
    amount: 850.00,
    status: 'Aprobada',
    type: 'Compra',
  },
  {
    id: 'TRX-5298-2371-9012',
    date: '2023-03-10 09:22:35',
    merchantName: 'Farmacia ABC',
    amount: 312.75,
    status: 'Aprobada',
    type: 'Compra',
  },
  {
    id: 'TRX-4523-8923-1278',
    date: '2023-03-08 13:10:55',
    merchantName: 'Tienda Departamental XYZ',
    amount: 1245.80,
    status: 'Aprobada',
    type: 'Compra',
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`transaction-tabpanel-${index}`}
      aria-labelledby={`transaction-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TransactionDetails = ({ transactionId }) => {
  const [transaction, setTransaction] = useState(null);
  const [events, setEvents] = useState([]);
  const [relatedTransactions, setRelatedTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos de la transacción al montar el componente
  useEffect(() => {
    // Si no se proporciona un ID de transacción, usar un ID de ejemplo
    const idToFetch = transactionId || 'TRX-8753-4284-9621';
    fetchTransactionData(idToFetch);
  }, [transactionId]);

  const fetchTransactionData = async (id) => {
    setIsLoading(true);
    try {
      // Obtener detalles de la transacción
      const transactionData = await adminTransaccionService.obtenerTransaccion(id);
      setTransaction(transactionData);
      
      // Obtener historial de eventos
      const eventsData = await adminTransaccionService.obtenerHistorialEventos(id);
      setEvents(eventsData);
      
      // Obtener transacciones relacionadas (mismo cliente)
      if (transactionData.idCliente) {
        const relatedData = await adminTransaccionService.obtenerTransaccionesCliente(
          transactionData.idCliente,
          { limit: 5, excludeId: id }
        );
        setRelatedTransactions(relatedData);
      }
    } catch (error) {
      console.error('Error al cargar datos de la transacción:', error);
      showAlert('Error al cargar datos de la transacción', 'error');
      
      // Si hay un error, cargar datos de ejemplo para no romper la interfaz
      setTransaction(sampleTransaction);
      setEvents(sampleEvents);
      setRelatedTransactions(sampleRelatedTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBackToList = () => {
    // Esta función redirigirá al usuario a la lista de transacciones
    console.log('Volver a la lista de transacciones');
  };

  const showAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
    
    // Ocultar la alerta automáticamente después de 5 segundos
    setTimeout(() => {
      setAlertOpen(false);
    }, 5000);
  };

  const handlePrintTransaction = () => {
    console.log('Imprimir detalles de la transacción');
    showAlert('Preparando documento para impresión...', 'info');
  };

  const handleDownloadPdf = () => {
    setIsLoading(true);
    console.log('Descargar detalles como PDF');
    
    // Simular tiempo de carga
    setTimeout(() => {
      setIsLoading(false);
      showAlert('Documento PDF descargado correctamente', 'success');
    }, 2000);
  };

  const handleShareTransaction = () => {
    console.log('Compartir detalles de la transacción');
    showAlert('Enlace de compartir copiado al portapapeles', 'success');
  };

  const handleOpenFlagDialog = () => {
    setFlagDialogOpen(true);
  };

  const handleCloseFlagDialog = () => {
    setFlagDialogOpen(false);
    setFlagReason('');
  };

  const handleFlagReasonChange = (event) => {
    setFlagReason(event.target.value);
  };

  const handleConfirmFlag = async () => {
    if (!transaction || !flagReason) return;
    
    setIsLoading(true);
    try {
      // Llamar al servicio para marcar la transacción como sospechosa
      await adminTransaccionService.marcarComoSospechosa(transaction.id, flagReason);
      
      // Actualizar los datos de la transacción
      await fetchTransactionData(transaction.id);
      
      setFlagDialogOpen(false);
      showAlert('Transacción marcada para investigación', 'warning');
    } catch (error) {
      console.error('Error al marcar la transacción como sospechosa:', error);
      showAlert('Error al marcar la transacción como sospechosa', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddNoteDialog = () => {
    setAddNoteDialogOpen(true);
  };

  const handleCloseAddNoteDialog = () => {
    setAddNoteDialogOpen(false);
    setNoteText('');
  };

  const handleNoteTextChange = (event) => {
    setNoteText(event.target.value);
  };

  const handleConfirmAddNote = async () => {
    if (!transaction || !noteText.trim()) return;
    
    setIsLoading(true);
    try {
      // Llamar al servicio para agregar una nota
      await adminTransaccionService.agregarNota(transaction.id, noteText);
      
      // Actualizar el historial de eventos
      const eventsData = await adminTransaccionService.obtenerHistorialEventos(transaction.id);
      setEvents(eventsData);
      
      setAddNoteDialogOpen(false);
      setNoteText('');
      showAlert('Nota agregada correctamente', 'success');
    } catch (error) {
      console.error('Error al agregar nota:', error);
      showAlert('Error al agregar la nota', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobada':
      case 'APROBADA':
        return 'success';
      case 'Rechazada':
      case 'RECHAZADA':
        return 'error';
      case 'Pendiente':
      case 'PENDIENTE':
        return 'warning';
      case 'Bajo investigación':
      case 'BAJO_INVESTIGACION':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Aprobada':
      case 'APROBADA':
        return <CheckCircleIcon fontSize="small" />;
      case 'Rechazada':
      case 'RECHAZADA':
        return <CancelIcon fontSize="small" />;
      case 'Pendiente':
      case 'PENDIENTE':
        return <InfoIcon fontSize="small" />;
      case 'Bajo investigación':
      case 'BAJO_INVESTIGACION':
        return <WarningIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Si no hay transacción cargada y no está cargando, mostrar un mensaje
  if (!transaction && !isLoading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No se encontró la transacción especificada
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          sx={{ mt: 2 }}
          onClick={handleBackToList}
        >
          Volver al historial
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Alertas */}
      <Collapse in={alertOpen}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setAlertOpen(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>
      
      {/* Progreso de carga */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Navegación de migas de pan */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link 
          color="inherit" 
          href="#" 
          onClick={handleBackToList}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <ArrowBackIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Historial de Transacciones
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Detalle de Transacción
        </Typography>
      </Breadcrumbs>
      
      {transaction && (
        <>
          {/* Encabezado y acciones rápidas */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h5" component="h1" sx={{ mr: 2 }}>
                    Transacción #{transaction.id}
                  </Typography>
                  <Chip 
                    icon={getStatusIcon(transaction.estado)}
                    label={transaction.estado} 
                    color={getStatusColor(transaction.estado)} 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                  {transaction.fecha} | {transaction.monto?.toLocaleString('es-MX', { style: 'currency', currency: transaction.moneda || 'MXN' })} | {transaction.comercio}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                <Tooltip title="Marcar como sospechosa">
                  <IconButton 
                    color="warning" 
                    onClick={handleOpenFlagDialog}
                    disabled={transaction.estado === 'BAJO_INVESTIGACION' || transaction.estado === 'Bajo investigación'}
                  >
                    <FlagIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Agregar nota">
                  <IconButton color="primary" onClick={handleOpenAddNoteDialog}>
                    <NoteAddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Descargar PDF">
                  <IconButton color="primary" onClick={handleDownloadPdf}>
                    <GetAppIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Imprimir">
                  <IconButton color="primary" onClick={handlePrintTransaction}>
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Compartir">
                  <IconButton color="primary" onClick={handleShareTransaction}>
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Pestañas */}
          <Box sx={{ mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="Pestañas de detalle de transacción">
              <Tab label="Información General" icon={<InfoIcon />} iconPosition="start" />
              <Tab label="Historial de Eventos" icon={<HistoryIcon />} iconPosition="start" />
              <Tab label="Transacciones Relacionadas" icon={<TimelineIcon />} iconPosition="start" />
            </Tabs>
          </Box>
          
          {/* Contenido de pestañas */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              {/* Información de la transacción */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                      <ReceiptIcon sx={{ mr: 1 }} />
                      Detalles de la Transacción
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">ID de Transacción:</Typography>
                        <Typography variant="body1" fontWeight="medium">{transaction.id}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Fecha y Hora:</Typography>
                        <Typography variant="body1">{transaction.fecha}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Tipo:</Typography>
                        <Typography variant="body1">{transaction.tipo}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Categoría:</Typography>
                        <Typography variant="body1">{transaction.categoria}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Monto:</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {transaction.monto?.toLocaleString('es-MX', { style: 'currency', currency: transaction.moneda || 'MXN' })}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Código de Autorización:</Typography>
                        <Typography variant="body1">{transaction.codigoAutorizacion}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Descripción:</Typography>
                        <Typography variant="body1">{transaction.descripcion}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Ubicación:</Typography>
                        <Typography variant="body1">{transaction.ubicacion}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Información de la tarjeta */}
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CreditCardIcon sx={{ mr: 1 }} />
                      Información de la Tarjeta
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Número de Tarjeta:</Typography>
                        <Typography variant="body1">{transaction.numeroTarjeta}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Titular:</Typography>
                        <Typography variant="body1">{transaction.titularTarjeta}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Tipo de Tarjeta:</Typography>
                        <Typography variant="body1">{transaction.tipoTarjeta}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
                
                {/* Información del comercio */}
                <Card sx={{ height: '100%', mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocalAtmIcon sx={{ mr: 1 }} />
                      Información del Comercio
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Nombre del Comercio:</Typography>
                        <Typography variant="body1">{transaction.comercio}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">ID del Comercio:</Typography>
                        <Typography variant="body1">{transaction.idComercio}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Terminal:</Typography>
                        <Typography variant="body1">{transaction.detalleAdquiriente?.terminalId}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">Categoría:</Typography>
                        <Typography variant="body1">{transaction.detalleAdquiriente?.categoriaComercio}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Información técnica */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon sx={{ mr: 1 }} />
                      Información Técnica de Procesamiento
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Banco Emisor</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Banco:</Typography>
                            <Typography variant="body1">{transaction.detalleEmisor?.banco}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Código de Respuesta:</Typography>
                            <Typography variant="body1">{transaction.detalleEmisor?.codigoRespuesta}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" color="text.secondary">Mensaje:</Typography>
                            <Typography variant="body1">{transaction.detalleEmisor?.mensajeRespuesta}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Banco Adquiriente</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Banco:</Typography>
                            <Typography variant="body1">{transaction.detalleAdquiriente?.banco}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Dispositivo:</Typography>
                            <Typography variant="body1">{transaction.infoDispositivo?.dispositivo}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">Número de Serie:</Typography>
                            <Typography variant="body1">{transaction.infoDispositivo?.numeroSerie}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" color="text.secondary">IP:</Typography>
                            <Typography variant="body1">{transaction.infoDispositivo?.direccionIP}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Historial de Eventos de la Transacción
                </Typography>
                <Typography variant="body2" gutterBottom color="text.secondary">
                  Todos los eventos y cambios relacionados con esta transacción
                </Typography>
                
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
                  <Table aria-label="historial de eventos">
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha y Hora</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo de Evento</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.length > 0 ? (
                        events.map((event) => (
                          <TableRow key={event.id} hover>
                            <TableCell>{event.fecha}</TableCell>
                            <TableCell>{event.tipo}</TableCell>
                            <TableCell>{event.usuario}</TableCell>
                            <TableCell>{event.descripcion}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No hay eventos registrados para esta transacción
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Transacciones Relacionadas
                </Typography>
                <Typography variant="body2" gutterBottom color="text.secondary">
                  Otras transacciones recientes del mismo cliente
                </Typography>
                
                <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
                  <Table aria-label="transacciones relacionadas">
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                      <TableRow>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Transacción</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comercio</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {relatedTransactions.length > 0 ? (
                        relatedTransactions.map((tx) => (
                          <TableRow key={tx.id} hover>
                            <TableCell>{tx.id}</TableCell>
                            <TableCell>{tx.fecha}</TableCell>
                            <TableCell>{tx.comercio}</TableCell>
                            <TableCell>{tx.monto?.toLocaleString('es-MX', { style: 'currency', currency: tx.moneda || 'MXN' })}</TableCell>
                            <TableCell>{tx.tipo}</TableCell>
                            <TableCell>
                              <Chip 
                                label={tx.estado} 
                                color={getStatusColor(tx.estado)} 
                                size="small"
                                icon={getStatusIcon(tx.estado)}
                              />
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Ver detalles">
                                <IconButton size="small" color="primary">
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No hay transacciones relacionadas disponibles
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </TabPanel>
        </>
      )}
      
      {/* Diálogo para marcar transacción como sospechosa */}
      <Dialog
        open={flagDialogOpen}
        onClose={handleCloseFlagDialog}
        aria-labelledby="flag-dialog-title"
      >
        <DialogTitle id="flag-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FlagIcon color="warning" sx={{ mr: 1 }} />
            Marcar transacción como sospechosa
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Esta acción marcará la transacción para investigación por posible fraude o irregularidad. Por favor, indique el motivo:
          </DialogContentText>
          <FormControl fullWidth required>
            <InputLabel id="flag-reason-label">Motivo</InputLabel>
            <Select
              labelId="flag-reason-label"
              value={flagReason}
              onChange={handleFlagReasonChange}
              label="Motivo"
            >
              <MenuItem value="">Seleccione un motivo</MenuItem>
              <MenuItem value="Posible fraude">Posible fraude</MenuItem>
              <MenuItem value="Transacción inusual">Transacción inusual</MenuItem>
              <MenuItem value="Disputa de cliente">Disputa de cliente</MenuItem>
              <MenuItem value="Localización sospechosa">Localización sospechosa</MenuItem>
              <MenuItem value="Monto fuera de patrón">Monto fuera de patrón</MenuItem>
              <MenuItem value="Múltiples intentos">Múltiples intentos</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFlagDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmFlag} 
            variant="contained" 
            color="warning"
            disabled={!flagReason}
          >
            Marcar como Sospechosa
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo para agregar nota */}
      <Dialog
        open={addNoteDialogOpen}
        onClose={handleCloseAddNoteDialog}
        aria-labelledby="add-note-dialog-title"
      >
        <DialogTitle id="add-note-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NoteAddIcon color="primary" sx={{ mr: 1 }} />
            Agregar nota a la transacción
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Añada información o comentarios relevantes sobre esta transacción. Las notas serán visibles para todos los administradores.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="note"
            label="Nota"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={noteText}
            onChange={handleNoteTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddNoteDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmAddNote} 
            variant="contained" 
            color="primary"
            disabled={!noteText.trim()}
          >
            Agregar Nota
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionDetails; 