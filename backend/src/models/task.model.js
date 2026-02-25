import { pool } from '../lib/db.postgres.js';

export const TaskModel = {
  async findAll(userId, filters = {}) {
    let query = `SELECT * FROM tasks WHERE user_id = $1`;
    const values = [userId];
    let index = 2;

    if (filters.status) {
      query += ` AND status = $${index}`;
      values.push(filters.status);
      index++;
    }

    if (filters.priority) {
      query += ` AND priority = $${index}`;
      values.push(filters.priority);
      index++;
    }

    query += ` ORDER BY created_at DESC`;
    const result = await pool.query(query, values);
    return result.rows;
  },

  async findById(id, userId) {
    const result = await pool.query(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0] || null;
  },

  async create({
    userId,
    title,
    description = '',
    status = 'todo',
    priority = 'high',
    deadline = null,
  }) {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority, deadline) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, title, description, status, priority, deadline]
    );
    return result.rows[0];
  },

  async update(id, userId, fields) {
    const allowed = [
      'title',
      'description',
      'status',
      'priority',
      'deadline',
      'notified',
    ];
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

    values.push(id, userId);

    const result = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${index} AND user_id = $${index + 1} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  },

  async delete(id, userId) {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );

    return result.rows[0] || null;
  },

  async findExpiring() {
    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE deadline <= NOW() + INTERVAL '24 hours'
       AND deadline > NOW()
       AND notified = FALSE
       AND status != 'done'`
    );
    return result.rows;
  },
};
