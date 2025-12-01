export const API_CONFIG = {
    HOST_URL: 'https://colgate.onrender.com',
    ENDPOINTS: {
        REGISTER: '/api/auth/register',
        LOGIN: '/api/auth/login',
        GAME_ACTIVITIES: '/api/game-activities',
    }
};

export const makeRequest = async (endpoint: string, method: string, data?: any, token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`🚀 API Request: ${method} ${endpoint}`);
    console.log('🔐 Request Headers:', headers);

    try {
        const response = await fetch(`${API_CONFIG.HOST_URL}${endpoint}`, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
        });

        const result = await response.json();
        console.log('✅ API Response:', result);

        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }

        return result;
    } catch (error) {
        throw error;
    }
};
