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
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Flag as FlagIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

// Datos de ejemplo para las transacciones
const sampleTransactions = [
  {
    id: 1,
    cardNumber: '4532 **** **** 1245',
    cardHolder: 'Juan Pérez',
    merchant: 'Supermercado El Ahorro',
    date: '2023-03-05 14:32:45',
    amount: 125.75,
    status: 'Completada',
    type: 'Compra',
    reference: 'TRX-001-2023'
  },
  {
    id: 2,
    cardNumber: '5412 **** **** 7823',
    cardHolder: 'María Gómez',
    merchant: 'Farmacia Cruz Verde',
    date: '2023-03-05 10:15:22',
    amount: 45.30,
    status: 'Completada',
    type: 'Compra',
    reference: 'TRX-002-2023'
  },
  {
    id: 3,
    cardNumber: '4916 **** **** 3388',
    cardHolder: 'Ana Martínez',
    merchant: 'Tienda Departamental El Globo',
    date: '2023-03-04 16:48:33',
    amount: 350.00,
    status: 'Pendiente',
    type: 'Compra',
    reference: 'TRX-003-2023'
  },
  {
    id: 4,
    cardNumber: '5327 **** **** 9145',
    cardHolder: 'Roberto Díaz',
    merchant: 'Gasolinera Los Pinos',
    date: '2023-03-04 09:22:17',
    amount: 75.50,
    status: 'Completada',
    type: 'Compra',
    reference: 'TRX-004-2023'
  },
  {
    id: 5,
    cardNumber: '4532 **** **** 1245',
    cardHolder: 'Juan Pérez',
    merchant: 'Restaurante La Esquina',
    date: '2023-03-03 20:12:05',
    amount: 89.25,
    status: 'Rechazada',
    type: 'Compra',
    reference: 'TRX-005-2023'
  },
  {
    id: 6,
    cardNumber: '5412 **** **** 7823',
    cardHolder: 'María Gómez',
    merchant: 'Tienda Online MundoTech',
    date: '2023-03-03 13:45:51',
    amount: 299.99,
    status: 'Completada',
    type: 'Compra en línea',
    reference: 'TRX-006-2023'
  },
  {
    id: 7,
    cardNumber: '3782 **** **** 4521',
    cardHolder: 'Carlos Rodríguez',
    merchant: 'Hotel Playa Azul',
    date: '2023-03-02 11:30:29',
    amount: 1250.00,
    status: 'Rechazada',
    type: 'Reserva',
    reference: 'TRX-007-2023'
  },
];

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // En un escenario real, aquí se haría una petición a la API para obtener los resultados filtrados
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterType('');
    setDateFrom('');
    setDateTo('');
    setTransactions(sampleTransactions);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completada':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Rechazada':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completada':
        return <CheckCircleIcon fontSize="small" />;
      case 'Pendiente':
        return <AccessTimeIcon fontSize="small" />;
      case 'Rechazada':
        return <CancelIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Calcular métricas para las tarjetas de resumen
  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const completedTransactions = transactions.filter(t => t.status === 'Completada').length;
  const pendingTransactions = transactions.filter(t => t.status === 'Pendiente').length;
  const rejectedTransactions = transactions.filter(t => t.status === 'Rechazada').length;

  return (
    <Box>
      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Transacciones
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {totalTransactions}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Completadas
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                {completedTransactions}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {((completedTransactions / totalTransactions) * 100).toFixed(1)}% del total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Pendientes
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold" color="warning.main">
                {pendingTransactions}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {((pendingTransactions / totalTransactions) * 100).toFixed(1)}% del total
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
                {rejectedTransactions}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {((rejectedTransactions / totalTransactions) * 100).toFixed(1)}% del total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Buscar y Filtrar Transacciones
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar transacción"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Tarjeta, titular, comercio o referencia"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filterStatus}
                onChange={handleFilterStatusChange}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Completada">Completada</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Rechazada">Rechazada</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filterType}
                onChange={handleFilterTypeChange}
                label="Tipo"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Compra">Compra</MenuItem>
                <MenuItem value="Compra en línea">Compra en línea</MenuItem>
                <MenuItem value="Reserva">Reserva</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Desde"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Hasta"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Button 
                variant="outlined"
                onClick={handleResetFilters}
                title="Limpiar filtros"
                sx={{ minWidth: 'auto' }}
              >
                <FilterListIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabla de transacciones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Historial de Transacciones
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<DownloadIcon />}
          size="small"
        >
          Exportar
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table aria-label="tabla de transacciones">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Referencia</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha y Hora</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tarjeta</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titular</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comercio</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} hover>
                <TableCell>{transaction.reference}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.cardNumber}</TableCell>
                <TableCell>{transaction.cardHolder}</TableCell>
                <TableCell>{transaction.merchant}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>
                  <Chip 
                    icon={getStatusIcon(transaction.status)}
                    label={transaction.status} 
                    color={getStatusColor(transaction.status)} 
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
                    <Tooltip title="Marcar como sospechosa">
                      <IconButton size="small" color="warning">
                        <FlagIcon fontSize="small" />
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
  );
};

export default TransactionHistory; 