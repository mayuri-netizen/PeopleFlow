import axios from 'axios';

// For Render deployment
const baseURL = process.env.NODE_ENV === 'production'
    ? '/api'  // Same domain in production
    : 'http://localhost:5000/api'; // Local development

const api = axios.create({
    baseURL: baseURL,
    timeout: 30000,
});

// Rest of your api.js code remains the same...
export const getUsers = async (page = 1, limit = 10, search = '') => {
    try {
        const response = await api.get('/users', {
            params: { page, limit, search }
        });
        return response.data;
    } catch (error) {
        console.error('getUsers error:', error);
        throw error;
    }
};

// ... rest of your existing functions
export const getUserById = async (id) => {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('getUserById error for ID:', id, error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('createUser error:', error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error('updateUser error for ID:', id, error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        if (!id) {
            throw new Error('User ID is required');
        }
        const response = await api.delete(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('deleteUser error for ID:', id, error);
        throw error;
    }
};

export const exportUsersToCsv = async () => {
    try {
        const response = await api.get('/users/export', { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error('exportUsersToCsv error:', error);
        throw error;
    }
};

export default api;
