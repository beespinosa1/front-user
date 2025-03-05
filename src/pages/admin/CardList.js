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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  LinearProgress,
  Alert,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  CreditCard as CreditCardIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  Payment as PaymentIcon,
  SecurityUpdateGood as SecurityUpdateGoodIcon,
  SecurityUpdateWarning as SecurityUpdateWarningIcon,
} from '@mui/icons-material';

// Importar servicios
import adminTarjetaService from '../../services/AdminTarjetaService';
import adminTransaccionService from '../../services/AdminTransaccionService';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  // Estado para las transacciones
  const [transactions, setTransactions] = useState([]);
  const [transactionsDialogOpen, setTransactionsDialogOpen] = useState(false);
  const [selectedCardForTransactions, setSelectedCardForTransactions] = useState(null);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // Cargar tarjetas al iniciar
  useEffect(() => {
    fetchCards();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    filterCards();
  }, [cards, searchTerm, filterStatus, filterType]);

  // Cargar tarjetas
  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const data = await adminTarjetaService.listarTodasTarjetas();
      setCards(data);
      showAlert('Tarjetas cargadas correctamente', 'success');
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
      showAlert('Error al cargar las tarjetas. Por favor, intente nuevamente.', 'error');
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

  // Filtrar tarjetas según búsqueda y filtros
  const filterCards = () => {
    let result = [...cards];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(card => 
        card.numeroTarjeta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.titular?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.id?.toString().includes(searchTerm)
      );
    }
    
    // Filtrar por estado
    if (filterStatus) {
      result = result.filter(card => card.estado === filterStatus);
    }
    
    // Filtrar por tipo
    if (filterType) {
      result = result.filter(card => card.tipoTarjeta === filterType);
    }
    
    setFilteredCards(result);
  };

  // Manejar cambio en búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Manejar cambio en filtro de estado
  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  // Manejar cambio en filtro de tipo
  const handleTypeFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // Resetear filtros
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterType('');
  };

  // Ver detalles de tarjeta
  const handleViewDetails = (card) => {
    setSelectedCard(card);
    setDetailsDialogOpen(true);
  };

  // Cerrar diálogo de detalles
  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedCard(null);
  };

  // Abrir diálogo de bloqueo
  const handleOpenBlockDialog = (card) => {
    setSelectedCard(card);
    setBlockReason('');
    setBlockDialogOpen(true);
  };

  // Cerrar diálogo de bloqueo
  const handleCloseBlockDialog = () => {
    setBlockDialogOpen(false);
    setSelectedCard(null);
  };

  // Bloquear tarjeta
  const handleBlockCard = async () => {
    if (!selectedCard || !blockReason) return;
    
    setIsLoading(true);
    try {
      await adminTarjetaService.bloquearTarjeta(selectedCard.id, blockReason);
      showAlert('Tarjeta bloqueada correctamente', 'success');
      
      // Actualizar lista de tarjetas
      await fetchCards();
      
      // Cerrar diálogo
      setBlockDialogOpen(false);
      setSelectedCard(null);
    } catch (error) {
      console.error('Error al bloquear tarjeta:', error);
      showAlert('Error al bloquear la tarjeta. Por favor, intente nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Ver transacciones de una tarjeta
  const handleViewTransactions = async (card) => {
    setSelectedCardForTransactions(card);
    setIsLoadingTransactions(true);
    setTransactionsDialogOpen(true);
    
    try {
      const data = await adminTransaccionService.listarTransaccionesPorTarjeta(card.id);
      setTransactions(data);
    } catch (error) {
      console.error('Error al cargar transacciones:', error);
      showAlert('Error al cargar las transacciones. Por favor, intente nuevamente.', 'error');
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Cerrar diálogo de transacciones
  const handleCloseTransactionsDialog = () => {
    setTransactionsDialogOpen(false);
    setSelectedCardForTransactions(null);
    setTransactions([]);
  };

  // Obtener color según estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVA':
        return 'success';
      case 'INACTIVA':
        return 'default';
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
        return <SecurityUpdateGoodIcon fontSize="small" />;
      case 'BLOQUEADA':
        return <SecurityUpdateWarningIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Formatear número de tarjeta (mostrar solo últimos 4 dígitos)
  const formatCardNumber = (cardNumber) => {
    if (!cardNumber) return 'N/A';
    return '**** **** **** ' + cardNumber.slice(-4);
  };

  // Formatear monto con símbolo de moneda
  const formatAmount = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('es-ES', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };

  // Estados únicos para filtro
  const statusOptions = [...new Set(cards.map(card => card.estado))];
  
  // Tipos de tarjeta únicos para filtro
  const typeOptions = [...new Set(cards.map(card => card.tipoTarjeta))];

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
      
      {/* Título */}
      <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
        Consulta de Tarjetas
      </Typography>
      
      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar tarjeta"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Número, titular o ID"
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
                onChange={handleStatusFilterChange}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tipo de Tarjeta</InputLabel>
              <Select
                value={filterType}
                onChange={handleTypeFilterChange}
                label="Tipo de Tarjeta"
              >
                <MenuItem value="">Todos</MenuItem>
                {typeOptions.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
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
                onClick={fetchCards}
                title="Actualizar"
              >
                <RefreshIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabla de tarjetas */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="tabla de tarjetas">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Número</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titular</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Emisión</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <TableRow key={card.id} hover>
                  <TableCell>{formatCardNumber(card.numeroTarjeta)}</TableCell>
                  <TableCell>{card.titular}</TableCell>
                  <TableCell>{card.tipoTarjeta}</TableCell>
                  <TableCell>{formatDate(card.fechaEmision)}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(card.estado)}
                      label={card.estado} 
                      color={getStatusColor(card.estado)} 
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewDetails(card)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {card.estado === 'ACTIVA' && (
                        <Tooltip title="Bloquear tarjeta">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleOpenBlockDialog(card)}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Ver transacciones">
                        <IconButton 
                          size="small" 
                          color="info"
                          onClick={() => handleViewTransactions(card)}
                        >
                          <PaymentIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {isLoading ? 'Cargando tarjetas...' : 'No se encontraron tarjetas.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Diálogo de detalles */}
      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <CreditCardIcon sx={{ mr: 1 }} color="primary" />
          Detalles de Tarjeta
        </DialogTitle>
        <DialogContent dividers>
          {selectedCard && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Número de Tarjeta:</Typography>
                <Typography variant="body1">{formatCardNumber(selectedCard.numeroTarjeta)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Titular:</Typography>
                <Typography variant="body1">{selectedCard.titular}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Tipo de Tarjeta:</Typography>
                <Typography variant="body1">{selectedCard.tipoTarjeta}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Estado:</Typography>
                <Chip 
                  icon={getStatusIcon(selectedCard.estado)}
                  label={selectedCard.estado} 
                  color={getStatusColor(selectedCard.estado)} 
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Fecha de Emisión:</Typography>
                <Typography variant="body1">{formatDate(selectedCard.fechaEmision)}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">CVV:</Typography>
                <Typography variant="body1">***</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Límite de Crédito:</Typography>
                <Typography variant="body1">${selectedCard.limiteCredito?.toLocaleString()}</Typography>
              </Grid>
              {selectedCard.fechaBloqueo && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Fecha de Bloqueo:</Typography>
                  <Typography variant="body1">{formatDate(selectedCard.fechaBloqueo)}</Typography>
                </Grid>
              )}
              {selectedCard.motivoBloqueo && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Motivo de Bloqueo:</Typography>
                  <Typography variant="body1">{selectedCard.motivoBloqueo}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>
            Cerrar
          </Button>
          {selectedCard && selectedCard.estado === 'ACTIVA' && (
            <Button 
              color="error" 
              onClick={() => {
                handleCloseDetailsDialog();
                handleOpenBlockDialog(selectedCard);
              }}
            >
              Bloquear Tarjeta
            </Button>
          )}
          <Button 
            color="primary"
            onClick={() => {
              handleCloseDetailsDialog();
              if (selectedCard) {
                handleViewTransactions(selectedCard);
              }
            }}
          >
            Ver Transacciones
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de bloqueo */}
      <Dialog
        open={blockDialogOpen}
        onClose={handleCloseBlockDialog}
      >
        <DialogTitle>
          Bloquear Tarjeta
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Está a punto de bloquear la tarjeta {selectedCard ? formatCardNumber(selectedCard.numeroTarjeta) : ''}.
            Esta acción impedirá que la tarjeta sea utilizada para transacciones.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo del bloqueo"
            fullWidth
            variant="outlined"
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            required
            error={!blockReason}
            helperText={!blockReason ? "El motivo del bloqueo es obligatorio" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBlockDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleBlockCard} 
            color="error"
            disabled={!blockReason}
          >
            Bloquear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de transacciones */}
      <Dialog
        open={transactionsDialogOpen}
        onClose={handleCloseTransactionsDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <PaymentIcon sx={{ mr: 1 }} color="primary" />
          Transacciones de Tarjeta {selectedCardForTransactions ? formatCardNumber(selectedCardForTransactions.numeroTarjeta) : ''}
        </DialogTitle>
        
        <DialogContent dividers>
          {isLoadingTransactions ? (
            <LinearProgress sx={{ my: 2 }} />
          ) : transactions.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comercio</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} hover>
                      <TableCell>{formatDate(transaction.fecha)}</TableCell>
                      <TableCell>{transaction.descripcion}</TableCell>
                      <TableCell>{transaction.comercio || 'N/A'}</TableCell>
                      <TableCell>{formatAmount(transaction.monto)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.estado} 
                          color={transaction.estado === 'APROBADA' ? 'success' : transaction.estado === 'RECHAZADA' ? 'error' : 'default'} 
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">No hay transacciones registradas para esta tarjeta.</Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseTransactionsDialog}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CardList; 