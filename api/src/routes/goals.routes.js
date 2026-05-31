import { Router } from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all goals for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_goals WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ goals: result.rows });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to get goals' });
  }
});

// Get goal by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_goals WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal: result.rows[0] });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Failed to get goal' });
  }
});

// Create new goal
router.post('/', authenticateToken, async (req, res) => {
  const { goal_type, target_value, current_value, unit, target_date, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO user_goals (user_id, goal_type, target_value, current_value, unit, target_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, goal_type, target_value, current_value, unit, target_date, notes]
    );
    res.status(201).json({ goal: result.rows[0] });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Update goal progress
router.put('/:id/progress', authenticateToken, async (req, res) => {
  const { current_value, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE user_goals 
       SET current_value = COALESCE($1, current_value), 
           notes = COALESCE($2, notes),
           updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [current_value, notes, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal: result.rows[0] });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Complete goal
router.put('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE user_goals 
       SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ goal: result.rows[0], message: 'Goal completed!' });
  } catch (error) {
    console.error('Complete goal error:', error);
    res.status(500).json({ error: 'Failed to complete goal' });
  }
});

// Delete goal
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM user_goals WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

export default router;
