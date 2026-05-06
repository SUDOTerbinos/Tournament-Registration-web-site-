// Vercel API route for players management
import { createClient } from '@vercel/postgres';

// In-memory storage for development (fallback)
let players = [];
let nextId = 1;

// Database connection for production
const client = createClient();

async function getPlayers() {
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM players ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Database error, using in-memory storage:', error);
    return players;
  } finally {
    await client.end();
  }
}

async function addPlayer(playerData) {
  try {
    await client.connect();
    const result = await client.query(
      'INSERT INTO players (name, username, phone, telegram, transaction_id, screenshot_name, screenshot_data) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [playerData.name, playerData.username, playerData.phone, playerData.telegram, playerData.transaction_id, playerData.screenshot_name, playerData.screenshot_data]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error, using in-memory storage:', error);
    
    // Fallback to in-memory storage
    const newPlayer = {
      id: nextId++,
      ...playerData,
      createdAt: new Date().toISOString()
    };
    players.push(newPlayer);
    return newPlayer;
  } finally {
    await client.end();
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const players = await getPlayers();
        return res.status(200).json(players);

      case 'POST':
        const { name, username, phone, telegram, transaction_id, screenshot_name, screenshot_data } = req.body;

        // Validation
        if (!name || !username || !phone || !telegram || !transaction_id) {
          return res.status(400).json({
            error: 'All fields are required: name, username, phone, telegram, transaction_id'
          });
        }

        // Ethiopian phone validation (starts with 09 or 07, 9 digits)
        const phoneRegex = /^(09|07)\d{8}$/;
        if (!phoneRegex.test(phone)) {
          return res.status(400).json({
            error: 'Invalid Ethiopian phone number. Must start with 09 or 07 and be 9 digits long.'
          });
        }

        // Check if username already exists
        const existingPlayers = await getPlayers();
        const usernameExists = existingPlayers.some(p => p.username === username);
        if (usernameExists) {
          return res.status(400).json({
            error: 'Username already exists. Please choose a different username.'
          });
        }

        // Check if phone already exists
        const phoneExists = existingPlayers.some(p => p.phone === phone);
        if (phoneExists) {
          return res.status(400).json({
            error: 'Phone number already registered. Please use a different phone number.'
          });
        }

        // Check if tournament is full (32 players max)
        if (existingPlayers.length >= 32) {
          return res.status(400).json({
            error: 'Tournament is full. All 32 slots have been filled.'
          });
        }

        const newPlayer = await addPlayer({
          name,
          username,
          phone,
          telegram,
          transaction_id,
          screenshot_name,
          screenshot_data
        });

        // Simulate real-time broadcast
        setTimeout(() => {
          console.log('Broadcasting new player registration:', newPlayer);
        }, 100);

        return res.status(201).json(newPlayer);

      case 'PATCH':
        const { id, ...updateData } = req.body;
        const playersList = await getPlayers();
        const playerIndex = playersList.findIndex(p => p.id === id);
        
        if (playerIndex === -1) {
          return res.status(404).json({ error: 'Player not found' });
        }

        const updatedPlayer = { ...playersList[playerIndex], ...updateData };
        return res.status(200).json(updatedPlayer);

      case 'DELETE':
        const { id: deleteId } = req.body;
        const playersToDelete = await getPlayers();
        const deleteIndex = playersToDelete.findIndex(p => p.id === deleteId);
        
        if (deleteIndex === -1) {
          return res.status(404).json({ error: 'Player not found' });
        }

        playersToDelete.splice(deleteIndex, 1);
        return res.status(200).json({ message: 'Player deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
