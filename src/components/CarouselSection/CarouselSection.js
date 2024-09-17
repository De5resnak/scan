import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CarouselSection.css'; // Подключаем стили
// Импортируем иконки
import iconSpeed from '../../assets/icons/time.png';
import iconDatabase from '../../assets/icons/search.png';
import iconLock from '../../assets/icons/defence.png';
import leftArrow from '../../assets/icons/leftarrow.png';
import rightArrow from '../../assets/icons/rightarrow.png';


const CarouselSection = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Показываем 3 слайда на десктопе
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 768, // При ширине экрана 768px и меньше
                settings: {
                    slidesToShow: 1, // Показываем 1 слайд на мобильных
                    slidesToScroll: 1
                }
            }
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    return (
        <div className="carousel-section">
            <h2 className="carousel-section__title">Почему именно мы</h2>
            <Slider {...settings}>
                <div className="carousel-card">
                    <div className="carousel-card__icon-container">
                        <img src={iconSpeed} alt="Speed Icon" className="carousel-card__icon" />
                    </div>
                    <p className="carousel-card__text">Высокая и оперативная скорость обработки заявки</p>
                </div>
                <div className="carousel-card">
                    <div className="carousel-card__icon-container">
                        <img src={iconDatabase} alt="Database Icon" className="carousel-card__icon" />
                    </div>
                    <p className="carousel-card__text">Огромная комплексная база данных, обеспечивающая объективный ответ на запрос</p>
                </div>
                <div className="carousel-card">
                    <div className="carousel-card__icon-container">
                        <img src={iconLock} alt="Lock Icon" className="carousel-card__icon" />
                    </div>
                    <p className="carousel-card__text">Защита конфиденциальных сведений, не подлежащих разглашению по федеральному законодательству</p>
                </div>
                {/* Добавляем другие карточки по аналогии */}
            </Slider>
        </div>
    );
}

const SampleNextArrow = (props) => {
    const { className, onClick } = props;
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                display: 'block',
                backgroundImage: `url(${rightArrow})`,
                backgroundSize: '50px 50px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '50px',
                height: '50px',
                backgroundColor: '#FFFFFF',
                borderRadius: '50%',
                opacity: 1,
                zIndex: 1,
            }}
        />
    );
}

const SamplePrevArrow = (props) => {
    const { className, onClick } = props;
    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                display: 'block',
                backgroundImage: `url(${leftArrow})`,
                backgroundSize: '50px 50px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '50px',
                height: '50px',
                backgroundColor: '#FFFFFF',
                borderRadius: '50%',
                opacity: 1,
                zIndex: 1,
            }}
        />
    );
}


export default CarouselSection;
