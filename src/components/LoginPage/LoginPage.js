import React, { useState } from 'react';
import './LoginPage.css';
import LoginImage from "../../assets/images/login-image.png";
import GoogleLogo from "../../assets/icons/google.png";
import FacebookLogo from "../../assets/icons/facebook.png";
import YandexLogo from "../../assets/icons/yandex.png";
import api from '../../api';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    // Проверка валидности формы (все поля должны быть заполнены)
    const isFormValid = login !== '' && password !== '';

    // Функция для обработки отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) return;

        try {

            const response = await api.post('/api/v1/account/login', {
                login: login,
                password: password
            });

            // Получаем токен из ответа
            const { accessToken, expire } = response.data;

            authLogin({ accessToken, expire });

            localStorage.setItem('accessToken', accessToken);

            navigate('/');
        } catch (error) {

            setError('Неправильный логин или пароль. Попробуйте снова.');
        }
    };

    return (
        <section className="login-page">
            <div className='login-page-content'>
                <p className='login-page-article'>Для оформления подписки на тариф, необходимо авторизоваться.</p>
                <div className='login-page-image-container'>
                    <img src={LoginImage} alt="Login image" className='login-page-image'></img>
                </div>
            </div>
            <div className='login-page-form-container'>
                <form className='login-page-form' onSubmit={handleSubmit}>
                    <div className='login-page-form-type-change'>
                        <div className='login-page-form-login-block'>
                            <p className='login-page-form-login'>Войти</p>
                            <div className='login-page-form-line' style={{background: '#029491'}}></div>
                        </div>
                        <div className='login-page-form-register-block'>
                            <p className='login-page-form-register'>Зарегистрироваться</p>
                            <div className='login-page-form-line' style={{background: '#C7C7C7'}}></div>
                        </div>
                    </div>
                    <label className='login-page-form-label'>Логин или номер телефона:</label>
                    <input
                        className='login-page-form-input'
                        type='text'
                        name='auth-login'
                        value={login}
                        onChange={(e) => setLogin(e.target.value)} // Обновляем значение логина
                        required
                    />
                    <label className='login-page-form-label'>Пароль:</label>
                    <input
                        className='login-page-form-input'
                        type='password'
                        name='auth-pass'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Обновляем значение пароля
                        required
                    />

                    {/* Кнопка меняет цвет и отключается, если форма не валидна */}
                    <button
                        className='login-page-form-button'
                        type='submit'
                        disabled={!isFormValid}
                        style={{
                            background: isFormValid ? '#5970FF' : '#b0b3ff',
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
                        }}
                    >
                        Войти
                    </button>

                    {/* Отображаем сообщение об ошибке при неправильных данных */}
                    {error && <p className='login-page-form-error'>{error}</p>}

                    <a className='login-page-form-link' href='/login'>Восстановить пароль</a>
                    <p className='login-page-form-label'>Войти через:</p>
                    <div className='login-page-form-media-buttons-container'>
                        <div className='login-page-form-media-button'>
                            <img className='login-page-form-media-button-image' src={GoogleLogo} alt="Google Login" />
                        </div>
                        <div className='login-page-form-media-button'>
                            <img className='login-page-form-media-button-image' src={FacebookLogo} alt="Facebook Login" />
                        </div>
                        <div className='login-page-form-media-button'>
                            <img className='login-page-form-media-button-image' src={YandexLogo} alt="Yandex Login" />
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default LoginPage;