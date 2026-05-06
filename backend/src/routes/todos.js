const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getTodos, getTodo, createTodo, updateTodo, deleteTodo, toggleTodo, getStats } = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/stats', getStats);
router.get('/', getTodos);
router.get('/:id', getTodo);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').optional({ nullable: true, checkFalsy: true }).isISO8601(),
], createTodo);

router.put('/:id', [
  body('title').optional().trim().notEmpty(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('due_date').optional({ nullable: true, checkFalsy: true }).isISO8601(),
], updateTodo);

router.delete('/:id', deleteTodo);
router.patch('/:id/toggle', toggleTodo);

module.exports = router;