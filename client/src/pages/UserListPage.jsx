import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, deleteUser, exportUsersToCsv } from '../services/api';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import ActionDropdown from '../components/ActionDropdown';
import SkeletonLoader from '../components/SkeletonLoader';
import ConfirmModal from '../components/ConfirmModal';
import './UserListPage.css';

const UserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [query, setQuery] = useState('');

    // State for the confirmation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const data = await getUsers(currentPage, 10, query);
                setUsers(data.users);
                setTotalPages(data.totalPages);
                setError(null);
            } catch (err) {
                setError('Failed to fetch users. Please make sure the backend server is running.');
            } finally {
                // A small delay to make the skeleton loader feel smoother
                setTimeout(() => setLoading(false), 500);
            }
        };
        fetchUsers();
    }, [currentPage, query]);

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(userToDelete);
                setUsers(users.filter((user) => user._id !== userToDelete));
                toast.success('User deleted successfully!');
                if (users.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
            } catch (err) {
                toast.error('Failed to delete user.');
            } finally {
                setIsModalOpen(false);
                setUserToDelete(null);
            }
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setQuery(searchTerm);
    }

    const handleExport = async () => {
        try {
            const data = await exportUsersToCsv();
            const blob = new Blob([data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.csv';
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Users exported successfully!");
        } catch (error) {
            toast.error("Failed to export users.");
        }
    };

    if (error) { return <div className="error-message">{error}</div>; }

    return (
        <>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this user? This action cannot be undone."
            />

            <div className="user-list-page">
                <div className="page-header">
                    <form className="search-container" onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className="action-btn search-btn">Search</button>
                    </form>
                    <div className="header-actions">
                        <Link to="/add" className="action-btn add-user-btn">Add User</Link>
                        <button onClick={handleExport} className="action-btn export-btn">Export to CSV</button>
                    </div>
                </div>

                {loading ? (
                    <SkeletonLoader />
                ) : (
                    <>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Profile</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Gender</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={user._id}>
                                            <td data-label="ID">{(currentPage - 1) * 10 + index + 1}</td>
                                            <td data-label="Profile">
                                                <img src={user.profile} alt={`${user.firstName}`} className="profile-image" />
                                            </td>
                                            <td data-label="Full Name">{`${user.firstName} ${user.lastName}`}</td>
                                            <td data-label="Email">{user.email}</td>
                                            <td data-label="Gender">{user.gender}</td>
                                            <td data-label="Status">
                                                <span className={`status-badge ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td data-label="Action">
                                                <ActionDropdown userId={user._id} onDelete={handleDeleteClick} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {users.length === 0 && !loading && (
                            <div className="no-users-message">
                                <p>No users found for this query.</p>
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default UserListPage;

