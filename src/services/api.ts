import { Player, Winner } from '../types';

// API base URL - use Vercel API routes in production, localhost in development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3000/api';

// API endpoints
export const API_ENDPOINTS = {
  PLAYERS: '/players',
  PLAYER: '/player',
  WINNER: '/winner',
  COUNTDOWN: '/countdown'
} as const;

// HTTP client helper
async function apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response;
}

// Player API functions
export async function getPlayersFromAPI(): Promise<Player[]> {
  try {
    const response = await apiCall(API_ENDPOINTS.PLAYERS);
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch players:', error);
    return [];
  }
}

export async function savePlayerToAPI(player: Omit<Player, 'id' | 'registeredAt'>): Promise<{ success: boolean; message: string }> {
  try {
    const response = await apiCall(API_ENDPOINTS.PLAYER, {
      method: 'POST',
      body: JSON.stringify(player)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Failed to save player:', error);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
}

export async function updatePlayerStatusAPI(playerId: string, status: Player['paymentStatus']): Promise<void> {
  try {
    await apiCall(`${API_ENDPOINTS.PLAYER}/${playerId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus: status })
    });
  } catch (error) {
    console.error('Failed to update player status:', error);
  }
}

export async function removePlayerFromAPI(playerId: string): Promise<void> {
  try {
    await apiCall(`${API_ENDPOINTS.PLAYER}/${playerId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to remove player:', error);
  }
}

// Winner API functions
export async function getWinnerFromAPI(): Promise<Winner | null> {
  try {
    const response = await apiCall(API_ENDPOINTS.WINNER);
    const data = await response.json();
    return data.winner || null;
  } catch (error) {
    console.error('Failed to fetch winner:', error);
    return null;
  }
}

export async function setWinnerToAPI(username: string): Promise<void> {
  try {
    await apiCall(API_ENDPOINTS.WINNER, {
      method: 'POST',
      body: JSON.stringify({ 
        username,
        tournamentName: 'eFootball Championship 2026',
        declaredAt: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Failed to set winner:', error);
  }
}

export async function clearWinnerFromAPI(): Promise<void> {
  try {
    await apiCall(API_ENDPOINTS.WINNER, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to clear winner:', error);
  }
}

// Countdown API functions
export async function getCountdownStartFromAPI(): Promise<string | null> {
  try {
    const response = await apiCall(API_ENDPOINTS.COUNTDOWN);
    const data = await response.json();
    return data.startTime || null;
  } catch (error) {
    console.error('Failed to fetch countdown start:', error);
    return null;
  }
}

export async function setCountdownStartToAPI(): Promise<void> {
  try {
    await apiCall(API_ENDPOINTS.COUNTDOWN, {
      method: 'POST',
      body: JSON.stringify({ 
        startTime: new Date().toISOString(),
        duration: { days: 10, hours: 12 }
      })
    });
  } catch (error) {
    console.error('Failed to start countdown:', error);
  }
}

// WebSocket connection for real-time updates
export function connectWebSocket(url: string, onMessage: (data: any) => void): WebSocket | null {
  try {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('WebSocket connected for real-time updates');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return ws;
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
    return null;
  }
}
