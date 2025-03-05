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
  Alert,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Block as BlockIcon,
  Visibility as VisibilityIcon,
  LockOpen as LockOpenIcon,
  CreditCard as CreditCardIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Report as ReportIcon,
  CheckCircle as CheckCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  Help as HelpIcon,
} from '@mui/icons-material';

// Importar el servicio
import adminTarjetaService from '../../services/AdminTarjetaService';

const CardBlocking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCards, setActiveCards] = useState([]);
  const [blockedCards, setBlockedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);
  const [cardToUnblock, setCardToUnblock] = useState(null);

  // Cargar tarjetas al iniciar
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      // Obtener todas las tarjetas
      const tarjetas = await adminTarjetaService.listarTodasTarjetas();
      
      // Filtrar tarjetas activas e inactivas
      const activas = tarjetas.filter(tarjeta => tarjeta.estado === 'ACTIVA');
      const bloqueadas = tarjetas.filter(tarjeta => 
        tarjeta.estado === 'INACTIVA' || tarjeta.estado === 'BLOQUEADA');
      
      setActiveCards(activas);
      setBlockedCards(bloqueadas);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
      showAlert('Error al cargar las tarjetas. Por favor, intente nuevamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectCardToBlock = (card) => {
    setSelectedCard(card);
    setBlockDialogOpen(true);
    setBlockReason('');
  };

  const handleBlockReasonChange = (event) => {
    setBlockReason(event.target.value);
  };

  const handleCloseBlockDialog = () => {
    setBlockDialogOpen(false);
    setSelectedCard(null);
    setBlockReason('');
  };

  const handleConfirmBlock = async () => {
    if (!selectedCard || !blockReason) return;
    
    try {
      // Aquí iría la llamada al API para bloquear la tarjeta
      // adminTarjetaService.bloquearTarjeta(selectedCard.id, blockReason);
      
      // Simulamos el bloqueo:
      const updatedActiveCards = activeCards.filter(card => card.id !== selectedCard.id);
      
      const blockedCard = {
        ...selectedCard,
        estado: 'BLOQUEADA'
      };
      
      setActiveCards(updatedActiveCards);
      setBlockedCards([blockedCard, ...blockedCards]);
      
      showAlert(`Tarjeta de ${selectedCard.titular} bloqueada correctamente`, 'success');
      
      // Cerramos el diálogo
      handleCloseBlockDialog();
    } catch (error) {
      console.error('Error al bloquear tarjeta:', error);
      showAlert('Error al bloquear la tarjeta. Intente nuevamente.', 'error');
    }
  };

  const handleUnblockCard = (card) => {
    setCardToUnblock(card);
    setUnblockDialogOpen(true);
  };

  const handleCloseUnblockDialog = () => {
    setUnblockDialogOpen(false);
    setCardToUnblock(null);
  };

  const handleConfirmUnblock = async () => {
    if (!cardToUnblock) return;
    
    try {
      // Aquí iría la llamada al API para desbloquear la tarjeta
      // adminTarjetaService.desbloquearTarjeta(cardToUnblock.id);
      
      // Simulamos el desbloqueo:
      const updatedBlockedCards = blockedCards.filter(card => card.id !== cardToUnblock.id);
      
      const unblockedCard = {
        ...cardToUnblock,
        estado: 'ACTIVA'
      };
      
      setBlockedCards(updatedBlockedCards);
      setActiveCards([...activeCards, unblockedCard]);
      
      showAlert(`Tarjeta de ${cardToUnblock.titular} desbloqueada correctamente`, 'success');
      
      // Cerramos el diálogo
      handleCloseUnblockDialog();
    } catch (error) {
      console.error('Error al desbloquear tarjeta:', error);
      showAlert('Error al desbloquear la tarjeta. Intente nuevamente.', 'error');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowSuccessAlert(true);
    setAlertOpen(true);
    
    // Ocultar la alerta después de 5 segundos
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 5000);
  };

  // Filtrar tarjetas según término de búsqueda
  const filteredActiveCards = activeCards.filter(card => 
    card.numeroTarjeta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.titular?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBlockedCards = blockedCards.filter(card => 
    card.numeroTarjeta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.titular?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        return <CheckCircleIcon />;
      case 'BLOQUEADA':
        return <BlockIcon />;
      case 'INACTIVA':
        return <RemoveCircleIcon />;
      default:
        return <HelpIcon />;
    }
  };

  // Cerrar alerta
  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Box>
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      
      {showSuccessAlert && (
        <Alert 
          severity={alertType} 
          sx={{ mb: 3 }}
          onClose={() => setShowSuccessAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Tarjetas Bloqueadas
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="error.main">
                {blockedCards.length}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Inactivas o bloqueadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%', bgcolor: 'primary.main', color: 'white', boxShadow: 2 }}>
            <CardContent>
              <Typography sx={{ opacity: 0.8 }} gutterBottom>
                Tarjetas Activas
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {activeCards.length}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Disponibles para uso
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Buscador de tarjetas para bloquear */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Bloquear Tarjeta
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Ingrese el número de tarjeta, nombre del titular o ID del cliente para buscar la tarjeta a bloquear.
        </Typography>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Buscar tarjeta"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Número de tarjeta, nombre del titular o ID del cliente"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              variant="contained" 
              color="error"
              fullWidth
              startIcon={<BlockIcon />}
              disabled={!searchTerm}
              sx={{ height: '56px' }}
            >
              Bloquear Tarjeta
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de tarjetas bloqueadas */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Historial de Tarjetas Bloqueadas
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="tabla de tarjetas bloqueadas">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Número de Tarjeta</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titular</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBlockedCards.map((card) => (
                <TableRow key={card.id} hover>
                  <TableCell>{card.numeroTarjeta}</TableCell>
                  <TableCell>{card.titular}</TableCell>
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(card.estado)}
                      label={card.estado} 
                      color={getStatusColor(card.estado)} 
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
                      <Tooltip title="Desbloquear">
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleUnblockCard(card)}
                        >
                          <LockOpenIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Diálogo de confirmación de bloqueo */}
      <Dialog
        open={blockDialogOpen}
        onClose={handleCloseBlockDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Bloqueo de Tarjeta</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Por favor confirme el bloqueo de la tarjeta:
          </DialogContentText>
          
          {selectedCard && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Número de tarjeta:</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedCard.numeroTarjeta}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Tipo:</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedCard.tipo}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Titular:</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedCard.titular}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">ID Cliente:</Typography>
                  <Typography variant="body1" fontWeight="bold">{selectedCard.idCliente}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          
          <FormControl fullWidth>
            <InputLabel id="block-reason-label">Motivo de bloqueo</InputLabel>
            <Select
              labelId="block-reason-label"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              label="Motivo de bloqueo"
            >
              <MenuItem value="FRAUDE">Fraude detectado</MenuItem>
              <MenuItem value="ROBO">Tarjeta robada</MenuItem>
              <MenuItem value="PERDIDA">Tarjeta perdida</MenuItem>
              <MenuItem value="SOLICITUD_CLIENTE">Solicitud del cliente</MenuItem>
              <MenuItem value="MORA">Mora en pagos</MenuItem>
              <MenuItem value="OTRO">Otro</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBlockDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmBlock} 
            variant="contained" 
            color="error"
            disabled={!blockReason}
          >
            Confirmar Bloqueo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de desbloqueo */}
      <Dialog
        open={unblockDialogOpen}
        onClose={handleCloseUnblockDialog}
      >
        <DialogTitle>Confirmar Desbloqueo de Tarjeta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea desbloquear la tarjeta <strong>{cardToUnblock?.numeroTarjeta}</strong> del cliente <strong>{cardToUnblock?.titular}</strong>?
            La tarjeta volverá a estar operativa inmediatamente.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnblockDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmUnblock} variant="contained" color="success">
            Confirmar Desbloqueo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alertas */}
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertType} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CardBlocking; 