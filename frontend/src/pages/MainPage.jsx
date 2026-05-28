import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import {
  Building2, Utensils, TreePine, Tent,
  CreditCard, QrCode, Landmark,
  MapPin, Phone, CalendarCheck,
} from 'lucide-react';
import Slider  from '../components/Slider';
import Footer  from '../components/Footer';

/* Описание помещений */
const VENUES = [
  {
    name  : 'Зал',
    img   : '/collage5.jpeg',
    desc  : 'Просторный банкетный зал с элегантным интерьером до 200 гостей. Идеально для корпоративных мероприятий и торжеств.',
    icon  : Building2,
  },
  {
    name  : 'Ресторан',
    img   : '/1686219637_en-idei-club-p-t.jpg',
    desc  : 'Уютный ресторан с авторской кухней и индивидуальным обслуживанием. Изысканная атмосфера для особых случаев.',
    icon  : Utensils,
  },
  {
    name  : 'Летняя веранда',
    img   : '/1686676944_elles-top-p-letnyaya-ploshcha.jpg',
    desc  : 'Открытая веранда с живописным видом на природу. Свежий воздух и уютная обстановка для сезонных мероприятий.',
    icon  : TreePine,
  },
  {
    name  : 'Закрытая веранда',
    img   : '/1671649122_idei-club-p-veranda-.jpg',
    desc  : 'Закрытое пространство с панорамным остеклением. Комфорт веранды в любую погоду в течение всего года.',
    icon  : Tent,
  },
];

/* Способы оплаты */
const PAYMENTS = [
  { icon: QrCode,    text: 'Предоплата по QR-коду' },
  { icon: CreditCard, text: 'Оплата картой МИР' },
  { icon: Landmark,  text: 'Постоплата в офисе организации' },
];

const MainPage = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
  <div className="main-page">
    <nav className="main-nav">
      <Link to="/" className="main-nav-logo">
        <img src="/logo (2).png" alt="Логотип" />
        <span>Банкетам.Нет</span>
      </Link>
      <div className="main-nav-links">
        {isLoggedIn ? (
          <Link to="/cabinet" className="btn-nav btn-nav-fill" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <LayoutDashboard size={16} /> Личный кабинет
          </Link>
        ) : (
          <>
            <Link to="/login"    className="btn-nav btn-nav-outline">Войти</Link>
            <Link to="/register" className="btn-nav btn-nav-fill">Регистрация</Link>
          </>
        )}
      </div>
    </nav>

    <section className="hero">
      <h1>Банкетам.Нет</h1>
      <p>
        Бронирование помещений для банкетов: зал, ресторан,
        летняя веранда, закрытая веранда. Создайте незабываемое мероприятие
        с нашей помощью.
      </p>

      <div className="hero-slider">
        <Slider />
      </div>

      <Link to="/register" className="hero-cta">
        <CalendarCheck size={20} /> Забронировать помещение
      </Link>
    </section>

    <section className="main-section" style={{ background: 'var(--white)' }}>
      <div className="section-inner">
        <h2><Building2 size={22} /> Наши помещения</h2>
        <div className="venues-grid">
          {VENUES.map((v) => {
            const Icon = v.icon;
            return (
              <div className="venue-card" key={v.name}>
                <img src={v.img} alt={v.name} />
                <div className="venue-card-body">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Icon size={16} style={{ color: 'var(--golden)' }} /> {v.name}
                  </h3>
                  <p>{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <section className="main-section">
      <div className="section-inner">
        <div className="info-grid">
          <div className="info-card">
            <h3><CreditCard size={18} /> Варианты оплаты</h3>
            <ul className="info-list">
              {PAYMENTS.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <Icon size={15} style={{ color: 'var(--golden)', flexShrink: 0 }} />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="info-card">
            <h3><MapPin size={18} /> Наше местонахождение</h3>
            <ul className="info-list">
              <li>
                <MapPin size={15} style={{ color: 'var(--crimson)', flexShrink: 0 }} />
                г. Москва, ул. Большая Ордынка, д. 15
              </li>
              <li>
                <Phone size={15} style={{ color: 'var(--crimson)', flexShrink: 0 }} />
                +7 (495) 123-45-67
              </li>
            </ul>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>
              Если возникли вопросы или пожелания, позвоните нам.
              Ответим оперативно и подробно.
            </p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
  );
};

export default MainPage;
