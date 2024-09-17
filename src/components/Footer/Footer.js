import React from 'react';
import './Footer.css';
import logo from '../../assets/images/footer-logo.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="footer__contact">
                <p>г. Москва, Цветной б-р, 40</p>
                <p>+7 495 771 21 11</p>
                <p>info@skan.ru</p>
                <p>Copyright. 2022</p>
            </div>
        </footer>
    );
};

export default Footer;