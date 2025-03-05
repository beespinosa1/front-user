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
  InputAdornment,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Receipt as ReceiptIcon,
  PointOfSale as PointOfSaleIcon,
  LocalAtm as LocalAtmIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Send as SendIcon,
} from '@mui/icons-material';

// Datos de ejemplo para los comercios y facturación
const sampleMerchants = [
  {
    id: 1,
    name: 'Supermercado El Ahorro',
    account: '10023456789',
    type: 'Supermercado',
    pendingAmount: 12450.75,
    lastBilling: '2023-03-01',
    commissionRate: 3.5,
    pendingTransactions: 23,
    status: 'Pendiente',
  },
  {
    id: 2,
    name: 'Farmacia Cruz Verde',
    account: '10087654321',
    type: 'Farmacia',
    pendingAmount: 5678.30,
    lastBilling: '2023-03-02',
    commissionRate: 2.8,
    pendingTransactions: 12,
    status: 'Pendiente',
  },
  {
    id: 3,
    name: 'Tienda Departamental El Globo',
    account: '10098765432',
    type: 'Retail',
    pendingAmount: 23456.90,
    lastBilling: '2023-03-02',
    commissionRate: 4.0,
    pendingTransactions: 45,
    status: 'Pendiente',
  },
  {
    id: 4,
    name: 'Restaurante La Esquina',
    account: '10054321678',
    type: 'Restaurante',
    pendingAmount: 3890.45,
    lastBilling: '2023-03-03',
    commissionRate: 5.2,
    pendingTransactions: 18,
    status: 'Facturado',
  },
  {
    id: 5,
    name: 'Gasolinera Los Pinos',
    account: '10089765432',
    type: 'Combustible',
    pendingAmount: 8975.20,
    lastBilling: '2023-03-03',
    commissionRate: 2.5,
    pendingTransactions: 34,
    status: 'Pendiente',
  },
];

// Historial de facturación
const billingHistory = [
  {
    id: 1,
    merchantId: 4,
    merchantName: 'Restaurante La Esquina',
    date: '2023-03-03 10:15:22',
    amount: 3890.45,
    commission: 202.30,
    netAmount: 3688.15,
    transactionCount: 18,
    status: 'Completado',
    reference: 'BILL-001-2023'
  },
  {
    id: 2,
    merchantId: 2,
    merchantName: 'Farmacia Cruz Verde',
    date: '2023-03-02 15:45:33',
    amount: 4250.18,
    commission: 119.00,
    netAmount: 4131.18,
    transactionCount: 9,
    status: 'Completado',
    reference: 'BILL-002-2023'
  },
  {
    id: 3,
    merchantId: 1,
    merchantName: 'Supermercado El Ahorro',
    date: '2023-03-01 17:30:45',
    amount: 18345.70,
    commission: 642.10,
    netAmount: 17703.60,
    transactionCount: 42,
    status: 'Completado',
    reference: 'BILL-003-2023'
  },
];

const BillingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [merchants, setMerchants] = useState(sampleMerchants);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // En un escenario real, aquí se haría una petición a la API para obtener los resultados filtrados
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setMerchants(sampleMerchants);
  };

  const handleBillMerchant = (merchant) => {
    setSelectedMerchant(merchant);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmBilling = () => {
    // Aquí se realizaría la llamada al backend para procesar la facturación
    console.log(`Facturando al comercio: ${selectedMerchant.name} por $${selectedMerchant.pendingAmount}`);
    
    // Simulación de actualización
    const updatedMerchants = merchants.map(merchant => 
      merchant.id === selectedMerchant.id 
        ? { ...merchant, status: 'Facturado', pendingAmount: 0, pendingTransactions: 0 } 
        : merchant
    );
    
    setMerchants(updatedMerchants);
    setOpenDialog(false);
  };

  // Calcular métricas para las tarjetas de resumen
  const totalPending = merchants
    .filter(m => m.status === 'Pendiente')
    .reduce((sum, merchant) => sum + merchant.pendingAmount, 0);
  
  const totalCommission = merchants
    .filter(m => m.status === 'Pendiente')
    .reduce((sum, merchant) => sum + (merchant.pendingAmount * merchant.commissionRate / 100), 0);
  
  const pendingMerchants = merchants.filter(m => m.status === 'Pendiente').length;
  
  const totalTransactions = merchants
    .filter(m => m.status === 'Pendiente')
    .reduce((sum, merchant) => sum + merchant.pendingTransactions, 0);

  return (
    <Box>
      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pendiente de facturación
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {pendingMerchants} comercios
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Transacciones pendientes
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {totalTransactions}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Total de transacciones sin facturar
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Comisiones a generar
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                ${totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Ingresos para el banco
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'white', boxShadow: 2 }}>
            <CardContent>
              <Typography sx={{ opacity: 0.8 }} gutterBottom>
                Monto neto a pagar
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                ${(totalPending - totalCommission).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Descontando comisiones
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Buscar y Filtrar Comercios
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar comercio"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Nombre o número de cuenta"
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
              <InputLabel>Tipo de Comercio</InputLabel>
              <Select
                value={filterType}
                onChange={handleFilterTypeChange}
                label="Tipo de Comercio"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Supermercado">Supermercado</MenuItem>
                <MenuItem value="Farmacia">Farmacia</MenuItem>
                <MenuItem value="Retail">Retail</MenuItem>
                <MenuItem value="Restaurante">Restaurante</MenuItem>
                <MenuItem value="Combustible">Combustible</MenuItem>
              </Select>
            </FormControl>
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
                <MenuItem value="Facturado">Facturado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button 
              variant="outlined"
              fullWidth
              startIcon={<FilterListIcon />}
              onClick={handleResetFilters}
            >
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Selector de pestañas */}
      <Box sx={{ mb: 3 }}>
        <Button 
          variant={activeTab === 'pending' ? "contained" : "outlined"} 
          onClick={() => setActiveTab('pending')}
          sx={{ mr: 1 }}
        >
          Pendientes de Facturación
        </Button>
        <Button 
          variant={activeTab === 'history' ? "contained" : "outlined"} 
          onClick={() => setActiveTab('history')}
        >
          Historial de Facturación
        </Button>
      </Box>

      {/* Tabla de comercios pendientes */}
      {activeTab === 'pending' && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Comercios Pendientes de Facturación
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<ReceiptIcon />}
              disabled={merchants.filter(m => m.status === 'Pendiente').length === 0}
            >
              Facturar Todos
            </Button>
          </Box>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table aria-label="tabla de comercios">
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comercio</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cuenta</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto Pendiente</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Transacciones</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comisión</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {merchants
                  .filter(merchant => filterStatus ? merchant.status === filterStatus : true)
                  .map((merchant) => (
                  <TableRow key={merchant.id} hover>
                    <TableCell>{merchant.name}</TableCell>
                    <TableCell>{merchant.type}</TableCell>
                    <TableCell>{merchant.account}</TableCell>
                    <TableCell>${merchant.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>{merchant.pendingTransactions}</TableCell>
                    <TableCell>{merchant.commissionRate}%</TableCell>
                    <TableCell>
                      <Chip 
                        label={merchant.status} 
                        color={merchant.status === 'Pendiente' ? 'warning' : 'success'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Tooltip title="Ver detalle">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Facturar">
                          <span>
                            <IconButton 
                              size="small" 
                              color="secondary" 
                              disabled={merchant.status === 'Facturado'}
                              onClick={() => handleBillMerchant(merchant)}
                            >
                              <ReceiptIcon fontSize="small" />
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
        </>
      )}

      {/* Tabla de historial de facturación */}
      {activeTab === 'history' && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Historial de Facturación
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table aria-label="tabla de historial de facturación">
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Referencia</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha y Hora</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comercio</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto Bruto</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comisión</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto Neto</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Transacciones</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingHistory.map((bill) => (
                  <TableRow key={bill.id} hover>
                    <TableCell>{bill.reference}</TableCell>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell>{bill.merchantName}</TableCell>
                    <TableCell>${bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>${bill.commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>${bill.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell>{bill.transactionCount}</TableCell>
                    <TableCell>
                      <Box>
                        <Tooltip title="Ver detalle">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Reenviar comprobante">
                          <IconButton size="small" color="secondary">
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Diálogo de confirmación */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmar Facturación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea facturar al comercio <strong>{selectedMerchant?.name}</strong>?
          </DialogContentText>
          {selectedMerchant && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Detalles de facturación:</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monto bruto:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${selectedMerchant.pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Tasa de comisión:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedMerchant.commissionRate}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Comisión a retener:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="error.main">
                    ${(selectedMerchant.pendingAmount * selectedMerchant.commissionRate / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Monto neto a pagar:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ${(selectedMerchant.pendingAmount * (1 - selectedMerchant.commissionRate / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Número de transacciones:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedMerchant.pendingTransactions}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleConfirmBilling} variant="contained" color="primary">
            Confirmar Facturación
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillingManagement; 