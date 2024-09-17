import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Подключаем AuthContext

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth(); // Проверяем статус пользователя

  return user ? element : <Navigate to="/login" replace />; // Если авторизован — отображаем элемент, если нет — перенаправляем на страницу входа
};

export default ProtectedRoute;
