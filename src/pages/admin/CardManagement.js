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
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

// Datos de ejemplo para las tarjetas
const sampleCards = [
  {
    id: 1,
    cardNumber: '4532 **** **** 1245',
    cardHolder: 'Juan Pérez',
    userId: 'CLI-001',
    type: 'Visa Gold',
    status: 'Activa',
    expiryDate: '12/2025',
    lastActivity: '2023-03-01',
    creditLimit: 5000,
    availableCredit: 3245.50,
  },
  {
    id: 2,
    cardNumber: '5412 **** **** 7823',
    cardHolder: 'María Gómez',
    userId: 'CLI-002',
    type: 'Mastercard Platinum',
    status: 'Activa',
    expiryDate: '05/2026',
    lastActivity: '2023-03-04',
    creditLimit: 10000,
    availableCredit: 8750.75,
  },
  {
    id: 3,
    cardNumber: '3782 **** **** 4521',
    cardHolder: 'Carlos Rodríguez',
    userId: 'CLI-003',
    type: 'American Express',
    status: 'Bloqueada',
    expiryDate: '09/2024',
    lastActivity: '2023-02-15',
    creditLimit: 8000,
    availableCredit: 0,
  },
  {
    id: 4,
    cardNumber: '4916 **** **** 3388',
    cardHolder: 'Ana Martínez',
    userId: 'CLI-004',
    type: 'Visa Classic',
    status: 'Inactiva',
    expiryDate: '03/2027',
    lastActivity: 'No registrada',
    creditLimit: 3000,
    availableCredit: 3000,
  },
  {
    id: 5,
    cardNumber: '5327 **** **** 9145',
    cardHolder: 'Roberto Díaz',
    userId: 'CLI-005',
    type: 'Mastercard Gold',
    status: 'Activa',
    expiryDate: '07/2025',
    lastActivity: '2023-03-05',
    creditLimit: 7500,
    availableCredit: 4230.15,
  },
];

const CardManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState(sampleCards);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // En un escenario real, aquí se haría una petición a la API para obtener los resultados filtrados
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    // Filtrar por tipo de tarjeta
  };

  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
    // Filtrar por estado de tarjeta
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setFilterStatus('');
    setCards(sampleCards);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Activa':
        return 'success';
      case 'Bloqueada':
        return 'error';
      case 'Inactiva':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Buscar y Filtrar Tarjetas
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Buscar tarjeta"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Número, titular o ID de cliente"
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
              <InputLabel>Tipo de Tarjeta</InputLabel>
              <Select
                value={filterType}
                onChange={handleFilterTypeChange}
                label="Tipo de Tarjeta"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Visa">Visa</MenuItem>
                <MenuItem value="Mastercard">Mastercard</MenuItem>
                <MenuItem value="American Express">American Express</MenuItem>
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
                <MenuItem value="Activa">Activa</MenuItem>
                <MenuItem value="Bloqueada">Bloqueada</MenuItem>
                <MenuItem value="Inactiva">Inactiva</MenuItem>
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

      <TableContainer component={Paper}>
        <Table aria-label="tabla de tarjetas">
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Número de Tarjeta</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titular</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Cliente</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Exp.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Límite</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards.map((card) => (
              <TableRow key={card.id} hover>
                <TableCell>{card.cardNumber}</TableCell>
                <TableCell>{card.cardHolder}</TableCell>
                <TableCell>{card.userId}</TableCell>
                <TableCell>{card.type}</TableCell>
                <TableCell>
                  <Chip 
                    label={card.status} 
                    color={getStatusColor(card.status)} 
                    size="small"
                  />
                </TableCell>
                <TableCell>{card.expiryDate}</TableCell>
                <TableCell>${card.creditLimit.toLocaleString()}</TableCell>
                <TableCell>
                  <Box>
                    <IconButton size="small" color="primary" title="Ver detalles">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="warning" title="Editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" title="Bloquear">
                      <BlockIcon fontSize="small" />
                    </IconButton>
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

export default CardManagement; 