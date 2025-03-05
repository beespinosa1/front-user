import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Block as BlockIcon,
  Receipt as ReceiptIcon,
  Add as AddIcon,
  CardMembership as CardMembershipIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Navegar a las diferentes secciones
  const navigateTo = (path) => {
    navigate(path);
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Panel Administrativo de Tarjetas
      </Typography>
      
      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <CreditCardIcon />
                </Avatar>
                <Typography variant="h6">Tarjetas Activas</Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                1,256
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                  <BlockIcon />
                </Avatar>
                <Typography variant="h6">Tarjetas Bloqueadas</Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                34
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <ReceiptIcon />
                </Avatar>
                <Typography variant="h6">Transacciones (Hoy)</Typography>
              </Box>
              <Typography variant="h3" component="div" fontWeight="bold">
                527
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Accesos Rápidos */}
      <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
        Acciones Rápidas
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ py: 2, display: 'flex', flexDirection: 'column', height: '100%' }}
            onClick={() => navigateTo('/admin/cards')}
          >
            <CreditCardIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography>Consultar Tarjetas</Typography>
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ py: 2, display: 'flex', flexDirection: 'column', height: '100%' }}
            onClick={() => navigateTo('/admin/card-blocking')}
          >
            <BlockIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography>Bloquear Tarjetas</Typography>
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ py: 2, display: 'flex', flexDirection: 'column', height: '100%' }}
            onClick={() => navigateTo('/admin/transactions')}
          >
            <ReceiptIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography>Transacciones</Typography>
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button 
            variant="outlined" 
            fullWidth 
            sx={{ py: 2, display: 'flex', flexDirection: 'column', height: '100%' }}
            onClick={() => navigateTo('/admin/billing')}
          >
            <PaymentIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography>Facturación</Typography>
          </Button>
        </Grid>
      </Grid>
      
      {/* Actividad Reciente */}
      <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 2 }}>
        Actividad Reciente
      </Typography>
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <List sx={{ width: '100%' }}>
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'primary.light' }}>
                <CreditCardIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="Nueva tarjeta emitida" 
              secondary="Tarjeta Visa Gold para cliente #12345"
            />
            <Typography variant="body2" color="text.secondary">
              Hace 15 minutos
            </Typography>
          </ListItem>
          <Divider variant="inset" component="li" />
          
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'error.light' }}>
                <BlockIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="Tarjeta bloqueada" 
              secondary="Tarjeta Mastercard para cliente #54321 por motivo de fraude"
            />
            <Typography variant="body2" color="text.secondary">
              Hace 45 minutos
            </Typography>
          </ListItem>
          <Divider variant="inset" component="li" />
          
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'success.light' }}>
                <AddIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="Nueva solicitud de tarjeta" 
              secondary="Solicitud de tarjeta de crédito para cliente #67890"
            />
            <Typography variant="body2" color="text.secondary">
              Hace 2 horas
            </Typography>
          </ListItem>
          <Divider variant="inset" component="li" />
          
          <ListItem>
            <ListItemIcon>
              <Avatar sx={{ bgcolor: 'warning.light' }}>
                <ReceiptIcon />
              </Avatar>
            </ListItemIcon>
            <ListItemText 
              primary="Transacción marcada como sospechosa" 
              secondary="Transacción de $5,000 desde la tarjeta #9876"
            />
            <Typography variant="body2" color="text.secondary">
              Hace 3 horas
            </Typography>
          </ListItem>
        </List>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button>Ver todas las actividades</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard; 