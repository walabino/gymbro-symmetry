import { Router } from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all progress photos for current user
router.get('/photos', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM progress_photos WHERE user_id = $1 ORDER BY taken_at DESC',
      [req.user.id]
    );
    res.json({ photos: result.rows });
  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({ error: 'Failed to get photos' });
  }
});

// Add new progress photo
router.post('/photos', authenticateToken, async (req, res) => {
  const { photo_url, photo_type, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO progress_photos (user_id, photo_url, photo_type, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, photo_url, photo_type, notes]
    );
    res.status(201).json({ photo: result.rows[0] });
  } catch (error) {
    console.error('Add photo error:', error);
    res.status(500).json({ error: 'Failed to add photo' });
  }
});

// Delete progress photo
router.delete('/photos/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM progress_photos WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Get body measurements
router.get('/measurements', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM body_measurements WHERE user_id = $1 ORDER BY measured_at DESC',
      [req.user.id]
    );
    res.json({ measurements: result.rows });
  } catch (error) {
    console.error('Get measurements error:', error);
    res.status(500).json({ error: 'Failed to get measurements' });
  }
});

// Add body measurement
router.post('/measurements', authenticateToken, async (req, res) => {
  const { weight, body_fat_percentage, muscle_mass, waist, chest, hips, thighs, biceps, notes } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO body_measurements (user_id, weight, body_fat_percentage, muscle_mass, waist, chest, hips, thighs, biceps, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, weight, body_fat_percentage, muscle_mass, waist, chest, hips, thighs, biceps, notes]
    );
    res.status(201).json({ measurement: result.rows[0] });
  } catch (error) {
    console.error('Add measurement error:', error);
    res.status(500).json({ error: 'Failed to add measurement' });
  }
});

export default router;
