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


router.post('/', upload.single('profile'), userValidationRules, createUser);
router.get('/', getUsers);
router.get('/export', exportUsersToCsv);
router.get('/:id', getUserById);
router.put('/:id', upload.single('profile'), userValidationRules, updateUser);
router.delete('/:id', deleteUser);

export default router;