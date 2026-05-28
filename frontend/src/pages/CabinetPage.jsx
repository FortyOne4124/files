import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList, Plus, Building2, Calendar, CreditCard,
  Clock, CheckCircle2, MessageSquare, Landmark,
} from 'lucide-react';
import Header  from '../components/Header';
import Footer  from '../components/Footer';
import Slider  from '../components/Slider';
import api     from '../api/axios';

/* Форматирование даты */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
};

/* CSS-класс бейджа статуса */
const statusClass = (status) => {
  if (status === 'Новая')           return 'booking-status status-new';
  if (status === 'Банкет назначен') return 'booking-status status-assigned';
  return 'booking-status status-done';
};

/* ===== Карточка одной заявки ===== */
const BookingCard = ({ booking, onReviewAdded }) => {
  const [reviewText, setReviewText] = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const canReview = booking.status !== 'Новая' && !booking.review_id;

  const handleReviewSubmit = async () => {
    if (!reviewText.trim()) { setError('Введите текст отзыва'); return; }
    setLoading(true);
    try {
      await api.post('/bookings/review', { bookingId: booking.id, reviewText });
      onReviewAdded();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка отправки отзыва');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-card">
      <div className="booking-card-header">
        <span className="booking-venue" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Building2 size={16} /> {booking.venue}
        </span>
        <span className={statusClass(booking.status)}>{booking.status}</span>
      </div>

      <div className="booking-card-body">
        <p className="booking-meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={13} style={{ color: 'var(--golden)', flexShrink: 0 }} />
          Дата банкета: <span>{formatDate(booking.banquet_date)}</span>
        </p>
        <p className="booking-meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CreditCard size={13} style={{ color: 'var(--golden)', flexShrink: 0 }} />
          Оплата: <span>{booking.payment_method}</span>
        </p>
        <p className="booking-meta" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Clock size={13} style={{ color: 'var(--gray-dark)', flexShrink: 0 }} />
          Заявка от: <span>{formatDate(booking.created_at)}</span>
        </p>
      </div>

      <div className="review-section">
        {booking.review_id ? (
          <div>
            <p style={{ fontSize: 12, color: 'var(--golden)', marginBottom: 5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={13} /> Ваш отзыв:
            </p>
            <p className="review-existing">«{booking.review_text}»</p>
          </div>
        ) : booking.status === 'Новая' ? (
          <p style={{ fontSize: 12, color: 'var(--gray-dark)' }}>
            Отзыв доступен после подтверждения заявки администратором
          </p>
        ) : canReview ? (
          <div className="review-form">
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <MessageSquare size={13} /> Оставьте отзыв об услуге:
            </p>
            <textarea
              placeholder="Поделитесь впечатлениями..."
              value={reviewText}
              onChange={(e) => { setReviewText(e.target.value); setError(''); }}
            />
            {error && <span className="field-error">{error}</span>}
            <div className="review-form-row">
              <button className="btn-review" onClick={handleReviewSubmit} disabled={loading}>
                {loading ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* ===== Главный компонент страницы ===== */
const CabinetPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      console.error('Ошибка загрузки заявок:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="app-wrapper">
      <div className="cabinet-page">
        <Header />

        <div className="cabinet-content">
          <h1 style={{ fontSize: 26, marginBottom: 4 }}>
            Добро пожаловать{user.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
          </h1>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
            Личный кабинет портала Банкетам.Нет
          </p>

          <div className="cabinet-layout">
            <div className="cabinet-sidebar">
              <Slider />

              <Link to="/booking" className="btn-new-booking" style={{ marginTop: 16 }}>
                <Plus size={18} /> Создать заявку на банкет
              </Link>
            </div>

            <div className="bookings-column">
              <h2 className="section-title">
                <ClipboardList size={20} /> Мои заявки
              </h2>

              {loading ? (
                <div className="spinner" />
              ) : bookings.length === 0 ? (
                <div className="empty-state">
                  <Landmark size={48} style={{ color: 'var(--golden)', margin: '0 auto 12px', display: 'block' }} />
                  <p>Заявок пока нет.<br />Создайте первую заявку на банкет!</p>
                </div>
              ) : (
                <div className="bookings-grid">
                  {bookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onReviewAdded={fetchBookings}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CabinetPage;
