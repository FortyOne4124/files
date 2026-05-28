const pool = require('../db/pool');

/* Получение заявок пользователя вместе с его отзывом */
const getUserBookings = async (userId) => {
  const result = await pool.query(
    `SELECT b.id, b.venue, b.banquet_date, b.payment_method, b.status, b.created_at,
            r.id AS review_id, r.review_text
     FROM   bookings b
     LEFT JOIN reviews r ON r.booking_id = b.id AND r.user_id = $1
     WHERE  b.user_id = $1
     ORDER  BY b.created_at DESC`,
    [userId]
  );
  return result.rows;
};

/* Создание заявки */
const createBooking = async ({ userId, venue, banquetDate, paymentMethod }) => {
  const result = await pool.query(
    'INSERT INTO bookings (user_id, venue, banquet_date, payment_method) VALUES ($1,$2,$3,$4) RETURNING *',
    [userId, venue, banquetDate, paymentMethod]
  );
  return result.rows[0];
};

/* Добавление отзыва: проверка владения заявкой, статуса и дубликата */
const addReview = async ({ bookingId, userId, reviewText }) => {
  const bookingResult = await pool.query(
    'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
    [bookingId, userId]
  );
  const booking = bookingResult.rows[0];

  if (!booking) throw { status: 404, message: 'Заявка не найдена' };

  if (booking.status === 'Новая') {
    throw { status: 400, message: 'Отзыв можно оставить только после изменения статуса заявки администратором' };
  }

  const existing = await pool.query(
    'SELECT id FROM reviews WHERE booking_id = $1 AND user_id = $2',
    [bookingId, userId]
  );
  if (existing.rows.length > 0) {
    throw { status: 400, message: 'Отзыв уже оставлен для этой заявки' };
  }

  const result = await pool.query(
    'INSERT INTO reviews (booking_id, user_id, review_text) VALUES ($1,$2,$3) RETURNING *',
    [bookingId, userId, reviewText.trim()]
  );
  return result.rows[0];
};

module.exports = { getUserBookings, createBooking, addReview };
