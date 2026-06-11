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
router.post('/', [
    (0, express_validator_1.body)('name').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('email').optional({ values: 'falsy' }).isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('subject').optional({ values: 'falsy' }),
    (0, express_validator_1.body)('message').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const feedbackId = await models_1.Feedback.create(req.body);
        const feedback = await models_1.Feedback.findById(feedbackId);
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const { status, category, search } = req.query;
        let query = { isActive: true };
        if (status && status !== 'all') {
            query.status = status;
        }
        if (category && category !== 'all') {
            query.category = category;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }
        const feedback = await models_1.Feedback.findAll();
        const filteredFeedback = feedback.filter(item => {
            const matchStatus = !status || status === 'all' || item.status === status;
            const matchCategory = !category || category === 'all' || item.category === category;
            const matchSearch = !search || [
                item.name,
                item.email,
                item.subject,
                item.message
            ].some(field => field.toLowerCase().includes(search.toString().toLowerCase()));
            return matchStatus && matchCategory && matchSearch;
        });
        const sortedFeedback = filteredFeedback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        res.json(sortedFeedback);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const feedback = await models_1.Feedback.findById(parseInt(req.params.id));
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:id/respond', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('response').optional({ values: 'falsy' }),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const success = await models_1.Feedback.respondToFeedback(parseInt(req.params.id), req.body.response, req.admin.username);
        if (!success) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        const feedback = await models_1.Feedback.findById(parseInt(req.params.id));
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:id/status', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), [
    (0, express_validator_1.body)('status').isIn(['Pending', 'In Progress', 'Resolved', 'Closed']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const success = await models_1.Feedback.updateStatus(parseInt(req.params.id), req.body.status);
        if (!success) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        const feedback = await models_1.Feedback.findById(parseInt(req.params.id));
        res.json(feedback);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const success = await models_1.Feedback.delete(parseInt(req.params.id));
        if (!success) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        res.json({ message: 'Feedback deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/stats/summary', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const allFeedback = await models_1.Feedback.findAll();
        const activeFeedback = allFeedback.filter(f => f.isActive);
        const total = activeFeedback.length;
        const pending = activeFeedback.filter(f => f.status === 'Pending').length;
        const inProgress = activeFeedback.filter(f => f.status === 'In Progress').length;
        const resolved = activeFeedback.filter(f => f.status === 'Resolved').length;
        const closed = activeFeedback.filter(f => f.status === 'Closed').length;
        const categoryStats = activeFeedback.reduce((acc, feedback) => {
            const existing = acc.find(item => item._id === feedback.category);
            if (existing) {
                existing.count += 1;
            }
            else {
                acc.push({ _id: feedback.category, count: 1 });
            }
            return acc;
        }, []).sort((a, b) => b.count - a.count);
        res.json({
            total,
            pending,
            inProgress,
            resolved,
            closed,
            categoryStats
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=feedback.js.map