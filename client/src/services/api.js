import axios from 'axios';

const baseURL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

console.log('API Base URL:', baseURL);

const api = axios.create({
    baseURL: baseURL,
    timeout: 30000,
});

api.interceptors.request.use(
    (config) => {
        console.log('Making API request to:', config.baseURL + config.url);

        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        } else {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log('API response received:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error Details:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
        });
        return Promise.reject(error);
    }
);

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

export const getUserById = async (id) => {
    try {
        console.log('Fetching user by ID:', id);

        if (!id) {
            throw new Error('User ID is required');
        }

        const response = await api.get(`/users/${id}`);
        console.log('getUserById response:', response.data);
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
        console.log('Updating user:', id, userData);

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
