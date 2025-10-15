import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUser, getUserById, updateUser } from '../services/api';
import { FaUserCircle } from 'react-icons/fa';
import './UserFormPage.css';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];
const FILE_SIZE = 5 * 1024 * 1024; // 5MB

const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    mobile: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required('Mobile number is required'),
    address: yup.string().required('Address is required'),
    gender: yup.string().oneOf(['Male', 'Female']).required('Gender is required'),
    status: yup.string().oneOf(['Active', 'Inactive']).required('Status is required'),
    profile: yup.mixed()
        .test('required', 'Profile picture is required for new users', (value, context) => {
            const { isEditMode } = context.options.context;
            return isEditMode || (value && value.length > 0);
        })
        .test('fileSize', 'The file is too large (max 5MB)', (value) =>
            !value || value.length === 0 || value[0].size <= FILE_SIZE
        )
        .test('fileType', 'Unsupported file format', (value) =>
            !value || value.length === 0 || SUPPORTED_FORMATS.includes(value[0].type)
        ),
});

const UserFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [profilePreview, setProfilePreview] = useState(null);

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        context: { isEditMode },
        defaultValues: { status: 'Active' },
    });

    const profileFile = watch('profile');

    useEffect(() => {
        if (profileFile && profileFile[0]) {
            const file = profileFile[0];
            const previewUrl = URL.createObjectURL(file);
            setProfilePreview(previewUrl);
            return () => URL.revokeObjectURL(previewUrl);
        }
    }, [profileFile]);

    useEffect(() => {
        if (isEditMode) {
            setIsLoading(true);
            const fetchUserData = async () => {
                try {

                    const response = await getUserById(id);
                    const userData = response.data || response;

                    setValue('firstName', userData.firstName);
                    setValue('lastName', userData.lastName);
                    setValue('email', userData.email);
                    setValue('mobile', userData.mobile);
                    setValue('address', userData.address);
                    setValue('gender', userData.gender);
                    setValue('status', userData.status);
                    setProfilePreview(userData.profile);

                } catch (error) {
                    toast.error('Failed to fetch user data.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUserData();
        }
    }, [id, setValue, isEditMode]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        const formData = new FormData();

        Object.keys(data).forEach(key => {
            if (key === 'profile') {
                if (data.profile && data.profile[0]) {
                    formData.append('profile', data.profile[0]);
                }
            } else {
                formData.append(key, data[key]);
            }
        });

        try {
            if (isEditMode) {
                await updateUser(id, formData);
                toast.success('User updated successfully!');
            } else {
                await createUser(formData);
                toast.success('User created successfully!');
            }
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.msg || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isEditMode) {
        return <div className="loading-form">Loading form...</div>;
    }

    return (
        <div className="user-form-page">
            <div className="form-container">
                <h2 className="form-title">
                    {isEditMode ? 'Edit User' : 'Register Your Details'}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="user-form">
                    <div className="profile-section">
                        <label className="profile-label">Select Your Profile</label>

                        {profilePreview ? (
                            <img src={profilePreview} alt="Profile Preview" className="profile-preview" />
                        ) : (
                            <div className="profile-placeholder">
                                <FaUserCircle className="placeholder-icon" />
                            </div>
                        )}

                        <input
                            type="file"
                            id="profile-input"
                            {...register('profile')}
                            accept="image/*"
                            className="file-input"
                        />
                        <label htmlFor="profile-input" className="file-label">Choose Image</label>

                        {errors.profile && <div className="error-message">{errors.profile.message}</div>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" {...register('firstName')} />
                            {errors.firstName && <div className="error-message">{errors.firstName.message}</div>}
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" {...register('lastName')} />
                            {errors.lastName && <div className="error-message">{errors.lastName.message}</div>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" {...register('email')} />
                            {errors.email && <div className="error-message">{errors.email.message}</div>}
                        </div>

                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="tel" {...register('mobile')} />
                            {errors.mobile && <div className="error-message">{errors.mobile.message}</div>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Select Your Gender</label>
                            <div className="radio-group">
                                <label className="radio-label">
                                    <input type="radio" value="Male" {...register('gender')} />
                                    Male
                                </label>
                                <label className="radio-label">
                                    <input type="radio" value="Female" {...register('gender')} />
                                    Female
                                </label>
                            </div>
                            {errors.gender && <div className="error-message">{errors.gender.message}</div>}
                        </div>

                        <div className="form-group">
                            <label>Select Your Status</label>
                            <select {...register('status')}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {errors.status && <div className="error-message">{errors.status.message}</div>}
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Enter Your Location</label>
                        <textarea {...register('address')} rows="3"></textarea>
                        {errors.address && <div className="error-message">{errors.address.message}</div>}
                    </div>

                    <div className="form-actions">
                        {isEditMode && (
                            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
                                Back
                            </button>
                        )}
                        <button type="submit" disabled={isLoading} className="btn btn-primary">
                            {isLoading ? 'Submitting...' : (isEditMode ? 'Update User' : 'Submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormPage;
