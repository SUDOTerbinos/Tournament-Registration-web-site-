let winner = null;

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
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ winner })
        };
        
      case 'POST':
        const { username } = JSON.parse(event.body);
        
        if (!username || !username.trim()) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Username is required' })
          };
        }
        
        winner = {
          username: username.trim(),
          tournamentName: 'eFootball Championship 2026',
          declaredAt: new Date().toISOString()
        };
        
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ success: true, message: 'Winner declared successfully!' })
        };
        
      case 'DELETE':
        winner = null;
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          },
          body: JSON.stringify({ success: true, message: 'Winner cleared successfully!' })
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
