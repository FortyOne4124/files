const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const pool   = require('../db/pool');

/* Регистрация: валидация уникальности, хеширование пароля, запись в БД */
const registerUser = async ({ login, password, fullName, phone, email }) => {
  const existing = await pool.query('SELECT id FROM users WHERE login = $1', [login]);
  if (existing.rows.length > 0) {
    throw { status: 400, message: 'Логин уже занят' };
  }

  const hashed = await bcrypt.hash(password, 10);
  await pool.query(
    'INSERT INTO users (login, password, full_name, phone, email, role) VALUES ($1,$2,$3,$4,$5,$6)',
    [login, hashed, fullName, phone, email, 'user']
  );
};

/* Авторизация: поиск пользователя, проверка пароля, выдача JWT */
const loginUser = async ({ login, password }) => {
  const result = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
  const user   = result.rows[0];

  if (!user) throw { status: 400, message: 'Неверный логин или пароль' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw { status: 400, message: 'Неверный логин или пароль' };

  const token = jwt.sign(
    { id: user.id, login: user.login, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: { id: user.id, login: user.login, fullName: user.full_name, role: user.role },
  };
};

module.exports = { registerUser, loginUser };
