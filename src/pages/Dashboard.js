import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Container, 
  Paper, 
  Grid,
  Button, 
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Link,
  Drawer,
  ListItemButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { 
  AccountCircle, 
  CreditCard, 
  AccountBalance, 
  Security, 
  Logout,
  Settings,
  Payment, 
  Receipt,
  ArrowUpward,
  ArrowDownward,
  Dashboard as DashboardIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCard, setSelectedCard] = useState(null);
  const [openCardDetail, setOpenCardDetail] = useState(false);
  const [openDifferDialog, setOpenDifferDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [differMonths, setDifferMonths] = useState(3);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Cargando...',
    email: '',
    lastLogin: new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  });

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('No hay usuario en localStorage, redirigiendo al login');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserData({
        ...userData,
        name: user.name || 'Usuario',
        email: user.email || 'usuario@banquito.com'
      });
      
      // Verificar si el usuario tiene rol de administrador
      if (user.role === 'admin') {
        setIsAdmin(true);
      }
      
      console.log('Usuario cargado desde localStorage:', user);
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
    }
  }, [navigate]);

  // Manejadores
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    setOpenLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    console.log('Cerrando sesión');
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setOpenLogoutDialog(false);
    navigate('/login');
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  const handleChangePassword = () => {
    navigate('/reset-password');
    handleClose();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const selectSection = (section) => {
    setActiveSection(section);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const accounts = [
    { id: 1, type: 'Cuenta Corriente', number: '****5678', balance: 12450.75 },
    { id: 2, type: 'Cuenta de Ahorros', number: '****1234', balance: 35680.20 }
  ];

  const creditCards = [
    { 
      id: 1, 
      type: 'Visa Platinum', 
      number: '****7890', 
      available: 5000, 
      used: 2300, 
      limit: 7300, 
      expiryDate: '05/25',
      paymentDate: '25/06/2023',
      cutoffDate: '10/06/2023',
      minimumPayment: 180.50,
      transactions: [
        { 
          id: 1, 
          date: '2023-05-05', 
          description: 'Supermercado XYZ', 
          amount: 150.75, 
          installments: { total: 3, paid: 1, amount: 50.25 },
          eligible: true
        },
        { 
          id: 2, 
          date: '2023-05-10', 
          description: 'Farmacia ABC', 
          amount: 85.20, 
          installments: null,
          eligible: true
        },
        { 
          id: 3, 
          date: '2023-05-12', 
          description: 'Tienda de Electrónicos', 
          amount: 1200.00, 
          installments: { total: 12, paid: 2, amount: 100.00 },
          eligible: false
        }
      ]
    },
    { 
      id: 2, 
      type: 'Mastercard Gold', 
      number: '****4321', 
      available: 3500, 
      used: 1500, 
      limit: 5000, 
      expiryDate: '12/26',
      paymentDate: '20/06/2023',
      cutoffDate: '05/06/2023',
      minimumPayment: 120.00,
      transactions: [
        { 
          id: 1, 
          date: '2023-05-02', 
          description: 'Restaurante Gourmet', 
          amount: 95.50, 
          installments: null,
          eligible: true
        },
        { 
          id: 2, 
          date: '2023-05-08', 
          description: 'Mueblería Hogar', 
          amount: 850.00, 
          installments: { total: 6, paid: 1, amount: 141.67 },
          eligible: true
        }
      ]
    }
  ];

  const recentTransactions = [
    { id: 1, date: '2023-05-15', description: 'Pago Servicios', amount: -120.50, type: 'debit' },
    { id: 2, date: '2023-05-14', description: 'Depósito Salario', amount: 2500.00, type: 'credit' },
    { id: 3, date: '2023-05-10', description: 'Compra Supermercado', amount: -85.75, type: 'debit' }
  ];

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleCardDetails = (card) => {
    setSelectedCard(card);
    setOpenCardDetail(true);
  };

  const handleCloseCardDetail = () => {
    setOpenCardDetail(false);
  };

  const handleDifferPayment = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenDifferDialog(true);
  };

  const handleCloseDifferDialog = () => {
    setOpenDifferDialog(false);
  };

  const handleConfirmDiffer = () => {
    console.log(`Confirmar diferido para transacción ${selectedTransaction.id} en ${differMonths} cuotas`);
    // Aquí se implementaría la lógica para confirmar el diferido
    
    // Simulando actualización del estado
    if (selectedCard) {
      const updatedCards = creditCards.map(card => {
        if (card.id === selectedCard.id) {
          const updatedTransactions = card.transactions.map(transaction => {
            if (transaction.id === selectedTransaction.id) {
              return {
                ...transaction,
                installments: {
                  total: differMonths,
                  paid: 0,
                  amount: parseFloat((transaction.amount / differMonths).toFixed(2))
                },
                eligible: false
              };
            }
            return transaction;
          });
          
          const updatedCard = {
            ...card,
            transactions: updatedTransactions
          };
          
          setSelectedCard(updatedCard);
          return updatedCard;
        }
        return card;
      });
      
      // En una aplicación real, esto se manejaría con un estado global o llamadas a API
      console.log('Tarjetas actualizadas:', updatedCards);
    }
    
    setOpenDifferDialog(false);
  };

  // Contenido del menú lateral
  const drawerContent = (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden', // Evita scrollbars en el contenedor principal
      pb: 0 // Asegurar que no haya padding en la parte inferior
    }}>
      {/* Header del drawer - Información del usuario */}
      <Box
        sx={{
          p: 1,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar
          alt={userData.name}
          src="/static/avatar.jpg"
          sx={{ width: 50, height: 50, mb: 0.5, border: '2px solid white' }}
        />
        <Typography variant="subtitle2" align="center" sx={{ fontWeight: 'bold', lineHeight: 1.1, mb: 0.5 }}>
          {userData.name}
        </Typography>
        <Typography variant="caption" align="center" sx={{ opacity: 0.8, fontSize: '0.7rem', lineHeight: 1 }}>
          Última conexión: {userData.lastLogin.split(',')[0]}
        </Typography>
      </Box>

      <Divider />

      {/* Área de navegación con scroll solo si es necesario */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        minHeight: 0, // Crucial para que flexbox permita que este elemento se encoja
        pb: 1 // Padding en la parte inferior para separar del footer
      }}>
        <List component="nav" sx={{ pt: 1, pb: 1 }}>
          <ListItemButton 
            selected={activeSection === 'dashboard'} 
            onClick={() => selectSection('dashboard')}
            sx={{ 
              py: 0.5,
              borderRadius: 1,
              mx: 1,
              minHeight: 36,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.main',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}> {/* Reduce el ancho del icono */}
              <DashboardIcon sx={{ color: activeSection === 'dashboard' ? 'white' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Inicio" primaryTypographyProps={{ fontSize: '0.95rem' }} />
          </ListItemButton>

          <ListItemButton 
            selected={activeSection === 'accounts'} 
            onClick={() => selectSection('accounts')}
            sx={{ 
              py: 0.5,
              borderRadius: 1,
              mx: 1,
              minHeight: 36,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.main',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AccountBalance sx={{ color: activeSection === 'accounts' ? 'white' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Cuentas" primaryTypographyProps={{ fontSize: '0.95rem' }} />
          </ListItemButton>

          <ListItemButton 
            selected={activeSection === 'creditCards'} 
            onClick={() => selectSection('creditCards')}
            sx={{ 
              py: 0.5,
              borderRadius: 1,
              mx: 1,
              minHeight: 36,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.main',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CreditCard sx={{ color: activeSection === 'creditCards' ? 'white' : 'inherit' }} />
            </ListItemIcon>
            <ListItemText primary="Tarjetas de Crédito" primaryTypographyProps={{ fontSize: '0.95rem' }} />
          </ListItemButton>

          {/* Sección de administración, visible solo para usuarios admin */}
          {isAdmin && (
            <>
              <Divider sx={{ my: 1.5, mx: 1 }} />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ px: 2, py: 0.5, display: 'block', fontWeight: 'bold' }}
              >
                ADMINISTRACIÓN
              </Typography>
              
              <ListItemButton 
                selected={activeSection === 'admin'} 
                onClick={() => navigate('/admin')} // Navega directamente a la página de administración
                sx={{ 
                  py: 0.5,
                  borderRadius: 1,
                  mx: 1,
                  minHeight: 36,
                  bgcolor: 'secondary.light',
                  '&.Mui-selected': {
                    bgcolor: 'secondary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'secondary.dark',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'secondary.main',
                    color: 'white',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Settings sx={{ color: activeSection === 'admin' ? 'white' : 'inherit' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Panel Administrativo" 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
                    fontWeight: 'medium',
                    color: activeSection === 'admin' ? 'white' : 'inherit'
                  }} 
                />
              </ListItemButton>
            </>
          )}
        </List>
      </Box>

      {/* Footer con botones - Siempre visible */}
      <Box 
        sx={{ 
          px: 1, // Solo padding horizontal
          pt: 0.75, // Menos padding arriba
          pb: 0.75, // Menos padding abajo
          borderTop: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          mt: 'auto',
          flexShrink: 0, // Impide que se encoja
          width: '100%' // Asegura que ocupe todo el ancho
        }}
      >
        <Button 
          variant="outlined" 
          fullWidth 
          startIcon={<Security fontSize="small" />} // Icono más pequeño
          onClick={handleChangePassword}
          sx={{ mb: 0.75, py: 0.5 }} // Botón aún más compacto
          size="small"
        >
          Cambiar Contraseña
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          fullWidth 
          startIcon={<Logout fontSize="small" />} // Icono más pequeño
          onClick={handleLogoutClick}
          sx={{ py: 0.5 }} // Reducido padding vertical
          size="small"
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  // Renderizar el contenido principal según la sección activa
  const renderMainContent = () => {
    switch (activeSection) {
      case 'accounts':
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              Mis Cuentas
            </Typography>
            
            <Grid container spacing={3}>
              {accounts.map(account => (
                <Grid item xs={12} md={6} key={account.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {account.type}
                      </Typography>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                        {formatCurrency(account.balance)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        N° de cuenta: {account.number}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<Payment />}>Ver Movimientos</Button>
                      <Button size="small" startIcon={<Receipt />}>Estado de Cuenta</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 'creditCards':
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              Mis Tarjetas de Crédito
            </Typography>
            
            <Grid container spacing={3}>
              {creditCards.map(card => (
                <Grid item xs={12} md={6} key={card.id}>
                  <Card variant="outlined" sx={{ position: 'relative', overflow: 'visible' }}>
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: -15, 
                        right: 20, 
                        height: 50, 
                        width: 80,
                        backgroundImage: card.type.includes('Visa') 
                          ? 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png)'
                          : 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png)',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                      }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {card.type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        N° de tarjeta: {card.number} | Vence: {card.expiryDate}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Disponible</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            {formatCurrency(card.available)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">Utilizado</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                            {formatCurrency(card.used)}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="body2">
                          Límite de crédito: {formatCurrency(card.limit)}
                        </Typography>
                        <Box
                          sx={{
                            mt: 1,
                            height: 8,
                            borderRadius: 5,
                            bgcolor: 'grey.200',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              height: '100%',
                              width: `${(card.used / card.limit) * 100}%`,
                              bgcolor: 'error.main',
                              borderRadius: 5
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Fecha de corte</Typography>
                          <Typography variant="body2" fontWeight="medium">{card.cutoffDate}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Fecha de pago</Typography>
                          <Typography variant="body2" fontWeight="medium">{card.paymentDate}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">Pago mínimo</Typography>
                          <Typography variant="body2" fontWeight="medium">{formatCurrency(card.minimumPayment)}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<Payment />}>Pagar</Button>
                      <Button 
                        size="small" 
                        startIcon={<Receipt />}
                        onClick={() => handleCardDetails(card)}
                      >
                        Ver Movimientos
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      default: // Dashboard/inicio
        return (
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              Resumen de Cuenta
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">Total en Cuentas</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {formatCurrency(48130.95)}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold">Disponible en Tarjetas</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {formatCurrency(8500)}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Movimientos Recientes
                  </Typography>
                  
                  <List>
                    {recentTransactions.map((transaction) => (
                      <React.Fragment key={transaction.id}>
                        <ListItem>
                          <ListItemIcon>
                            <Avatar sx={{ bgcolor: transaction.type === 'credit' ? 'success.light' : 'error.light' }}>
                              {transaction.type === 'credit' ? <ArrowDownward /> : <ArrowUpward />}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText
                            primary={transaction.description}
                            secondary={new Date(transaction.date).toLocaleDateString()}
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              color: transaction.type === 'credit' ? 'success.main' : 'error.main',
                              fontWeight: 'bold'
                            }}
                          >
                            {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                          </Typography>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button variant="outlined">Ver más movimientos</Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="abrir menú"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                bgcolor: 'secondary.main', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                mr: 2,
              }}
            >
              <Typography variant="h6" color="black" fontWeight="bold">BQ</Typography>
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Banco BanQuito
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
              {userData.name}
            </Typography>
            <IconButton
              size="large"
              aria-label="cuenta del usuario"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar 
                alt={userData.name}
                src="/static/avatar.jpg"
                sx={{ width: 40, height: 40 }}
              />
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
              onClose={handleClose}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">{userData.name}</Typography>
                <Typography variant="body2" color="text.secondary">{userData.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleChangePassword}>
                <ListItemIcon>
                  <Security fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cambiar Contraseña</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogoutClick}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Cerrar Sesión</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú lateral */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 280,
          flexShrink: 0,
          overflow: 'hidden',
          [`& .MuiDrawer-paper`]: { 
            width: 280, 
            boxSizing: 'border-box',
            top: ['56px', '64px'],
            height: { xs: 'calc(100% - 56px)', md: 'calc(100% - 64px)' },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden', // Crucial para evitar el scrollbar
            pb: 0 // Sin padding en la parte inferior
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 280px)` },
          ml: { sm: `280px` },
          mt: ['56px', '64px']
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
          {renderMainContent()}
        </Container>
      </Box>

      {/* Pie de página */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: 'primary.dark', 
          color: 'white', 
          mt: 'auto',
          width: { sm: `calc(100% - 280px)` },
          ml: { sm: `280px` }
        }}
      >
        <Container>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} Banco BanQuito. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>

      {/* Modal de confirmación para cerrar sesión */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar cierre de sesión
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro de que desea cerrar la sesión actual?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" autoFocus>
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para mostrar detalles de la tarjeta y sus movimientos */}
      <Dialog
        open={openCardDetail}
        onClose={handleCloseCardDetail}
        maxWidth="md"
        fullWidth
      >
        {selectedCard && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Movimientos de Tarjeta</Typography>
                <Box 
                  sx={{ 
                    height: 40, 
                    width: 60,
                    backgroundImage: selectedCard.type.includes('Visa') 
                      ? 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/1200px-Visa.svg.png)'
                      : 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                />
              </Box>
              <Typography variant="subtitle2" color="text.secondary">
                {selectedCard.type} | {selectedCard.number}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', color: 'white', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption">Fecha de corte</Typography>
                    <Typography variant="body1" fontWeight="bold">{selectedCard.cutoffDate}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption">Fecha de pago</Typography>
                    <Typography variant="body1" fontWeight="bold">{selectedCard.paymentDate}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption">Pago mínimo</Typography>
                    <Typography variant="body1" fontWeight="bold">{formatCurrency(selectedCard.minimumPayment)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Typography variant="h6" gutterBottom>Últimos Movimientos</Typography>
              
              <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell>Plan de cuotas</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedCard.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell align="right">{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>
                          {transaction.installments ? (
                            <Box>
                              <Typography variant="body2">
                                {transaction.installments.paid} de {transaction.installments.total} cuotas
                              </Typography>
                              <LinearProgress 
                                variant="determinate" 
                                value={(transaction.installments.paid / transaction.installments.total) * 100}
                                sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {formatCurrency(transaction.installments.amount)}/mes
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">Pago único</Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {!transaction.installments && transaction.eligible ? (
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="primary"
                              onClick={() => handleDifferPayment(transaction)}
                            >
                              Diferir Pago
                            </Button>
                          ) : (
                            transaction.installments ? (
                              <Chip 
                                label="En cuotas" 
                                size="small" 
                                color="secondary" 
                                variant="outlined" 
                              />
                            ) : (
                              <Chip 
                                label="No elegible" 
                                size="small" 
                                color="default" 
                                variant="outlined" 
                                disabled 
                              />
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCardDetail}>Cerrar</Button>
              <Button variant="contained" color="primary">
                Pagar Tarjeta
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Dialog para solicitar diferido */}
      <Dialog 
        open={openDifferDialog} 
        onClose={handleCloseDifferDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedTransaction && (
          <>
            <DialogTitle>
              Solicitar Diferido de Pago
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Detalles de la transacción
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Fecha</Typography>
                    <Typography variant="body1">{new Date(selectedTransaction.date).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Monto</Typography>
                    <Typography variant="body1" fontWeight="bold">{formatCurrency(selectedTransaction.amount)}</Typography>
                  </Grid>
                </Grid>
                
                <Typography variant="body1" gutterBottom>
                  {selectedTransaction.description}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Seleccionar número de cuotas
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <RadioGroup
                  row
                  value={differMonths}
                  onChange={(e) => setDifferMonths(parseInt(e.target.value))}
                >
                  {[3, 6, 9, 12, 18, 24].map((months) => (
                    <FormControlLabel 
                      key={months}
                      value={months}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body2">{months} meses</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatCurrency(selectedTransaction.amount / months)}/mes
                          </Typography>
                        </Box>
                      }
                      sx={{ 
                        border: '1px solid',
                        borderColor: differMonths === months ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        m: 0.5,
                        p: 1,
                        flexGrow: 1,
                        maxWidth: 'calc(33% - 16px)'
                      }}
                    />
                  ))}
                </RadioGroup>
              </Box>
              
              <Paper variant="outlined" sx={{ mt: 3, p: 2, bgcolor: 'primary.50' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Resumen del diferido
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Monto total:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">{formatCurrency(selectedTransaction.amount)}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Número de cuotas:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right">{differMonths}</Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Valor por cuota:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" align="right" fontWeight="bold">
                      {formatCurrency(selectedTransaction.amount / differMonths)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  * La primera cuota se cargará en el siguiente corte de su tarjeta.
                </Typography>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDifferDialog}>Cancelar</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleConfirmDiffer}
              >
                Confirmar Diferido
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Dashboard; 