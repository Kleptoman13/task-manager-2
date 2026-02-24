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
      RETURNING id, name, email, created_at`,
      [name, email, password]
    );

    return result.rows[0];
  },

  async updateProfile(id, fields) {
    const allowed = ['name', 'avatar_url', 'password'];
    const updates = [];
    const values = [];
    let index = 1;

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = $${index}`);
        values.push(fields[key]);
        index++;
      }
    }

    if (updates.length === 0) return null;

    updates.push(`updated_at = NOW()`);

    values.push(id);

    const result = await pool.query(
      `UPDATE users
       SET ${updates.join(', ')}
       WHERE id = $${index}
       RETURNING id, name, email, avatar_url, created_at`,
      values
    );

    return result.rows[0] || null;
  },
};
