import React from 'react';
import './ImageBlock.css'; // Подключаем стили

// Импортируем изображения
import desktopImage from '../../assets/images/desktop-image.png'; // Изображение для десктопной версии
import mobileImage from '../../assets/images/mobile-image.png';   // Изображение для мобильной версии

const ImageBlock = () => {
    return (
        <div className="image-block">
            {/* Изображение для десктопной версии */}
            <img src={desktopImage} alt="Desktop" className="image-block__img image-block__img--desktop" />

            {/* Изображение для мобильной версии */}
            <img src={mobileImage} alt="Mobile" className="image-block__img image-block__img--mobile" />
        </div>
    );
}

export default ImageBlock;
