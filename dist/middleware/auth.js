"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const admin = await models_1.AdminModel.findById(decoded.id);
        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: 'Invalid token or admin not found.' });
        }
        const { password, ...adminWithoutPassword } = admin;
        req.admin = adminWithoutPassword;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ message: 'Access denied.' });
        }
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({ message: 'Insufficient permissions.' });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map