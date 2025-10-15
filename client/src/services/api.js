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


export const getUsers = async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/users', {
        params: { page, limit, search }
    });
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export const exportUsersToCsv = async () => {
    const response = await api.get('/users/export', { responseType: 'blob' });
    return response.data;
};

export default api;

