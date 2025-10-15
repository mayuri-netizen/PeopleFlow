import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import cloudinary from '../config/cloudinaryConfig.js';

// Helper function to handle uploading a file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', folder: 'user-profiles' },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(fileBuffer);
    });
};

export const createUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.file) {
            return res.status(400).json({ errors: [{ msg: 'Profile image is required.' }] });
        }

        const { firstName, lastName, email, mobile, address, gender, status } = req.body;

        let user = await User.findOne({ $or: [{ email }, { mobile }] });
        if (user) {
            return res.status(400).json({ msg: 'User with this email or mobile number already exists' });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        user = new User({
            firstName,
            lastName,
            email,
            mobile,
            address,
            gender,
            status,
            profile: result.secure_url,
        });

        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const users = await User.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 });
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limitNum);

        res.json({
            users,
            currentPage: pageNum,
            totalPages,
            totalUsers,
        });
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        console.log('Getting user by ID:', req.params.id);

        const { id } = req.params;

        // Validate if id is a valid MongoDB ObjectId
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                error: 'Invalid user ID format',
                receivedId: id
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
                id: id
            });
        }

        console.log('User found:', user._id);
        res.json(user);
    } catch (err) {
        console.error('Get user by ID error:', err);

        if (err.name === 'CastError') {
            return res.status(400).json({
                error: 'Invalid user ID format',
                details: err.message
            });
        }

        res.status(500).json({
            error: 'Server Error',
            details: err.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updateData = { ...req.body };

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);
            updateData.profile = result.secure_url;

            if (user.profile) {
                const publicId = user.profile.split('/').pop().split('.')[0];
                cloudinary.uploader.destroy(`user-profiles/${publicId}`);
            }
        }

        user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        res.json(user);
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);

        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};

export const exportUsersToCsv = async (req, res) => {
    try {
        const users = await User.find({}).lean();

        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found to export' });
        }

        const csvFields = ['firstName', 'lastName', 'email', 'mobile', 'gender', 'status', 'address', 'createdAt'];
        const json2csvParser = new Parser({ fields: csvFields });
        const csvData = json2csvParser.parse(users);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.status(200).send(csvData);
    } catch (err) {
        console.error('Export CSV error:', err);
        res.status(500).json({ error: 'Server Error', details: err.message });
    }
};
