"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const home_1 = __importDefault(require("./home"));
const about_1 = __importDefault(require("./about"));
const investor_education_1 = __importDefault(require("./investor-education"));
const portals_1 = __importDefault(require("./portals"));
const alerts_bulletins_1 = __importDefault(require("./alerts-bulletins"));
const programs_1 = __importDefault(require("./programs"));
const glossary_1 = __importDefault(require("./glossary"));
const feedback_1 = __importDefault(require("./feedback"));
const admin_1 = __importDefault(require("./admin"));
const upload_1 = __importDefault(require("./upload"));
const router = express_1.default.Router();
router.use('/auth', auth_1.default);
router.use('/home', home_1.default);
router.use('/about', about_1.default);
router.use('/investor-education', investor_education_1.default);
router.use('/portals', portals_1.default);
router.use('/alerts-bulletins', alerts_bulletins_1.default);
router.use('/programs', programs_1.default);
router.use('/glossary', glossary_1.default);
router.use('/feedback', feedback_1.default);
router.use('/admin', admin_1.default);
router.use('/upload', upload_1.default);
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'UASA Investor Education Portal API is running'
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map