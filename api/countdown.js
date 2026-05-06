// Vercel API route for countdown management
import { createClient } from '@vercel/postgres';

// In-memory storage for development (fallback)
let countdownState = {
  startTime: null,
  duration: {
    days: 10,
    hours: 12
  },
  isActive: false
};

// Database connection for production
const client = createClient();

async function getCountdownState() {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM countdown ORDER BY created_at DESC LIMIT 1');
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return countdownState;
  } catch (error) {
    console.error('Database error, using in-memory storage:', error);
    return countdownState;
  } finally {
    await client.end();
  }
}

async function startCountdown(duration) {
  try {
    await client.connect();
    const startTime = new Date().toISOString();
    const result = await client.query(
      'INSERT INTO countdown (start_time, duration_days, duration_hours, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [startTime, duration.days, duration.hours, true]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error, using in-memory storage:', error);
    
    // Fallback to in-memory storage
    countdownState = {
      startTime: new Date().toISOString(),
      duration,
      isActive: true
    };
    return countdownState;
  } finally {
    await client.end();
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const state = await getCountdownState();
        return res.status(200).json(state);

      case 'POST':
        const { duration } = req.body;

        // Validation
        if (!duration || !duration.days || !duration.hours) {
          return res.status(400).json({
            error: 'Duration object with days and hours is required'
          });
        }

        const newCountdown = await startCountdown(duration);

        // Simulate real-time broadcast
        setTimeout(() => {
          console.log('Broadcasting countdown start:', newCountdown);
        }, 100);

        return res.status(201).json(newCountdown);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
