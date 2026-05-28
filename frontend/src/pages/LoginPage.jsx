import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm]     = useState({ login: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.login || !form.password) {
      setError('Введите логин и пароль');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'admin') {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        navigate('/cabinet');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
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
          <div className="auth-subtitle">Бронирование помещений для банкетов</div>
        </div>

        <div className="auth-card">
          <h2 style={{ marginBottom: 20 }}>Вход в систему</h2>

          {error && <div className="auth-alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login">Логин</label>
              <input
                id="login"
                name="login"
                type="text"
                placeholder="Введите логин"
                value={form.login}
                onChange={handleChange}
                className={error ? 'error' : ''}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Введите пароль"
                value={form.password}
                onChange={handleChange}
                className={error ? 'error' : ''}
                autoComplete="current-password"
              />
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Выполняется вход...' : 'Войти'}
            </button>
          </form>

          <p className="auth-link">
            Ещё не зарегистрированы?{' '}
            <Link to="/register">Регистрация</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
