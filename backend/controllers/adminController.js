const adminService = require('../services/adminService');

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (!err.status) console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Ошибка сервера' });
  }
};

const getAllBookings = handle(async (req, res) => {
  const { page, limit, status, sort, order } = req.query;
  const data = await adminService.getAllBookings({ page, limit, status, sort, order });
  res.json(data);
});

const updateBookingStatus = handle(async (req, res) => {
  const { id }     = req.params;
  const { status } = req.body;
  const booking    = await adminService.updateBookingStatus({ id, status });
  res.json(booking);
});

module.exports = { getAllBookings, updateBookingStatus };
