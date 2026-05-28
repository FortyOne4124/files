const pool = require('../db/pool');

const SORT_FIELDS   = ['created_at', 'banquet_date', 'venue', 'status', 'id'];
const SORT_ORDERS   = ['asc', 'desc'];
const VALID_STATUSES = ['Новая', 'Банкет назначен', 'Банкет завершен'];

/* Все заявки с фильтром, сортировкой и пагинацией */
const getAllBookings = async ({ page = 1, limit = 10, status = '', sort = 'created_at', order = 'desc' }) => {
  const sortField = SORT_FIELDS.includes(sort)  ? sort  : 'created_at';
  const sortOrder = SORT_ORDERS.includes(order) ? order : 'desc';
  const offset    = (parseInt(page) - 1) * parseInt(limit);

  const params      = [];
  const countParams = [];
  let   whereClause = '';

  if (status && VALID_STATUSES.includes(status)) {
    params.push(status);
    countParams.push(status);
    whereClause = 'WHERE b.status = $1';
  }

  const dataQuery = `
    SELECT b.id, b.venue, b.banquet_date, b.payment_method, b.status, b.created_at,
           u.login, u.full_name, u.phone, u.email
    FROM   bookings b
    JOIN   users u ON u.id = b.user_id
    ${whereClause}
    ORDER  BY b.${sortField} ${sortOrder}
    LIMIT  $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(parseInt(limit), offset);

  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, params),
    pool.query(`SELECT COUNT(*) FROM bookings b ${whereClause}`, countParams),
  ]);

  return {
    bookings : dataResult.rows,
    total    : parseInt(countResult.rows[0].count),
    page     : parseInt(page),
    limit    : parseInt(limit),
  };
};

/* Смена статуса заявки */
const updateBookingStatus = async ({ id, status }) => {
  if (!VALID_STATUSES.includes(status)) {
    throw { status: 400, message: 'Недопустимый статус' };
  }

  const result = await pool.query(
    'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );

  if (result.rows.length === 0) throw { status: 404, message: 'Заявка не найдена' };

  return result.rows[0];
};

module.exports = { getAllBookings, updateBookingStatus };
