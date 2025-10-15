import express from 'express';
import { body } from 'express-validator';
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    exportUsersToCsv,
} from '../controllers/userController.js';
import upload from '../middleware/multerMiddleware.js';

const router = express.Router();

const userValidationRules = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('mobile').isMobilePhone('en-IN').withMessage('Must be a valid Indian mobile number'),
    body('address').notEmpty().withMessage('Address is required'),
    body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    body('status').isIn(['Active', 'Inactive']).withMessage('Status must be Active or Inactive'),
];

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'User routes are working!' });
});

// IMPORTANT: Order matters! More specific routes MUST come before general ones
router.get('/export', exportUsersToCsv);  // Must come before /:id
router.post('/', upload.single('profile'), userValidationRules, createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);  // This should come after /export
router.put('/:id', upload.single('profile'), userValidationRules, updateUser);
router.delete('/:id', deleteUser);

// Debug middleware to log all requests
router.use('*', (req, res, next) => {
    console.log(`Route hit: ${req.method} ${req.originalUrl}`);
    console.log('Params:', req.params);
    next();
});

export default router;
