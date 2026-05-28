const authService = require('../services/authService');

/* Вспомогательная обёртка: перехватывает ошибки сервиса */
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (!err.status) console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Ошибка сервера' });
  }
};

const register = handle(async (req, res) => {
  const { login, password, fullName, phone, email } = req.body;

  if (!/^[a-zA-Z0-9]{6,}$/.test(login)) {
    return res.status(400).json({ error: 'Логин должен содержать только латинские буквы и цифры, минимум 6 символов' });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Пароль должен содержать не менее 8 символов' });
  }
  if (!fullName || !phone || !email) {
    return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
  }

  await authService.registerUser({ login, password, fullName, phone, email });
  res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
});

const login = handle(async (req, res) => {
  const { login: userLogin, password } = req.body;
  if (!userLogin || !password) {
    return res.status(400).json({ error: 'Введите логин и пароль' });
  }
  const result = await authService.loginUser({ login: userLogin, password });
  res.json(result);
});

module.exports = { register, login };
