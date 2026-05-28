import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api    from '../api/axios';

/* Доступные помещения */
const VENUES = ['Зал', 'Ресторан', 'Летняя веранда', 'Закрытая веранда'];

/* Способы оплаты */
const PAYMENT_METHODS = [
  'Предоплата по QR-коду',
  'Оплата картой МИР',
  'Постоплата в офисе организации',
];

/* Конвертация ДД.ММ.ГГГГ → YYYY-MM-DD для отправки в БД */
const parseDate = (str) => {
  const [d, m, y] = str.split('.');
  if (!d || !m || !y || y.length !== 4) return null;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

const BookingPage = () => {
  const navigate = useNavigate();

  const [form, setForm]     = useState({ venue: '', banquetDate: '', paymentMethod: '' });
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState('');
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerErr('');
  };

  /* Форматирование ввода даты: автодобавление точек ДД.ММ.ГГГГ */
  const handleDateInput = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2) val = val.slice(0, 2) + '.' + val.slice(2);
    if (val.length > 5) val = val.slice(0, 5) + '.' + val.slice(5);
    if (val.length > 10) val = val.slice(0, 10);
    setForm((prev) => ({ ...prev, banquetDate: val }));
    setErrors((prev) => ({ ...prev, banquetDate: '' }));
  };

  /* Клиентская валидация */
  const validate = () => {
    const errs = {};
    if (!form.venue)          errs.venue         = 'Выберите помещение';
    if (!form.paymentMethod)  errs.paymentMethod  = 'Выберите способ оплаты';

    if (!form.banquetDate) {
      errs.banquetDate = 'Укажите дату';
    } else if (!/^\d{2}\.\d{2}\.\d{4}$/.test(form.banquetDate)) {
      errs.banquetDate = 'Введите дату в формате ДД.ММ.ГГГГ';
    } else {
      const iso = parseDate(form.banquetDate);
      if (!iso || isNaN(new Date(iso))) {
        errs.banquetDate = 'Некорректная дата';
      } else if (new Date(iso) < new Date()) {
        errs.banquetDate = 'Дата банкета не может быть в прошлом';
      }
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/bookings', {
        venue         : form.venue,
        banquetDate   : parseDate(form.banquetDate),
        paymentMethod : form.paymentMethod,
      });
      navigate('/cabinet');
    } catch (err) {
      setServerErr(err.response?.data?.error || 'Ошибка отправки заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="booking-page">
        <Header />

        <div className="booking-content">
          <h1 style={{ marginBottom: 20 }}>Новая заявка</h1>

          <div className="booking-form-card">
            <h2 style={{ marginBottom: 20 }}>Оформление бронирования</h2>

            {serverErr && <div className="auth-alert">{serverErr}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="venue">Помещение *</label>
                <select
                  id="venue"
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  className={errors.venue ? 'error' : ''}
                >
                  <option value="">— Выберите помещение —</option>
                  {VENUES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                {errors.venue && <span className="field-error">{errors.venue}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="banquetDate">Дата начала банкета *</label>
                <input
                  id="banquetDate"
                  name="banquetDate"
                  type="text"
                  placeholder="ДД.ММ.ГГГГ"
                  value={form.banquetDate}
                  onChange={handleDateInput}
                  maxLength={10}
                  className={errors.banquetDate ? 'error' : ''}
                  inputMode="numeric"
                />
                {errors.banquetDate && <span className="field-error">{errors.banquetDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="paymentMethod">Способ оплаты *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleChange}
                  className={errors.paymentMethod ? 'error' : ''}
                >
                  <option value="">— Выберите способ оплаты —</option>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {errors.paymentMethod && <span className="field-error">{errors.paymentMethod}</span>}
              </div>

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Отправка заявки...' : 'Отправить заявку'}
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default BookingPage;
