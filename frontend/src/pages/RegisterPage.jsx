import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

/* Правила валидации полей */
const validate = (form) => {
  const errors = {};

  if (!/^[a-zA-Z0-9]{6,}$/.test(form.login)) {
    errors.login = 'Только латинские буквы и цифры, минимум 6 символов';
  }
  if (form.password.length < 8) {
    errors.password = 'Минимум 8 символов';
  }
  if (!form.fullName.trim()) {
    errors.fullName = 'Введите ФИО';
  }
  if (!/^\+?[0-9\s\-()]{7,}$/.test(form.phone)) {
    errors.phone = 'Введите корректный номер телефона';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Введите корректный e-mail';
  }

  return errors;
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm]     = useState({ login: '', password: '', fullName: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr]   = useState('');
  const [success, setSuccess]       = useState(false);
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setServerErr(err.response?.data?.error || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="auth-page">
        <div className="auth-logo-wrap">
          <img src="/logo (2).png" alt="Логотип" />
          <div className="auth-title">Банкетам.Нет</div>
          <div className="auth-subtitle">Создание аккаунта</div>
        </div>

        <div className="auth-card">
          <h2 style={{ marginBottom: 20 }}>Регистрация</h2>

          {serverErr && <div className="auth-alert">{serverErr}</div>}
          {success   && <div className="auth-success">Вы успешно зарегистрированы! Перенаправляем...</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login">Логин *</label>
              <input
                id="login"
                name="login"
                type="text"
                placeholder="Только латиница и цифры (от 6 символов)"
                value={form.login}
                onChange={handleChange}
                className={errors.login ? 'error' : ''}
                autoComplete="username"
              />
              {errors.login && <span className="field-error">{errors.login}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль *</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Минимум 8 символов"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                autoComplete="new-password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="fullName">ФИО *</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={form.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="field-error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+7 (999) 000-00-00"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@mail.ru"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <button className="btn-primary" type="submit" disabled={loading || success}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="auth-link">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
