require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const initDatabase = require('./db/init');

const authRoutes    = require('./modules/authRoutes');
const bookingRoutes = require('./modules/bookingRoutes');
const adminRoutes   = require('./modules/adminRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* Маршруты API */
app.use('/api/auth',     authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin',    adminRoutes);

/* Запуск сервера после инициализации БД */
const start = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Ошибка запуска сервера:', err);
  process.exit(1);
});
