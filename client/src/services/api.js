import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: `${API_URL}/api`,
});


api.interceptors.request.use(config => {
    if (config.data instanceof FormData) {

    } else {

        config.headers['Content-Type'] = 'application/json';
    }
    return config;
});

export const getUsers = (page = 1, limit = 10, search = '') => {
    return api.get('/users', {
        params: { page, limit, search }
    });
};

export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const exportUsersToCsv = async () => {
    const response = await api.get('/users/export', { responseType: 'blob' });
    return response.data;
};

export default api;