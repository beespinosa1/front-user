import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Tooltip,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Receipt as ReceiptIcon,
  Store as StoreIcon,
  AccountBalance as AccountBalanceIcon,
  DateRange as DateRangeIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';

// Datos de ejemplo para comercios
const comerciosEjemplo = [
  { 
    id: 1, 
    nombre: 'Supermercado El Ahorro', 
    ruc: '1234567890', 
    categoria: 'Supermercado', 
    direccion: 'Av. Principal 123',
    telefono: '555-123-4567',
    email: 'contacto@elahorro.com',
    cuenta: '9876-5432-1098',
    fechaAfiliacion: '2020-03-15'
  },
  { 
    id: 2, 
    nombre: 'Restaurante La Buena Mesa', 
    ruc: '0987654321', 
    categoria: 'Restaurante', 
    direccion: 'Calle Secundaria 456',
    telefono: '555-456-7890',
    email: 'info@labuenamesa.com',
    cuenta: '1234-5678-9012',
    fechaAfiliacion: '2019-07-22'
  },
  { 
    id: 3, 
    nombre: 'Farmacia Salud Total', 
    ruc: '5678901234', 
    categoria: 'Farmacia', 
    direccion: 'Plaza Central 789',
    telefono: '555-789-0123',
    email: 'ventas@saludtotal.com',
    cuenta: '5555-6666-7777',
    fechaAfiliacion: '2021-01-10'
  },
  { 
    id: 4, 
    nombre: 'Tienda de Ropa Fashion', 
    ruc: '4321098765', 
    categoria: 'Ropa', 
    direccion: 'Centro Comercial, Local 45',
    telefono: '555-321-6540',
    email: 'ventas@fashion.com',
    cuenta: '1111-2222-3333',
    fechaAfiliacion: '2018-11-05'
  },
  { 
    id: 5, 
    nombre: 'Gasolinera Rápido', 
    ruc: '9876543210', 
    categoria: 'Combustible', 
    direccion: 'Autopista Principal Km 5',
    telefono: '555-987-6543',
    email: 'servicio@rapido.com',
    cuenta: '4444-5555-6666',
    fechaAfiliacion: '2020-09-30'
  },
];

// Datos de ejemplo para transacciones
const generarTransaccionesEjemplo = (comercioId) => {
  const cantidadTransacciones = Math.floor(Math.random() * 15) + 5; // Entre 5 y 20 transacciones
  const transacciones = [];
  
  const estados = ['APROBADA', 'RECHAZADA', 'PENDIENTE'];
  const tiposTransaccion = ['DÉBITO', 'CRÉDITO'];
  
  // Generar fecha aleatoria en el último mes
  const generarFechaReciente = () => {
    const hoy = new Date();
    const unMesAtras = new Date();
    unMesAtras.setMonth(hoy.getMonth() - 1);
    const tiempoAleatorio = unMesAtras.getTime() + Math.random() * (hoy.getTime() - unMesAtras.getTime());
    return new Date(tiempoAleatorio);
  };
  
  for (let i = 0; i < cantidadTransacciones; i++) {
    const monto = Math.floor(Math.random() * 200000) + 1000; // Entre 1000 y 201000
    const estado = estados[Math.floor(Math.random() * estados.length)];
    const tipo = tiposTransaccion[Math.floor(Math.random() * tiposTransaccion.length)];
    const fecha = generarFechaReciente();
    
    transacciones.push({
      id: `${comercioId}-${i + 1}`,
      comercioId,
      fecha,
      monto,
      estado,
      tipo,
      numeroTarjeta: `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      titular: 'Cliente ' + Math.floor(Math.random() * 100),
      referencia: `REF-${Math.floor(100000 + Math.random() * 900000)}`
    });
  }
  
  // Ordenar por fecha, más reciente primero
  return transacciones.sort((a, b) => b.fecha - a.fecha);
};

const Billing = () => {
  // Estado para comercios
  const [comercios, setComercios] = useState([]);
  const [comerciosFiltrados, setComerciosFiltrados] = useState([]);
  const [comercioSeleccionado, setComercioSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  
  // Estado para transacciones
  const [transacciones, setTransacciones] = useState([]);
  const [transaccionesFiltradas, setTransaccionesFiltradas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  
  // Estado para la UI
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [detalleDialogOpen, setDetalleDialogOpen] = useState(false);
  const [transaccionSeleccionada, setTransaccionSeleccionada] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  
  // Cargar datos iniciales
  useEffect(() => {
    cargarComercios();
  }, []);
  
  // Aplicar filtros cuando cambian
  useEffect(() => {
    filtrarComercios();
  }, [comercios, searchTerm, categoriaFiltro]);
  
  // Filtrar transacciones cuando cambian los filtros
  useEffect(() => {
    filtrarTransacciones();
  }, [transacciones, fechaInicio, fechaFin, estadoFiltro, tipoFiltro]);
  
  // Cargar comercios
  const cargarComercios = () => {
    setIsLoading(true);
    
    // Simulación de carga desde API
    setTimeout(() => {
      setComercios(comerciosEjemplo);
      setComerciosFiltrados(comerciosEjemplo);
      setIsLoading(false);
    }, 1000);
  };
  
  // Filtrar comercios según búsqueda y categoría
  const filtrarComercios = () => {
    let resultado = [...comercios];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      resultado = resultado.filter(
        comercio => 
          comercio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comercio.ruc.includes(searchTerm)
      );
    }
    
    // Filtrar por categoría
    if (categoriaFiltro) {
      resultado = resultado.filter(comercio => comercio.categoria === categoriaFiltro);
    }
    
    setComerciosFiltrados(resultado);
  };
  
  // Seleccionar un comercio
  const seleccionarComercio = (comercio) => {
    setComercioSeleccionado(comercio);
    cargarTransaccionesComercio(comercio.id);
    setTabValue(1); // Cambiar a la pestaña de transacciones
  };
  
  // Cargar transacciones de un comercio
  const cargarTransaccionesComercio = (comercioId) => {
    setIsLoading(true);
    
    // Simulación de carga desde API
    setTimeout(() => {
      const transaccionesGeneradas = generarTransaccionesEjemplo(comercioId);
      setTransacciones(transaccionesGeneradas);
      setTransaccionesFiltradas(transaccionesGeneradas);
      setIsLoading(false);
    }, 1000);
  };
  
  // Filtrar transacciones
  const filtrarTransacciones = () => {
    if (!transacciones.length) return;
    
    let resultado = [...transacciones];
    
    // Filtrar por fecha de inicio
    if (fechaInicio) {
      resultado = resultado.filter(
        transaccion => new Date(transaccion.fecha) >= fechaInicio
      );
    }
    
    // Filtrar por fecha de fin
    if (fechaFin) {
      const finDelDia = new Date(fechaFin);
      finDelDia.setHours(23, 59, 59, 999);
      
      resultado = resultado.filter(
        transaccion => new Date(transaccion.fecha) <= finDelDia
      );
    }
    
    // Filtrar por estado
    if (estadoFiltro) {
      resultado = resultado.filter(
        transaccion => transaccion.estado === estadoFiltro
      );
    }
    
    // Filtrar por tipo
    if (tipoFiltro) {
      resultado = resultado.filter(
        transaccion => transaccion.tipo === tipoFiltro
      );
    }
    
    setTransaccionesFiltradas(resultado);
  };
  
  // Cambiar pestaña
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Limpiar filtros de comercios
  const limpiarFiltrosComercios = () => {
    setSearchTerm('');
    setCategoriaFiltro('');
  };
  
  // Limpiar filtros de transacciones
  const limpiarFiltrosTransacciones = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setEstadoFiltro('');
    setTipoFiltro('');
  };
  
  // Ver detalle de transacción
  const verDetalleTransaccion = (transaccion) => {
    setTransaccionSeleccionada(transaccion);
    setDetalleDialogOpen(true);
  };
  
  // Cerrar diálogo de detalle
  const cerrarDetalleDialog = () => {
    setDetalleDialogOpen(false);
  };
  
  // Generar factura (simulado)
  const generarFactura = () => {
    if (!comercioSeleccionado) return;
    
    setIsLoading(true);
    
    // Simulación de generación de factura
    setTimeout(() => {
      setIsLoading(false);
      mostrarAlerta('Factura generada correctamente. Se ha enviado por correo al comercio.', 'success');
    }, 1500);
  };
  
  // Descargar reporte CSV (simulado)
  const descargarCSV = () => {
    if (!transaccionesFiltradas.length) return;
    
    setIsLoading(true);
    
    // Simulación de descarga
    setTimeout(() => {
      setIsLoading(false);
      mostrarAlerta('Reporte CSV descargado correctamente', 'success');
    }, 1000);
  };
  
  // Imprimir reporte (simulado)
  const imprimirReporte = () => {
    if (!transaccionesFiltradas.length) return;
    
    setIsLoading(true);
    
    // Simulación de impresión
    setTimeout(() => {
      setIsLoading(false);
      mostrarAlerta('Reporte enviado a impresión', 'success');
    }, 1000);
  };
  
  // Mostrar alerta
  const mostrarAlerta = (mensaje, severidad = 'info') => {
    setAlertMessage(mensaje);
    setAlertSeverity(severidad);
    setAlertOpen(true);
  };
  
  // Cerrar alerta
  const handleCloseAlert = () => {
    setAlertOpen(false);
  };
  
  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };
  
  // Formatear hora
  const formatearHora = (fecha) => {
    if (!fecha) return '';
    const opciones = { hour: '2-digit', minute: '2-digit' };
    return new Date(fecha).toLocaleTimeString('es-ES', opciones);
  };
  
  // Formatear monto
  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(monto);
  };
  
  // Obtener categorías únicas para el filtro
  const categoriasUnicas = [...new Set(comercios.map(comercio => comercio.categoria))];
  
  // Calcular totales de transacciones
  const calcularTotales = () => {
    if (!transaccionesFiltradas.length) return { cantidad: 0, montoTotal: 0 };
    
    const montoTotal = transaccionesFiltradas.reduce((total, transaccion) => {
      // Sumar solo transacciones aprobadas
      if (transaccion.estado === 'APROBADA') {
        return total + transaccion.monto;
      }
      return total;
    }, 0);
    
    return {
      cantidad: transaccionesFiltradas.length,
      montoTotal
    };
  };
  
  const totales = calcularTotales();
  
  return (
    <Box>
      <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3 }}>
        Facturación de Comercios
      </Typography>
      
      {/* Indicador de carga */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      
      {/* Pestañas */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Comercios" icon={<StoreIcon />} iconPosition="start" />
          <Tab 
            label="Transacciones" 
            icon={<ReceiptIcon />} 
            iconPosition="start" 
            disabled={!comercioSeleccionado}
          />
        </Tabs>
      </Paper>
      
      {/* Contenido de pestañas */}
      <Box role="tabpanel" hidden={tabValue !== 0}>
        {tabValue === 0 && (
          <>
            {/* Panel de filtros para comercios */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Buscar comercio"
                    placeholder="Nombre o RUC"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={categoriaFiltro}
                      onChange={(e) => setCategoriaFiltro(e.target.value)}
                      label="Categoría"
                    >
                      <MenuItem value="">Todas</MenuItem>
                      {categoriasUnicas.map((categoria) => (
                        <MenuItem key={categoria} value={categoria}>
                          {categoria}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={limpiarFiltrosComercios}
                      startIcon={<FilterListIcon />}
                    >
                      Limpiar
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={cargarComercios}
                      startIcon={<RefreshIcon />}
                    >
                      Actualizar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Lista de comercios */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>RUC</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Categoría</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Dirección</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Afiliación</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comerciosFiltrados.length > 0 ? (
                    comerciosFiltrados.map((comercio) => (
                      <TableRow key={comercio.id} hover>
                        <TableCell>{comercio.nombre}</TableCell>
                        <TableCell>{comercio.ruc}</TableCell>
                        <TableCell>
                          <Chip label={comercio.categoria} size="small" />
                        </TableCell>
                        <TableCell>{comercio.direccion}</TableCell>
                        <TableCell>{formatearFecha(comercio.fechaAfiliacion)}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => seleccionarComercio(comercio)}
                            startIcon={<VisibilityIcon />}
                          >
                            Ver Transacciones
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        {isLoading 
                          ? 'Cargando comercios...' 
                          : 'No se encontraron comercios con los filtros seleccionados'
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
      
      <Box role="tabpanel" hidden={tabValue !== 1}>
        {tabValue === 1 && comercioSeleccionado && (
          <>
            {/* Información del comercio seleccionado */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StoreIcon color="primary" sx={{ fontSize: 36, mr: 2 }} />
                <Typography variant="h6">
                  {comercioSeleccionado.nombre}
                </Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">RUC:</Typography>
                  <Typography variant="body1">{comercioSeleccionado.ruc}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Categoría:</Typography>
                  <Typography variant="body1">{comercioSeleccionado.categoria}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Teléfono:</Typography>
                  <Typography variant="body1">{comercioSeleccionado.telefono}</Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="body2" color="text.secondary">Dirección:</Typography>
                  <Typography variant="body1">{comercioSeleccionado.direccion}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body1">{comercioSeleccionado.email}</Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => setTabValue(0)}
                >
                  Volver a Comercios
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ReceiptIcon />}
                  onClick={generarFactura}
                  disabled={isLoading}
                >
                  Generar Factura
                </Button>
              </Box>
            </Paper>
            
            {/* Panel de filtros para transacciones */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Filtrar Transacciones
              </Typography>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <FilterListIcon sx={{ mr: 2 }} />
                  <Typography>Filtros Avanzados</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Fecha Inicio"
                        type="date"
                        value={fechaInicio ? fechaInicio.toISOString().split('T')[0] : ''}
                        onChange={(e) => setFechaInicio(e.target.value ? new Date(e.target.value) : null)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Fecha Fin"
                        type="date"
                        value={fechaFin ? fechaFin.toISOString().split('T')[0] : ''}
                        onChange={(e) => setFechaFin(e.target.value ? new Date(e.target.value) : null)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: fechaInicio ? fechaInicio.toISOString().split('T')[0] : '' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Estado</InputLabel>
                        <Select
                          value={estadoFiltro}
                          onChange={(e) => setEstadoFiltro(e.target.value)}
                          label="Estado"
                        >
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="APROBADA">Aprobada</MenuItem>
                          <MenuItem value="RECHAZADA">Rechazada</MenuItem>
                          <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Tipo</InputLabel>
                        <Select
                          value={tipoFiltro}
                          onChange={(e) => setTipoFiltro(e.target.value)}
                          label="Tipo"
                        >
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="DÉBITO">Débito</MenuItem>
                          <MenuItem value="CRÉDITO">Crédito</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          variant="outlined"
                          onClick={limpiarFiltrosTransacciones}
                        >
                          Limpiar Filtros
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => cargarTransaccionesComercio(comercioSeleccionado.id)}
                          startIcon={<RefreshIcon />}
                        >
                          Actualizar
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Paper>
            
            {/* Resumen de transacciones */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Transacciones encontradas
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {totales.cantidad}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Monto Total (Aprobadas)
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                      {formatearMonto(totales.montoTotal)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Descargar CSV">
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={descargarCSV}
                          disabled={!transaccionesFiltradas.length}
                        >
                          CSV
                        </Button>
                      </Tooltip>
                      <Tooltip title="Imprimir">
                        <Button
                          variant="outlined"
                          startIcon={<PrintIcon />}
                          onClick={imprimirReporte}
                          disabled={!transaccionesFiltradas.length}
                        >
                          Imprimir
                        </Button>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Tabla de transacciones */}
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Hora</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tarjeta</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titular</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transaccionesFiltradas.length > 0 ? (
                    transaccionesFiltradas.map((transaccion) => (
                      <TableRow key={transaccion.id} hover>
                        <TableCell>{formatearFecha(transaccion.fecha)}</TableCell>
                        <TableCell>{formatearHora(transaccion.fecha)}</TableCell>
                        <TableCell>{transaccion.numeroTarjeta}</TableCell>
                        <TableCell>{transaccion.titular}</TableCell>
                        <TableCell>{formatearMonto(transaccion.monto)}</TableCell>
                        <TableCell>
                          <Chip 
                            label={transaccion.tipo} 
                            color={transaccion.tipo === 'CRÉDITO' ? 'info' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={transaccion.estado} 
                            color={
                              transaccion.estado === 'APROBADA' ? 'success' : 
                              transaccion.estado === 'RECHAZADA' ? 'error' : 
                              'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => verDetalleTransaccion(transaccion)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {isLoading 
                          ? 'Cargando transacciones...' 
                          : 'No se encontraron transacciones con los filtros seleccionados'
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
      
      {/* Diálogo de detalle de transacción */}
      <Dialog
        open={detalleDialogOpen}
        onClose={cerrarDetalleDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalle de Transacción
        </DialogTitle>
        <DialogContent dividers>
          {transaccionSeleccionada && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceIcon sx={{ mr: 1 }} />
                  Información de la Transacción
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">ID Referencia:</Typography>
                  <Typography variant="body1" fontWeight="medium">{transaccionSeleccionada.referencia}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Fecha y Hora:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatearFecha(transaccionSeleccionada.fecha)} - {formatearHora(transaccionSeleccionada.fecha)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Estado:</Typography>
                  <Chip 
                    label={transaccionSeleccionada.estado} 
                    color={
                      transaccionSeleccionada.estado === 'APROBADA' ? 'success' : 
                      transaccionSeleccionada.estado === 'RECHAZADA' ? 'error' : 
                      'warning'
                    }
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Tipo de Transacción:</Typography>
                  <Typography variant="body1" fontWeight="medium">{transaccionSeleccionada.tipo}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <CreditCardIcon sx={{ mr: 1 }} />
                  Información del Pago
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Monto:</Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    {formatearMonto(transaccionSeleccionada.monto)}
                  </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Número de Tarjeta:</Typography>
                  <Typography variant="body1" fontWeight="medium">{transaccionSeleccionada.numeroTarjeta}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Titular:</Typography>
                  <Typography variant="body1" fontWeight="medium">{transaccionSeleccionada.titular}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Comercio:</Typography>
                  <Typography variant="body1" fontWeight="medium">{comercioSeleccionado?.nombre}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDetalleDialog}>
            Cerrar
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<PrintIcon />}
            onClick={() => {
              cerrarDetalleDialog();
              mostrarAlerta('Recibo enviado a impresión', 'success');
            }}
          >
            Imprimir Recibo
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para alertas */}
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

export default Billing; 