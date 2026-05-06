const pool = require('../config/database');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, COUNT(t.id) as todo_count,
        COUNT(t.id) FILTER (WHERE t.is_completed = false) as pending_count
       FROM categories c
       LEFT JOIN todos t ON c.id = t.category_id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.created_at ASC`,
      [req.user.id]
    );
    res.json({ success: true, data: { categories: result.rows } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Create category
// @route   POST /api/categories
const createCategory = async (req, res) => {
  const { name, color, icon } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

  try {
    const result = await pool.query(
      `INSERT INTO categories (user_id, name, color, icon)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.user.id, name, color || '#6366f1', icon || 'folder']
    );
    res.status(201).json({ success: true, data: { category: result.rows[0] } });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Category name already exists' });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
const updateCategory = async (req, res) => {
  const { name, color, icon } = req.body;
  try {
    const result = await pool.query(
      `UPDATE categories SET
        name = COALESCE($1, name),
        color = COALESCE($2, color),
        icon = COALESCE($3, icon)
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [name, color, icon, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: { category: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
