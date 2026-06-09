"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GlobalPolicyAreas_1 = require("../models/GlobalPolicyAreas");
const router = express_1.default.Router();
function parseListParam(value) {
    if (!value)
        return [];
    const raw = Array.isArray(value) ? value.join(',') : value;
    return raw
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && item.toLowerCase() !== 'all');
}
router.get('/', async (req, res) => {
    try {
        const filters = {
            institutions: parseListParam(req.query.institutions),
            categories: parseListParam(req.query.categories),
            is_active: req.query.is_active === 'false' ? false : true,
        };
        const policyAreas = await GlobalPolicyAreas_1.GlobalPolicyAreasModel.getAll(filters);
        res.json(policyAreas);
    }
    catch (error) {
        console.error('Error fetching global policy areas:', error);
        res.status(500).json({ error: 'Failed to fetch global policy areas' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const policyArea = await GlobalPolicyAreas_1.GlobalPolicyAreasModel.getById(parseInt(req.params.id, 10));
        if (!policyArea) {
            return res.status(404).json({ error: 'Global policy area not found' });
        }
        res.json(policyArea);
    }
    catch (error) {
        console.error('Error fetching global policy area:', error);
        res.status(500).json({ error: 'Failed to fetch global policy area' });
    }
});
exports.default = router;
//# sourceMappingURL=global-policy-areas.js.map