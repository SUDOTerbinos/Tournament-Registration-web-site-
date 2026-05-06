let countdownData = null;

// Simulate real-time updates to connected clients
const clients = new Set();

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
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ startTime: countdownData?.startTime || null })
        };
        
      case 'POST':
        const { startTime, duration } = JSON.parse(event.body);
        
        if (!startTime) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Start time is required' })
          };
        }
        
        countdownData = {
          startTime: startTime,
          duration: duration || { days: 10, hours: 12 }
        };
        
        // Broadcast countdown start to all connected clients
        const updateMessage = {
          type: 'COUNTDOWN_STARTED',
          data: { startTime, duration }
        };
        
        clients.forEach(client => {
          if (client.readyState === 1) { // WebSocket.OPEN
            client.send(JSON.stringify(updateMessage));
          }
        });
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ success: true, message: 'Countdown started successfully!' })
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
