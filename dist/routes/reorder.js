"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const reorder_1 = require("../utils/reorder");
const router = express_1.default.Router();
router.put('/', auth_1.authenticate, (0, auth_1.authorize)('Super Admin', 'Admin', 'Editor'), [
    (0, express_validator_1.body)('resource').isString().notEmpty().withMessage('resource is required'),
    (0, express_validator_1.body)('ids').isArray({ min: 1 }).withMessage('ids must be a non-empty array'),
    (0, express_validator_1.body)('ids.*').isInt().withMessage('Each id must be an integer'),
    (0, express_validator_1.body)('section').optional().isString(),
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { resource, section } = req.body;
        if (!(0, reorder_1.isReorderResource)(resource)) {
            return res.status(400).json({ message: `Unknown reorder resource: ${resource}` });
        }
        const ids = req.body.ids.map((id) => parseInt(String(id), 10));
        await (0, reorder_1.reorderRecords)(resource, ids, section);
        res.json({ message: 'Order updated successfully', resource, ids });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=reorder.js.map