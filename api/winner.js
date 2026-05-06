// Vercel API route for winner management
import { createClient } from '@vercel/postgres';

// In-memory storage for development (fallback)
let winner = null;

// Database connection for production
const client = createClient();

async function getWinner() {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM winner ORDER BY created_at DESC LIMIT 1');
    return result.rows[0] || null;
  } catch (error) {
    console.error('Database error, using in-memory storage:', error);
    return winner;
  } finally {
    await client.end();
  }
}

async function setWinner(winnerData) {
  try {
    await client.connect();
    const result = await client.query(
      'INSERT INTO winner (name, username, prize, position, achievements) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [winnerData.name, winnerData.username, winnerData.prize, winnerData.position, winnerData.achievements]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error, using in-memory storage:', error);
    
    // Fallback to in-memory storage
    winner = {
      ...winnerData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    return winner;
  } finally {
    await client.end();
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const currentWinner = await getWinner();
        return res.status(200).json(currentWinner);

      case 'POST':
        const { name, username, prize, position, achievements } = req.body;

        // Validation
        if (!name || !username || !prize || !position) {
          return res.status(400).json({
            error: 'Required fields: name, username, prize, position'
          });
        }

        const newWinner = await setWinner({
          name,
          username,
          prize,
          position,
          achievements: achievements || []
        });

        // Simulate real-time broadcast
        setTimeout(() => {
          console.log('Broadcasting new winner announcement:', newWinner);
        }, 100);

        return res.status(201).json(newWinner);

      case 'DELETE':
        winner = null;
        return res.status(200).json({ message: 'Winner deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
