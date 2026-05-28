const bcrypt = require('bcryptjs');
const pool   = require('./pool');

const initDatabase = async () => {
  const client = await pool.connect();
  try {
    /* Единая таблица пользователей с полем role ('user' | 'admin') */
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id         SERIAL PRIMARY KEY,
        login      VARCHAR(50)  UNIQUE NOT NULL,
        password   VARCHAR(255) NOT NULL,
        full_name  VARCHAR(100),
        phone      VARCHAR(20),
        email      VARCHAR(100),
        role       VARCHAR(20)  NOT NULL DEFAULT 'user',
        created_at TIMESTAMP    DEFAULT NOW()
      )
    `);

    await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'`);
    await client.query(`ALTER TABLE users ALTER COLUMN full_name DROP NOT NULL`).catch(() => {});
    await client.query(`ALTER TABLE users ALTER COLUMN phone     DROP NOT NULL`).catch(() => {});
    await client.query(`ALTER TABLE users ALTER COLUMN email     DROP NOT NULL`).catch(() => {});

    await client.query(`DROP TABLE IF EXISTS admins CASCADE`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id             SERIAL PRIMARY KEY,
        user_id        INTEGER REFERENCES users(id) ON DELETE CASCADE,
        venue          VARCHAR(50)  NOT NULL,
        banquet_date   DATE         NOT NULL,
        payment_method VARCHAR(100) NOT NULL,
        status         VARCHAR(30)  DEFAULT 'Новая',
        created_at     TIMESTAMP    DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id          SERIAL PRIMARY KEY,
        booking_id  INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        user_id     INTEGER REFERENCES users(id)    ON DELETE CASCADE,
        review_text TEXT      NOT NULL,
        created_at  TIMESTAMP DEFAULT NOW()
      )
    `);

    /* Автосоздание администратора Admin26 / Demo20 */
    const existing = await client.query(
      `SELECT id FROM users WHERE login = $1`, ['Admin26']
    );
    if (existing.rows.length === 0) {
      const hashed = await bcrypt.hash('Demo20', 10);
      await client.query(
        `INSERT INTO users (login, password, full_name, role) VALUES ($1, $2, 'Администратор', 'admin')`,
        ['Admin26', hashed]
      );
      console.log('Администратор Admin26 создан');
    }

    console.log('База данных инициализирована');
  } finally {
    client.release();
  }
};

module.exports = initDatabase;
