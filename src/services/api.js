import axios from 'axios';

const API_BASE_URL = 'https://gateway.scan-interfax.ru';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/account/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при авторизации', error);
    throw error;
  }
};

// Другие функции для запросов
