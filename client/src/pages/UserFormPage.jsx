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

// UPDATED: Validation schema now correctly handles edit mode
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
            // THIS IS THE FIX: We get isEditMode from the context passed to useForm
            const { isEditMode } = context.options.context;
            // The profile is only required if it's NOT in edit mode.
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
        context: { isEditMode }, // Pass isEditMode to the validation context
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
                    const { data } = await getUserById(id);
                    setValue('firstName', data.firstName);
                    setValue('lastName', data.lastName);
                    setValue('email', data.email);
                    setValue('mobile', data.mobile);
                    setValue('address', data.address);
                    setValue('gender', data.gender);
                    setValue('status', data.status);
                    setProfilePreview(data.profile);
                } catch (error) { toast.error('Failed to fetch user data.'); }
                finally { setIsLoading(false); }
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
        return <div className="loading-message">Loading form...</div>;
    }

    return (
        <div className="form-container">
            <h1>{isEditMode ? 'Edit User' : 'Register Your Details'}</h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="form-group">
                    <label>Select Your Profile</label>
                    <div className="profile-uploader">
                        {profilePreview ? (
                            <img src={profilePreview} alt="Profile Preview" className="profile-preview" />
                        ) : (
                            <div className="profile-preview">
                                <FaUserCircle />
                            </div>
                        )}
                        <label htmlFor="profile" className="upload-label">Choose Image</label>
                        <input type="file" id="profile" accept="image/*" {...register('profile')} />
                    </div>
                    {errors.profile && <p className="error-text">{errors.profile.message}</p>}
                </div>

                <div className="form-row">
                    <div className="form-group half-width">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" placeholder="Enter FirstName" {...register('firstName')} />
                        {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
                    </div>
                    <div className="form-group half-width">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" placeholder="Enter LastName" {...register('lastName')} />
                        {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter Email" {...register('email')} />
                    {errors.email && <p className="error-text">{errors.email.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <input type="tel" id="mobile" placeholder="Enter Mobile" {...register('mobile')} />
                    {errors.mobile && <p className="error-text">{errors.mobile.message}</p>}
                </div>
                <div className="form-row">
                    <div className="form-group half-width">
                        <label>Select Your Gender</label>
                        <div className="gender-group">
                            <div className="gender-option">
                                <input type="radio" id="male" value="Male" {...register('gender')} />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div className="gender-option">
                                <input type="radio" id="female" value="Female" {...register('gender')} />
                                <label htmlFor="female">Female</label>
                            </div>
                        </div>
                        {errors.gender && <p className="error-text">{errors.gender.message}</p>}
                    </div>
                    <div className="form-group half-width">
                        <label htmlFor="status">Select Your Status</label>
                        <select id="status" {...register('status')}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        {errors.status && <p className="error-text">{errors.status.message}</p>}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Enter Your Location</label>
                    <input type="text" id="address" placeholder="Enter Your Location" {...register('address')} />
                    {errors.address && <p className="error-text">{errors.address.message}</p>}
                </div>

                <div className="form-actions">
                    <button type="button" className="back-btn" onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : (isEditMode ? 'Update User' : 'Submit')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserFormPage;

