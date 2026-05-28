const bookingService = require('../services/bookingService');

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (!err.status) console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Ошибка сервера' });
  }
};

const getUserBookings = handle(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user.id);
  res.json(bookings);
});

const createBooking = handle(async (req, res) => {
  const { venue, banquetDate, paymentMethod } = req.body;
  if (!venue || !banquetDate || !paymentMethod) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  const booking = await bookingService.createBooking({
    userId: req.user.id, venue, banquetDate, paymentMethod,
  });
  res.status(201).json(booking);
});

const addReview = handle(async (req, res) => {
  const { bookingId, reviewText } = req.body;
  if (!bookingId || !reviewText?.trim()) {
    return res.status(400).json({ error: 'Укажите заявку и текст отзыва' });
  }
  const review = await bookingService.addReview({
    bookingId, userId: req.user.id, reviewText,
  });
  res.status(201).json(review);
});

module.exports = { getUserBookings, createBooking, addReview };
