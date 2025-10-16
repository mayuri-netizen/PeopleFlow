import axios from 'axios';

// This logic automatically determines the correct backend URL.
// On your computer, it uses http://localhost:5000.
// On Vercel, it uses the same domain as the frontend (e.g., /api/users).
const baseURL = import.meta.env.PROD
    ? '/api/users'
    : 'http://localhost:5000/api/users';

const api = axios.create({
    baseURL: baseURL,
});

export const getUsers = async (page = 1, limit = 10, search = '') => {
    try {
        const response = await api.get('/', { params: { page, limit, search } });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/', userData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/${id}`, userData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw error;
    }
};

export const exportUsersToCsv = async () => {
    try {
        const response = await api.get('/export', { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error("Error exporting users:", error);
        throw error;
    }
};

