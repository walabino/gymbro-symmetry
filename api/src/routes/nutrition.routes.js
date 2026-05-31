import { Router } from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get nutrition logs for current user
router.get('/logs', authenticateToken, async (req, res) => {
  const { date } = req.query;
  
  try {
    let query = 'SELECT * FROM nutrition_logs WHERE user_id = $1';
    const params = [req.user.id];

    if (date) {
      query += ` AND DATE(created_at) = $${params.length + 1}`;
      params.push(date);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ logs: result.rows });
  } catch (error) {
    console.error('Get nutrition logs error:', error);
    res.status(500).json({ error: 'Failed to get nutrition logs' });
  }
});

// Add nutrition log
router.post('/logs', authenticateToken, async (req, res) => {
  const { meal_type, food_name, calories, protein, carbs, fat, fiber, water_ml, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO nutrition_logs (user_id, meal_type, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, water_ml, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, meal_type, food_name, calories, protein, carbs, fat, fiber, water_ml, notes]
    );
    res.status(201).json({ log: result.rows[0] });
  } catch (error) {
    console.error('Add nutrition log error:', error);
    res.status(500).json({ error: 'Failed to add nutrition log' });
  }
});

// Delete nutrition log
router.delete('/logs/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM nutrition_logs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Delete nutrition log error:', error);
    res.status(500).json({ error: 'Failed to delete nutrition log' });
  }
});

// Get weekly summary
router.get('/summary/weekly', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        DATE(created_at) as date,
        SUM(calories) as total_calories,
        AVG(protein_g) as avg_protein,
        AVG(carbs_g) as avg_carbs,
        AVG(fat_g) as avg_fat,
        SUM(water_ml) as total_water
       FROM nutrition_logs
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`,
      [req.user.id]
    );
    res.json({ summary: result.rows });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({ error: 'Failed to get weekly summary' });
  }
});

// Get macros summary
router.get('/macros/summary', authenticateToken, async (req, res) => {
  const { start_date, end_date } = req.query;

  try {
    let query = `
      SELECT 
        SUM(calories) as total_calories,
        SUM(protein_g) as total_protein,
        SUM(carbs_g) as total_carbs,
        SUM(fat_g) as total_fat,
        COUNT(*) as log_count
      FROM nutrition_logs
      WHERE user_id = $1`;
    
    const params = [req.user.id];

    if (start_date && end_date) {
      query += ` AND created_at BETWEEN $${params.length + 1} AND $${params.length + 2}`;
      params.push(start_date, end_date);
    }

    const result = await pool.query(query, params);
    res.json({ summary: result.rows[0] || {} });
  } catch (error) {
    console.error('Get macros summary error:', error);
    res.status(500).json({ error: 'Failed to get macros summary' });
  }
});

export default router;
