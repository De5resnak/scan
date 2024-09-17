import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import './Header.css'; // Подключаем наш CSS-файл для стилей
import logo from '../../assets/images/logo.png';

const Header = () => {
  const { authData, logout } = useAuth(); // Используем контекст авторизации
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null); // Храним информацию об аккаунте
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState(null); // Для обработки ошибок

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
  };

  // useEffect для загрузки информации об аккаунте
  useEffect(() => {
    if (authData) {
      const fetchAccountInfo = async () => {
        setLoading(true);
        try {
          const response = await fetch('https://gateway.scan-interfax.ru/api/v1/account/info', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authData.accessToken}`, // Отправляем токен в заголовке
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Ошибка при загрузке данных аккаунта');
          }

          const data = await response.json();
          setAccountInfo(data.eventFiltersInfo); // Сохраняем данные о компаниях
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchAccountInfo(); // Вызываем функцию при монтировании компонента
    }
  }, [authData]); // Следим за изменением authData

  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="Логотип" />
      </div>
      <div className="header__content">
          <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
              <div className="header__nav_links">
                  <a href="/" className="header__link">Главная</a>
                  <a href="#" className="header__link">Тарифы</a>
                  <a href="#" className="header__link">FAQ</a>
              </div>
              <div className="header__account">
                  {authData ? (
                      <>
                          <div className='header__account_info_container'>
                              {loading ? (
                                  <p className='header__account_info_loader'>Загружаем информацию...</p>
                              ) : error ? (
                                  <p className='header__account_info_error'>{error}</p>
                              ) : accountInfo ? (
                                  <>
                                      <div className='header__account_info_usedCompany_container'>
                                          <p>
                                              Использовано компаний
                                          </p>
                                          <p className='header__account_info_usednumber'>{accountInfo.usedCompanyCount}</p>
                                      </div>
                                      <div className='header__account_info_usedCompany_container'>
                                          <p>
                                              Лимит компаний
                                          </p>
                                          <p className='header__account_info_limitnumber'>{accountInfo.companyLimit}</p>
                                      </div>
                                  </>
                              ) : (
                                  <p className='header__account_info_loader'>Информация не найдена</p>
                              )}
                          </div>
                          <div className='header__account_container'>
                              <button className="header__logout" onClick={logout}>Выйти</button>
                          </div>
                      </>
                  ) : (
                      <>
                          <a href="#" className="header__register">Зарегистрироваться</a>
                          <div className="header__divider"></div>
                          <form action="/login" target='_blank'>
                              <button className="header__login">Войти</button>
                          </form>
                      </>
                  )}
              </div>
          </nav>
      </div>
      <div className="header__hamburger" onClick={toggleMenu}>
          <div className="header__hamburger-line"></div>
          <div className="header__hamburger-line"></div>
          <div className="header__hamburger-line"></div>
      </div>
    </header>
  );
};

export default Header;
