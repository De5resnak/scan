import React from "react";
import "./PricingSection.css"; // Подключаем CSS файл
import check from "../../assets/icons/check.png";
import beginner from "../../assets/icons/beginner.png";
import pro from "../../assets/icons/pro.png";
import business from "../../assets/icons/business.png";

const PricingSection = () => {
  return (
    <div className="pricing-container">
      <h1 className="pricing-title">Наши тарифы</h1>

      {/* Карточка тарифа Beginner */}
      <div className="price-cards">
        <div className="card">
          <div className="card-header">
            <div className="text-container">
              <h2 className="card-title">Beginner</h2>
              <p className="card-subtitle">Для небольшого исследования</p>
            </div>
            <img src={beginner} alt="Beginner plan image" className="card-image"/>
          </div>

          <div className="price-section">
            <p className="card-price">799 ₽</p>
            <p className="card-discounted-price">1 200 ₽</p>
          </div>
          <p className="card-description">
            или 150 ₽/мес. при рассрочке на 24 мес.
          </p>
          <div className="feature-box">
            <p className="tarrif-text">В тариф входит:</p>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Безлимитная история запросов</p>
            </div>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Безопасная сделка</p>
            </div>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Поддержка 24/7</p>
            </div>
          </div>
          <button className="details-button">Подробнее</button>
        </div>

        {/* Карточка тарифа Pro */}
        <div className="card">
          <div className="card-header" style={{background: "#7CE3E1"}}>
            <div className="text-container">
              <h2 className="card-title">Pro</h2>
              <p className="card-subtitle">Для HR и фрилансеров</p>
            </div>
            <img src={pro} alt="Beginner plan image" className="card-image"/>
          </div>

          <div className="price-section">
            <p className="card-price">1 299 ₽</p>
            <p className="card-discounted-price">2 600 ₽</p>
          </div>
          <p className="card-description">
            или 279 ₽/мес. при рассрочке на 24 мес.
          </p>
          <div className="feature-box">
            <p className="tarrif-text">В тариф входит:</p>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Все пункты тарифа Beginner</p>
            </div>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Экспорт истории</p>
            </div>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Рекомендации по приоритетам</p>
            </div>
          </div>
          <button className="details-button">Подробнее</button>
        </div>

        {/* Карточка тарифа Business */}
        <div className="card">
          <div className="card-header" style={{background: "#000000"}}>
            <div className="text-container">
              <h2 className="card-title" style={{color: "#FFFFFF"}}>Business</h2>
              <p className="card-subtitle" style={{color: "#FFFFFF"}}>Для корпоративных клиентов</p>
            </div>
            <img src={business} alt="Beginner plan image" className="card-image"/>
          </div>

          <div className="price-section">
            <p className="card-price">2 379 ₽</p>
            <p className="card-discounted-price">3 700 ₽</p>
          </div>
          <p className="card-description">
          </p>
          <div className="feature-box">
            <p className="tarrif-text">В тариф входит:</p>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Все пункты тарифа Pro</p>
            </div>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Безлимитное количество запросов</p>
            </div>
            <div className="feature">
              <img className="check-icon" src={check} alt="check icon"/>
              <p>Приоритетная поддержка</p>
            </div>
          </div>
          <button className="details-button">Подробнее</button>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
