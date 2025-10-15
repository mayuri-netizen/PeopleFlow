import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../services/api';
import { toast } from 'react-toastify';
import { FaEnvelope, FaMobileAlt, FaMapMarkerAlt, FaVenusMars } from 'react-icons/fa';
import './UserDetailsPage.css';

const UserDetailsPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await getUserById(id);
                const userData = response.data || response;
                setUser(userData);
            } catch (err) {
                setError('Could not find user. They may have been deleted.');
                toast.error('Could not find user.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) {
        return <div className="loading-container">Loading user details...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (!user) {
        return <div className="no-data-container">No user data to display.</div>;
    }

    return (
        <div className="user-details-page">
            <div className="details-container">
                <div className="details-header">
                    <img
                        src={user.profile}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="avatar"
                    />
                    <div className="user-name">
                        {user.firstName} {user.lastName}
                    </div>
                </div>

                <div className="details-body">
                    <div className="info-item">
                        <FaEnvelope className="icon" />
                        <span>{user.email}</span>
                    </div>

                    <div className="info-item">
                        <FaMobileAlt className="icon" />
                        <span>{user.mobile}</span>
                    </div>

                    <div className="info-item">
                        <FaMapMarkerAlt className="icon" />
                        <span>{user.address}</span>
                    </div>

                    <div className="info-item">
                        <FaVenusMars className="icon" />
                        <span>{user.gender}</span>
                    </div>
                </div>

                <div className="details-footer">
                    <div className="action-buttons">
                        <Link to={`/edit/${user._id}`} className="action-btn edit-btn">
                            Edit User
                        </Link>
                        <Link to="/" className="action-btn back-btn">
                            Back to List
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsPage;
