import { pool } from '../lib/db.postgres.js';

export const UserModel = {
  async findByEmail(email) {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    return result.rows[0] || null;
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT id, name, email, created_at FROM users WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  },

  async create(name, email, password) {
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, avatar_url, created_at`,
      [name, email, password]
    );

    return result.rows[0];
  },

  async updateAvatar(userid, avatarUrl) {
    if (!avatarUrl) throw new Error('URL not found');

    const result = await pool.query(
      `UPDATE users
       SET 
        avatar_url = $1,
        updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, email, avatar_url, created_at`,
      [avatarUrl, userid]
    );

    return result.rows[0] || null;
  },
};
