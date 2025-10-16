import axios from 'axios';

// --- FINAL FIX ---
// We are now hardcoding the live URL of your deployed backend.
// This bypasses any issues with Vercel's environment variables.
// **IMPORTANT**: Replace the URL below with your actual Render URL if it's different.
const API_BASE_URL = 'https://peopleflow-api.onrender.com';

const api = axios.create({
    // The full base URL for all API calls is constructed here
    baseURL: `${API_BASE_URL}/api/users`,
});

// The rest of the functions do not need to change.

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