import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст авторизации
export const AuthContext = createContext();

// Провайдер контекста авторизации
export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null); // Состояние авторизации

    // При первой загрузке проверяем, есть ли токен в localStorage
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setAuthData({ accessToken: token });
        }
    }, []);

    // Функция для входа (сохранение токена)
    const login = (data) => {
        setAuthData(data);
        localStorage.setItem('accessToken', data.accessToken); // Сохраняем токен в localStorage
    };

    // Функция для выхода (очистка токена)
    const logout = () => {
        setAuthData(null);
        localStorage.removeItem('accessToken'); // Удаляем токен из localStorage
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для удобного использования контекста
export const useAuth = () => {
    return useContext(AuthContext);
};