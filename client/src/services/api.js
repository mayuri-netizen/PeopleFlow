import axios from 'axios';

// Create an Axios instance with a base URL.
// This is better than repeating the URL everywhere.
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Our backend server URL
});

// Function to get users, with support for pagination and search
export const getUsers = async (page = 1, limit = 10, search = '') => {
    try {
        const response = await api.get('/users', {
            params: { page, limit, search },
        });
        return response.data;
    } catch (error) {
        // It's good practice to handle errors and re-throw them
        // so the component can catch them.
        console.error('Error fetching users:', error);
        throw error;
    }
};

// We can add the other API functions here as we need them
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (userData) => api.post('/users', userData);
export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const exportUsersToCsv = () => api.get('/users/export', { responseType: 'blob' });

export default api;