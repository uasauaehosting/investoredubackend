"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const years = req.query.years
            ? String(req.query.years).split(',').map((y) => y.trim()).filter(Boolean)
            : undefined;
        const authority = req.query.authority ? String(req.query.authority) : undefined;
        const records = await models_1.Benchmarking.findAll({ years, authority });
        res.json(records);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.get('/filters', async (_req, res) => {
    try {
        const filters = await models_1.Benchmarking.getFilterOptions();
        res.json(filters);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const id = await models_1.Benchmarking.create(req.body);
        const record = await models_1.Benchmarking.findById(id);
        res.status(201).json(record);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), async (req, res) => {
    try {
        const updated = await models_1.Benchmarking.update(parseInt(req.params.id), req.body);
        if (!updated)
            return res.status(404).json({ message: 'Record not found' });
        const record = await models_1.Benchmarking.findById(parseInt(req.params.id));
        res.json(record);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin'), async (req, res) => {
    try {
        const deleted = await models_1.Benchmarking.delete(parseInt(req.params.id));
        if (!deleted)
            return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=benchmarking.js.map