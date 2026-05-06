const { validationResult } = require('express-validator');
const pool = require('../config/database');

// @desc    Get all todos with filters
// @route   GET /api/todos
const getTodos = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    priority,
    category_id,
    search,
    sort = 'created_at',
    order = 'DESC',
  } = req.query;

  const offset = (page - 1) * limit;
  const params = [req.user.id];
  const conditions = ['t.user_id = $1'];
  let paramCount = 2;

  if (status === 'completed') {
    conditions.push(`t.is_completed = true`);
  } else if (status === 'pending') {
    conditions.push(`t.is_completed = false`);
  }

  if (priority) {
    conditions.push(`t.priority = $${paramCount}`);
    params.push(priority);
    paramCount++;
  }

  if (category_id) {
    conditions.push(`t.category_id = $${paramCount}`);
    params.push(category_id);
    paramCount++;
  }

  if (search) {
    conditions.push(`(t.title ILIKE $${paramCount} OR t.description ILIKE $${paramCount})`);
    params.push(`%${search}%`);
    paramCount++;
  }

  const allowedSorts = ['created_at', 'updated_at', 'due_date', 'priority', 'title'];
  const sortCol = allowedSorts.includes(sort) ? `t.${sort}` : 't.created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const whereClause = conditions.join(' AND ');

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM todos t WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(limit, offset);
    const result = await pool.query(
      `SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
       FROM todos t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE ${whereClause}
       ORDER BY ${sortCol} ${sortOrder}
       LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
      params
    );

    res.json({
      success: true,
      data: {
        todos: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    console.error('GetTodos error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
const getTodo = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, c.name as category_name, c.color as category_color, c.icon as category_icon
       FROM todos t LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = $1 AND t.user_id = $2`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: { todo: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Create todo
// @route   POST /api/todos
const createTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description, category_id, priority, due_date, reminder_at, tags } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos (user_id, title, description, category_id, priority, due_date, reminder_at, tags)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.id, title, description, category_id || null, priority || 'medium', due_date || null, reminder_at || null, tags || []]
    );

    let todo = result.rows[0];

    if (todo.category_id) {
      const catResult = await pool.query('SELECT name, color, icon FROM categories WHERE id = $1', [todo.category_id]);
      if (catResult.rows.length > 0) {
        todo = { ...todo, ...{ category_name: catResult.rows[0].name, category_color: catResult.rows[0].color, category_icon: catResult.rows[0].icon } };
      }
    }

    res.status(201).json({ success: true, message: 'Todo created', data: { todo } });
  } catch (err) {
    console.error('CreateTodo error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
const updateTodo = async (req, res) => {
  const { title, description, category_id, priority, due_date, reminder_at, tags, is_completed } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM todos WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }

    const todo = existing.rows[0];
    const completedAt = is_completed === true && !todo.is_completed ? new Date() : (is_completed === false ? null : todo.completed_at);

    const result = await pool.query(
      `UPDATE todos SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        category_id = $3,
        priority = COALESCE($4, priority),
        due_date = $5,
        reminder_at = $6,
        tags = COALESCE($7, tags),
        is_completed = COALESCE($8, is_completed),
        completed_at = $9
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [title, description, category_id !== undefined ? category_id : todo.category_id,
       priority, due_date !== undefined ? due_date : todo.due_date,
       reminder_at !== undefined ? reminder_at : todo.reminder_at,
       tags, is_completed, completedAt, req.params.id, req.user.id]
    );

    res.json({ success: true, message: 'Todo updated', data: { todo: result.rows[0] } });
  } catch (err) {
    console.error('UpdateTodo error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
const toggleTodo = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE todos SET
        is_completed = NOT is_completed,
        completed_at = CASE WHEN NOT is_completed THEN NOW() ELSE NULL END
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.json({ success: true, data: { todo: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get stats
// @route   GET /api/todos/stats
const getStats = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_completed = true) as completed,
        COUNT(*) FILTER (WHERE is_completed = false) as pending,
        COUNT(*) FILTER (WHERE priority = 'high' AND is_completed = false) as high_priority,
        COUNT(*) FILTER (WHERE due_date < NOW() AND is_completed = false) as overdue,
        COUNT(*) FILTER (WHERE due_date::date = CURRENT_DATE AND is_completed = false) as due_today
       FROM todos WHERE user_id = $1`,
      [req.user.id]
    );
    res.json({ success: true, data: { stats: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getTodos, getTodo, createTodo, updateTodo, deleteTodo, toggleTodo, getStats };
