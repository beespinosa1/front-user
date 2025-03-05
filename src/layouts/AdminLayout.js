import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  MenuOpen as MenuOpenIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
  Block as BlockIcon,
  Payment as PaymentIcon,
  CardMembership as CardMembershipIcon,
  AddCard as AddCardIcon,
  ReceiptLong as ReceiptLongIcon,
  PointOfSale as PointOfSaleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  
  const menuOpen = Boolean(anchorEl);
  
  useEffect(() => {
    // Verificar si hay un token de administrador válido
    const adminToken = localStorage.getItem('adminToken');
    
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    
    // Obtener información del usuario administrador
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
    }
  }, [navigate]);
  
  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    // Limpiar datos de sesión
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };
  
  // Navegar a las diferentes secciones
  const navigateTo = (path) => {
    navigate(path);
  };
  
  const drawerWidth = 280;
  
  // Determinar qué elemento del menú está activo basado en la URL actual
  const isActive = (path) => {
    return window.location.pathname === path;
  };
  
  // Definición de los elementos del menú
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard'
    },
    {
      text: 'Consultar Tarjetas',
      icon: <CreditCardIcon />,
      path: '/admin/card-list'
    },
    {
      text: 'Bloquear Tarjetas',
      icon: <BlockIcon />,
      path: '/admin/card-blocking'
    },
    {
      text: 'Solicitar Tarjeta',
      icon: <AddCardIcon />,
      path: '/admin/card-request'
    },
    {
      text: 'Facturación',
      icon: <ReceiptIcon />,
      path: '/admin/billing'
    }
  ];
  
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Barra superior */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'primary.dark',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir cajón"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuOpenIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BanQuito - Panel Administrativo
          </Typography>
          
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="Perfil">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Menú de perfil */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 250 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ py: 1, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ width: 60, height: 60, mb: 1, bgcolor: 'primary.main' }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="subtitle1" fontWeight="bold">{adminUser?.nombre || 'Administrador'}</Typography>
          <Typography variant="body2" color="text.secondary">{adminUser?.rol || 'ADMIN'}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
      </Menu>
      
      {/* Cajón de navegación */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            ...(open ? { transform: 'translateX(0)' } : { transform: 'translateX(-100%)' }),
            transition: 'transform 0.3s ease-in-out',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem disablePadding key={item.path}>
                <ListItemButton 
                  selected={isActive(item.path)}
                  onClick={() => navigateTo(item.path)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      
      {/* Contenido principal - Aquí se renderizarán los componentes hijos */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout; 