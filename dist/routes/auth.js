"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/login', [
    (0, express_validator_1.body)('username').notEmpty().withMessage('Username is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username } = req.body;
        const admin = await models_1.AdminModel.findByUsername(username);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await models_1.AdminModel.comparePassword(req.body.password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        await models_1.AdminModel.update(admin.id, { lastLogin: new Date() });
        const token = jsonwebtoken_1.default.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
        res.json({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
                role: admin.role,
                permissions: admin.permissions
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/me', auth_1.authenticate, async (req, res) => {
    res.json({
        admin: {
            id: req.admin.id,
            username: req.admin.username,
            email: req.admin.email,
            firstName: req.admin.firstName,
            lastName: req.admin.lastName,
            role: req.admin.role,
            permissions: req.admin.permissions,
            lastLogin: req.admin.lastLogin
        }
    });
});
router.post('/change-password', auth_1.authenticate, [
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { currentPassword, newPassword } = req.body;
        const admin = await models_1.AdminModel.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        const isMatch = await models_1.AdminModel.comparePassword(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        await models_1.AdminModel.update(admin.id, { password: newPassword });
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map