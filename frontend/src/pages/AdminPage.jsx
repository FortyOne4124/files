import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight, Shield,
} from 'lucide-react';
import api from '../api/axios';

/* Допустимые статусы */
const STATUSES = ['Новая', 'Банкет назначен', 'Банкет завершен'];

/* Поля сортировки */
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Дата заявки' },
  { value: 'banquet_date', label: 'Дата банкета' },
  { value: 'venue',        label: 'Помещение' },
  { value: 'status',       label: 'Статус' },
  { value: 'id',           label: 'Номер заявки' },
];

const PAGE_SIZE = 10;

/* ===== Всплывающее уведомление ===== */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast-container">
      <div className={`toast${type === 'error' ? ' error' : ''}`}>{message}</div>
    </div>
  );
};

/* ===== Иконка сортировки ===== */
const SortIcon = ({ field, current, order }) => {
  if (current !== field) return <ArrowUpDown size={12} className="sort-icon" />;
  return order === 'asc'
    ? <ArrowUp size={12} className="sort-icon" />
    : <ArrowDown size={12} className="sort-icon" />;
};

/* ===== Форматирование даты ===== */
const formatDate = (str) => {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

/* ===== Бейдж статуса ===== */
const StatusBadge = ({ status }) => {
  const cls =
    status === 'Новая'           ? 'booking-status status-new' :
    status === 'Банкет назначен' ? 'booking-status status-assigned' :
                                   'booking-status status-done';
  return <span className={cls}>{status}</span>;
};

/* ===== Главная панель ===== */
const AdminPanel = ({ onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);

  /* Параметры фильтра/сортировки/пагинации */
  const [filters, setFilters] = useState({
    status : '',
    sort   : 'created_at',
    order  : 'desc',
    page   : 1,
  });

  /* Статистика по статусам */
  const stats = {
    total    : total,
    new      : bookings.filter((b) => b.status === 'Новая').length,
    assigned : bookings.filter((b) => b.status === 'Банкет назначен').length,
    done     : bookings.filter((b) => b.status === 'Банкет завершен').length,
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  /* Загрузка заявок с учётом фильтров */
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const { data } = await api.get('/admin/bookings', {
        headers: { Authorization: `Bearer ${adminToken}` },
        params: {
          status : filters.status,
          sort   : filters.sort,
          order  : filters.order,
          page   : filters.page,
          limit  : PAGE_SIZE,
        },
      });
      setBookings(data.bookings);
      setTotal(data.total);
    } catch (err) {
      showToast(err.response?.data?.error || 'Ошибка загрузки', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  /* Изменение статуса заявки */
  const handleStatusChange = async (id, newStatus) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      await api.patch(`/admin/bookings/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      showToast(`Статус заявки №${id} изменён на «${newStatus}»`);
      fetchBookings();
    } catch (err) {
      showToast(err.response?.data?.error || 'Ошибка изменения статуса', 'error');
    }
  };

  /* Смена сортировки: повторный клик меняет направление */
  const handleSort = (field) => {
    setFilters((prev) => ({
      ...prev,
      sort  : field,
      order : prev.sort === field && prev.order === 'asc' ? 'desc' : 'asc',
      page  : 1,
    }));
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={22} /> Панель администратора
        </h1>
        <button className="btn-logout" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <LogOut size={14} /> Выйти
        </button>
      </div>

      <div className="admin-content">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-val">{total}</div>
            <div className="stat-name">Всего</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{stats.new}</div>
            <div className="stat-name">Новых</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{stats.assigned}</div>
            <div className="stat-name">Назначено</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{stats.done}</div>
            <div className="stat-name">Завершено</div>
          </div>
        </div>

        <div className="admin-filters">
          <div className="filter-group">
            <label>Фильтр по статусу</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))}
            >
              <option value="">Все статусы</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Сортировка</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value, page: 1 }))}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Порядок</label>
            <select
              value={filters.order}
              onChange={(e) => setFilters((p) => ({ ...p, order: e.target.value, page: 1 }))}
            >
              <option value="desc">По убыванию</option>
              <option value="asc">По возрастанию</option>
            </select>
          </div>

          <button
            className="btn-reset-filter"
            onClick={() => setFilters({ status: '', sort: 'created_at', order: 'desc', page: 1 })}
          >
            Сбросить
          </button>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')}>
                    № <SortIcon field="id" current={filters.sort} order={filters.order} />
                  </th>
                  <th>Пользователь</th>
                  <th>Контакты</th>
                  <th onClick={() => handleSort('venue')}>
                    Помещение <SortIcon field="venue" current={filters.sort} order={filters.order} />
                  </th>
                  <th onClick={() => handleSort('banquet_date')}>
                    Дата банкета <SortIcon field="banquet_date" current={filters.sort} order={filters.order} />
                  </th>
                  <th>Оплата</th>
                  <th onClick={() => handleSort('status')}>
                    Статус <SortIcon field="status" current={filters.sort} order={filters.order} />
                  </th>
                  <th onClick={() => handleSort('created_at')}>
                    Дата заявки <SortIcon field="created_at" current={filters.sort} order={filters.order} />
                  </th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: 30, color: 'var(--gray-dark)' }}>
                      Заявок не найдено
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.id}>
                      <td>#{b.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.full_name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-dark)' }}>@{b.login}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 12 }}>{b.phone}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-dark)' }}>{b.email}</div>
                      </td>
                      <td>{b.venue}</td>
                      <td>{formatDate(b.banquet_date)}</td>
                      <td style={{ fontSize: 12 }}>{b.payment_method}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td style={{ fontSize: 12, color: 'var(--gray-dark)' }}>{formatDate(b.created_at)}</td>
                      <td>
                        <select
                          className="status-select"
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
              disabled={filters.page <= 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn${filters.page === p ? ' active' : ''}`}
                onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
              >
                {p}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
              disabled={filters.page >= totalPages}
            >
              <ChevronRight size={16} />
            </button>

            <span className="pagination-info">
              {(filters.page - 1) * PAGE_SIZE + 1}–{Math.min(filters.page * PAGE_SIZE, total)} из {total}
            </span>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

/* ===== Корневой компонент страницы ===== */
const AdminPage = () => {
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('adminToken'));
  const navigate = useNavigate();

  if (!isAuth) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login', { replace: true });
  };

  return <AdminPanel onLogout={handleLogout} />;
};

export default AdminPage;
