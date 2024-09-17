import axios from 'axios';

const api = axios.create({
    baseURL: 'https://gateway.scan-interfax.ru', // Базовый URL для всех запросов
});

export default api;
