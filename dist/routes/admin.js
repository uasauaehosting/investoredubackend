"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('Super Admin'), async (req, res) => {
    try {
        const admins = await models_1.AdminModel.findAll();
        res.json(admins);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('Super Admin'), [
    (0, express_validator_1.body)('username').optional({ values: 'falsy' }).isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    (0, express_validator_1.body)('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').optional({ values: 'falsy' }).isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('firstName').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('lastName').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('role').optional().isIn(['Super Admin', 'Admin', 'Editor']).withMessage('Invalid role'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email } = req.body;
        const existingAdmin = await models_1.AdminModel.findByUsername(username) || await models_1.AdminModel.findByEmail(email);
        if (existingAdmin) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const adminId = await models_1.AdminModel.create(req.body);
        const admin = await models_1.AdminModel.findById(adminId);
        if (!admin) {
            return res.status(500).json({ message: 'Failed to create admin' });
        }
        const { password, ...adminResponse } = admin;
        res.status(201).json(adminResponse);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin'), [
    (0, express_validator_1.body)('username').optional({ values: 'falsy' }).isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    (0, express_validator_1.body)('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('firstName').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('lastName').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('role').optional().isIn(['Super Admin', 'Admin', 'Editor']).withMessage('Invalid role'),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email } = req.body;
        if (username || email) {
            const existingAdmin = await models_1.AdminModel.findByUsername(username) || await models_1.AdminModel.findByEmail(email);
            if (existingAdmin && existingAdmin.id !== parseInt(req.params.id)) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
        }
        const admin = await models_1.AdminModel.findById(parseInt(req.params.id));
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        await models_1.AdminModel.update(parseInt(req.params.id), req.body);
        const updatedAdmin = await models_1.AdminModel.findById(parseInt(req.params.id));
        res.json(updatedAdmin);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin'), async (req, res) => {
    try {
        if (req.params.id === req.admin.id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }
        const admin = await models_1.AdminModel.findById(parseInt(req.params.id));
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        await models_1.AdminModel.delete(parseInt(req.params.id));
        res.json({ message: 'Admin deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:id/toggle-status', auth_1.authenticate, (0, auth_1.authorize)('Super Admin'), async (req, res) => {
    try {
        if (req.params.id === req.admin.id.toString()) {
            return res.status(400).json({ message: 'You cannot change your own status' });
        }
        const admin = await models_1.AdminModel.findById(parseInt(req.params.id));
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        await models_1.AdminModel.update(parseInt(req.params.id), { isActive: !admin.isActive });
        const updatedAdmin = await models_1.AdminModel.findById(parseInt(req.params.id));
        res.json({
            message: `Admin ${updatedAdmin?.isActive ? 'activated' : 'deactivated'} successfully`,
            isActive: updatedAdmin?.isActive
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map