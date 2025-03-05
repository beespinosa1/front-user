import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tabs,
  Tab
} from '@mui/material';
import {
  Menu as MenuIcon,
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Block as BlockIcon,
  AddCard as AddCardIcon,
  Payment as PaymentIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Store as StoreIcon
} from '@mui/icons-material';

// Componentes ficticios para las diferentes secciones
import CardManagement from './admin/CardManagement';
import TransactionHistory from './admin/TransactionHistory';
import BillingManagement from './admin/BillingManagement';
import CardBlocking from './admin/CardBlocking';
import CardRequests from './admin/CardRequests';

const drawerWidth = 280;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  // Verificar si hay una sesión de administrador activa
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUserStr = localStorage.getItem('adminUser');
    
    if (!adminToken || !adminUserStr) {
      console.log('No hay sesión de administrador, redirigiendo al login');
      navigate('/admin/login');
      return;
    }
    
    try {
      const adminUser = JSON.parse(adminUserStr);
      setUser(adminUser);
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const drawer = (
    <div>
      <Toolbar sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 2
      }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          BanQuito Admin
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
          Panel Administrativo
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ py: 2, px: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 1, mb: 1, fontWeight: 'bold' }}>
          GESTIÓN DE TARJETAS
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab(0)} selected={activeTab === 0}>
              <ListItemIcon>
                <CreditCardIcon color={activeTab === 0 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Consulta de Tarjetas" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab(1)} selected={activeTab === 1}>
              <ListItemIcon>
                <PaymentIcon color={activeTab === 1 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Transacciones" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab(2)} selected={activeTab === 2}>
              <ListItemIcon>
                <StoreIcon color={activeTab === 2 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Facturación a Comercios" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ py: 2, px: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ pl: 1, mb: 1, fontWeight: 'bold' }}>
          OPERACIONES
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab(3)} selected={activeTab === 3}>
              <ListItemIcon>
                <BlockIcon color={activeTab === 3 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Bloqueo de Tarjetas" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setActiveTab(4)} selected={activeTab === 4}>
              <ListItemIcon>
                <AddCardIcon color={activeTab === 4 ? "primary" : "inherit"} />
              </ListItemIcon>
              <ListItemText primary="Solicitudes de Tarjetas" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="error" />
              </ListItemIcon>
              <ListItemText primary="Cerrar Sesión" primaryTypographyProps={{ color: 'error.main' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: 3,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {activeTab === 0 && "Consulta de Tarjetas"}
            {activeTab === 1 && "Transacciones de Tarjetas"}
            {activeTab === 2 && "Facturación a Comercios"}
            {activeTab === 3 && "Bloqueo de Tarjetas"}
            {activeTab === 4 && "Solicitudes de Tarjetas"}
          </Typography>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {user && (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="cuenta del usuario"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuClick}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    Hola, {user.username}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>Mi Perfil</MenuItem>
                <MenuItem onClick={handleMenuClose}>Configuración</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="carpetas de correo"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejor rendimiento en dispositivos móviles
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f5f7fa', 
          minHeight: '100vh'
        }}
      >
        <Toolbar />
        <Box sx={{ mt: 2 }}>
          <TabPanel value={activeTab} index={0}>
            {/* Contenido de Consulta de Tarjetas */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Consulta de Tarjetas
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Visualice y gestione todas las tarjetas de crédito emitidas por el banco.
              </Typography>
            </Box>
            {/* Aquí iría el componente real */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Filtrar tarjetas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button variant="outlined" fullWidth>Por Cliente</Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button variant="outlined" fullWidth>Por Estado</Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button variant="outlined" fullWidth>Por Tipo</Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button variant="outlined" fullWidth>Por Fecha</Button>
                </Grid>
              </Grid>
            </Paper>
            <Box sx={{ height: '400px', bgcolor: 'background.paper', borderRadius: 1, p: 2, boxShadow: 1 }}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ pt: 10 }}>
                Aquí se mostrará la lista de tarjetas
              </Typography>
            </Box>
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            {/* Contenido de Transacciones */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Transacciones de Tarjetas
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Monitoree todas las transacciones realizadas con tarjetas de crédito.
              </Typography>
            </Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Filtrar transacciones
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Button variant="outlined" fullWidth>Por Tarjeta</Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button variant="outlined" fullWidth>Por Comercio</Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Button variant="outlined" fullWidth>Por Fecha</Button>
                </Grid>
              </Grid>
            </Paper>
            <Box sx={{ height: '400px', bgcolor: 'background.paper', borderRadius: 1, p: 2, boxShadow: 1 }}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ pt: 10 }}>
                Aquí se mostrará el historial de transacciones
              </Typography>
            </Box>
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            {/* Contenido de Facturación */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Facturación a Comercios
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Gestione los pagos pendientes a comercios por transacciones con tarjetas de crédito.
              </Typography>
            </Box>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} lg={3}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Pendiente de facturación
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      $54,321.00
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      8 comercios
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Facturado hoy
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      $12,567.50
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      3 comercios
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Comisiones generadas
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      $2,734.89
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Este mes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Card sx={{ height: '100%', bgcolor: 'primary.light', color: 'white', boxShadow: 2 }}>
                  <CardContent>
                    <Typography sx={{ opacity: 0.8 }} gutterBottom>
                      Facturación total
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      $178,945.32
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                      Acumulado mensual
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Comercios pendientes de facturación
              </Typography>
              <Box sx={{ height: '300px', bgcolor: 'background.paper', borderRadius: 1, p: 2, mt: 2 }}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ pt: 10 }}>
                  Aquí se mostrará la lista de comercios pendientes
                </Typography>
              </Box>
            </Paper>
          </TabPanel>
          
          <TabPanel value={activeTab} index={3}>
            {/* Contenido de Bloqueo */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Bloqueo de Tarjetas
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Gestione el bloqueo de tarjetas por robo, pérdida o fraude.
              </Typography>
            </Box>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Buscar tarjeta para bloquear
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Button variant="outlined" fullWidth>Por Número</Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button variant="contained" fullWidth color="error">
                    Bloquear
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            <Box sx={{ height: '300px', bgcolor: 'background.paper', borderRadius: 1, p: 2, boxShadow: 1 }}>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ pt: 10 }}>
                Aquí se mostrará el historial de tarjetas bloqueadas
              </Typography>
            </Box>
          </TabPanel>
          
          <TabPanel value={activeTab} index={4}>
            {/* Contenido de Solicitudes */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Solicitudes de Tarjetas
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Gestione las solicitudes de nuevas tarjetas de crédito.
              </Typography>
            </Box>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%', boxShadow: 2 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Nuevas solicitudes
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      12
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
                    <Typography variant="h4" component="div" fontWeight="bold">
                      8
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
                      5
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
                      3
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      No cumplen requisitos
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Solicitudes recientes
                </Typography>
                <Button variant="contained" startIcon={<AddCardIcon />}>
                  Nueva Solicitud
                </Button>
              </Box>
              <Box sx={{ height: '300px', bgcolor: 'background.paper', borderRadius: 1, p: 2, mt: 2 }}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ pt: 10 }}>
                  Aquí se mostrará la lista de solicitudes
                </Typography>
              </Box>
            </Paper>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 