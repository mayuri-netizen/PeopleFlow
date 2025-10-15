import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../services/api';
import { toast } from 'react-toastify';
// We are removing FaUserCircle, but keeping the others
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
                const { data } = await getUserById(id);
                setUser(data);
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
        return <div className="loading-message">Loading user details...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!user) {
        return <div className="loading-message">No user data to display.</div>;
    }

    return (
        <div className="details-container">
            <div className="details-header">
                {/* === THIS IS THE MAIN CHANGE === */}
                {/* Instead of an icon, we now use an img tag with the user's profile URL */}
                <img
                    src={user.profile}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="avatar"
                />
                <h1 className="user-name">{user.firstName} {user.lastName}</h1>
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
                <Link to="/" className="back-button">Back to List</Link>
            </div>
        </div>
    );
};

export default UserDetailsPage;