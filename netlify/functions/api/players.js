const { Player } = require('../../src/types');

// In-memory storage for demo (replace with database in production)
let players = [];

// Simulate storage events for real-time updates
const broadcastUpdate = (updatedPlayers) => {
  // In production, this would use WebSocket or similar
  // For now, we'll simulate with a simple approach
  console.log('Broadcasting player update:', updatedPlayers.length, 'players');
};

exports.handler = async (event, context) => {
  const { httpMethod } = event;

  try {
    switch (httpMethod) {
      case 'GET':
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify(players)
        };
        
      case 'POST':
        const newPlayer = JSON.parse(event.body);
        
        // Validate required fields
        if (!newPlayer.fullName || !newPlayer.fullName.trim()) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Full name is required.' })
          };
        }
        
        if (!newPlayer.username || !newPlayer.username.trim()) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Username is required.' })
          };
        }
        
        if (!newPlayer.phone || !newPlayer.phone.trim()) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Phone number is required.' })
          };
        }
        
        if (!newPlayer.telegram || !newPlayer.telegram.trim()) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Telegram username is required.' })
          };
        }
        
        if (!newPlayer.transactionId || !newPlayer.transactionId.trim()) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Transaction ID is required.' })
          };
        }
        
        // Validate phone format (Ethiopian numbers)
        if (!/^(09|07)\d{8}$/.test(newPlayer.phone.replace(/\s/g, ''))) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Please enter a valid Ethiopian phone number (starting with 09 or 07).' })
          };
        }
        
        // Check for duplicates
        if (players.some(p => p.username.toLowerCase() === newPlayer.username.toLowerCase())) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'This username is already registered.' })
          };
        }
        
        if (players.some(p => p.phone === newPlayer.phone)) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'This phone number is already registered.' })
          };
        }
        
        if (players.length >= 32) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Tournament is full! All 32 slots have been taken.' })
          };
        }
        
        const player = {
          id: Date.now().toString(),
          registeredAt: new Date().toISOString(),
          paymentStatus: 'pending',
          ...newPlayer
        };
        
        players.push(player);
        broadcastUpdate();
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ success: true, message: 'Registration successful!' })
        };
        
      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
