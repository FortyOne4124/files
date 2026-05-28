import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Home } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img src="/logo (2).png" alt="Логотип" />
        <span>Банкетам.Нет</span>
      </Link>

      <div className="header-user">
        <Link to="/" className="header-home-link">
          <Home size={15} /> Главная
        </Link>

        {user.fullName && (
          <span className="header-username">
            <User size={14} /> {user.fullName.split(' ')[0]}
          </span>
        )}

        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={14} /> Выйти
        </button>
      </div>
    </header>
  );
};

export default Header;
