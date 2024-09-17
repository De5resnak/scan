// components/Section1.js
import React from 'react';
import './Section1.css';
import backgroundImage from '../../assets/images/img1.png'; // Путь к изображению

const Section1 = () => {
    return (
        <section className="section1">
            <div className="section1__content">
                <h1 className="section1__title">
                    СЕРВИС ПО ПОИСКУ ПУБЛИКАЦИИ О КОМПАНИИ ПО ЕГО ИНН
                </h1>
                <p className="section1__description">
                    Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.
                </p>
                <div className="section1__button-container">
                    <form action="/search" target='_blank'>
                        <button className="section1__button">
                            Запросить данные
                        </button>
                    </form>
                </div>
            </div>
            <div className="section1__image-container">
                <img src={backgroundImage} alt="Main section background" className="section1__image" />
            </div>
        </section>
    );
};

export default Section1;
