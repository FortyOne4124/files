import React from 'react';

const Footer = () => (
  <footer className="footer">
    <h3>Банкетам.Нет</h3>
    <p>Бронирование помещений для банкетов:<br />зал, ресторан, летняя веранда, закрытая веранда</p>

    <hr className="footer-divider" />

    <p>
      г. Москва, ул. Большая Ордынка, д. 15<br />
      Телефон горячей линии: <strong>+7 (495) 123-45-67</strong>
    </p>

    <hr className="footer-divider" />

    <p style={{ color: '#c8a050', fontWeight: 500, marginBottom: 6 }}>Варианты оплаты:</p>
    <p>предоплата по QR-коду · оплата картой МИР · постоплата в офисе</p>
  </footer>
);

export default Footer;
