import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  // Verificar si hay un token de administrador válido
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  
  // Si no está autenticado, redirigir al login de administrador
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Si está autenticado, mostrar las rutas hijas
  return <Outlet />;
};

export default AdminProtectedRoute; 