import { Router } from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Get all workouts for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cw.*, u.name as created_by_name 
       FROM custom_workouts cw
       LEFT JOIN users u ON cw.created_by = u.id
       WHERE cw.user_id = $1 OR cw.is_public = true
       ORDER BY cw.created_at DESC`,
      [req.user.id]
    );
    res.json({ workouts: result.rows });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Failed to get workouts' });
  }
});

// Get workout by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT cw.*, u.name as created_by_name 
       FROM custom_workouts cw
       LEFT JOIN users u ON cw.created_by = u.id
       WHERE cw.id = $1 AND (cw.user_id = $2 OR cw.is_public = true)`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    // Get exercises for this workout
    const exercises = await pool.query(
      `SELECT el.*, cwe.sets, cwe.reps, cwe.weight, cwe.duration_seconds, cwe.order_index
       FROM custom_workout_exercises cwe
       JOIN exercise_library el ON cwe.exercise_id = el.id
       WHERE cwe.workout_id = $1
       ORDER BY cwe.order_index`,
      [req.params.id]
    );

    res.json({
      workout: result.rows[0],
      exercises: exercises.rows
    });
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ error: 'Failed to get workout' });
  }
});

// Create new workout
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, difficulty, duration_minutes, is_public, exercises } = req.body;

  try {
    const workoutResult = await pool.query(
      `INSERT INTO custom_workouts (user_id, name, description, difficulty, duration_minutes, is_public)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.id, name, description, difficulty, duration_minutes, is_public || false]
    );

    const workout = workoutResult.rows[0];

    // Add exercises if provided
    if (exercises && exercises.length > 0) {
      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        await pool.query(
          `INSERT INTO custom_workout_exercises (workout_id, exercise_id, sets, reps, weight, duration_seconds, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [workout.id, ex.exercise_id, ex.sets, ex.reps, ex.weight, ex.duration_seconds, i]
        );
      }
    }

    res.status(201).json({ workout });
  } catch (error) {
    console.error('Create workout error:', error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// Delete workout
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM custom_workouts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

// Get exercise library
router.get('/library/exercises', authenticateToken, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM exercise_library WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, params);
    res.json({ exercises: result.rows });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Failed to get exercises' });
  }
});

// Add exercise to library (ADMIN/COACH only)
router.post('/library/exercises', authenticateToken, async (req, res) => {
  const { name, description, category, equipment, video_url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO exercise_library (name, description, category, equipment, video_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, category, equipment, video_url]
    );
    res.status(201).json({ exercise: result.rows[0] });
  } catch (error) {
    console.error('Add exercise error:', error);
    res.status(500).json({ error: 'Failed to add exercise' });
  }
});

export default router;
