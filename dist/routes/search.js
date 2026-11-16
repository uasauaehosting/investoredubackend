"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../utils/database");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    const raw = (req.query.q ?? '').toString().trim();
    if (!raw) {
        return res.status(400).json({ message: 'Query parameter "q" is required.' });
    }
    const q = raw.slice(0, 200);
    const like = `%${q}%`;
    try {
        const [news, publications, programs, portals, glossary, principles, frameworks, products, alerts,] = await Promise.all([
            (0, database_1.executeQuery)(`SELECT id, title, title_ar AS titleAr, excerpt AS description, excerpt_ar AS descriptionAr
         FROM news
         WHERE is_active = 1
           AND (title LIKE ? OR title_ar LIKE ? OR excerpt LIKE ? OR excerpt_ar LIKE ?)
         ORDER BY display_order ASC, date DESC
         LIMIT 10`, [like, like, like, like]),
            (0, database_1.executeQuery)(`SELECT id, title, title_ar AS titleAr, description, description_ar AS descriptionAr, authority_name, file_url AS fileUrl
         FROM publications
         WHERE is_active = 1
           AND (title LIKE ? OR title_ar LIKE ? OR description LIKE ? OR description_ar LIKE ? OR authority_name LIKE ?)
         ORDER BY display_order ASC, date_published DESC
         LIMIT 10`, [like, like, like, like, like]),
            (0, database_1.executeQuery)(`SELECT id, member_name AS title, NULL AS titleAr, description, NULL AS descriptionAr
         FROM programs
         WHERE is_active = 1
           AND (member_name LIKE ? OR description LIKE ?)
         ORDER BY display_order ASC, created_at DESC
         LIMIT 10`, [like, like]),
            (0, database_1.executeQuery)(`SELECT id, title, title_ar AS titleAr, description, description_ar AS descriptionAr, authority_name, link
         FROM portals
         WHERE is_active = 1
           AND (title LIKE ? OR title_ar LIKE ? OR description LIKE ? OR description_ar LIKE ? OR authority_name LIKE ?)
         ORDER BY display_order ASC, created_at DESC
         LIMIT 10`, [like, like, like, like, like]),
            (0, database_1.executeQuery)(`SELECT id, term AS title, arabic_term AS titleAr, definition AS description, arabic_definition AS descriptionAr
         FROM glossary_terms
         WHERE is_active = 1
           AND (term LIKE ? OR arabic_term LIKE ? OR definition LIKE ? OR arabic_definition LIKE ?)
         ORDER BY display_order ASC, term ASC
         LIMIT 10`, [like, like, like, like]),
            (0, database_1.executeQuery)(`SELECT id, title, title_ar AS titleAr, description, description_ar AS descriptionAr
         FROM principles
         WHERE is_active = 1
           AND (title LIKE ? OR title_ar LIKE ? OR description LIKE ? OR description_ar LIKE ?)
         ORDER BY display_order ASC, date DESC
         LIMIT 10`, [like, like, like, like]),
            (0, database_1.executeQuery)(`SELECT id, title, title_ar AS titleAr, description, description_ar AS descriptionAr
         FROM frameworks
         WHERE is_active = 1
           AND (title LIKE ? OR title_ar LIKE ? OR description LIKE ? OR description_ar LIKE ?)
         ORDER BY display_order ASC, date DESC
         LIMIT 10`, [like, like, like, like]),
            (0, database_1.executeQuery)(`SELECT id, title, NULL AS titleAr, description, NULL AS descriptionAr, slug
         FROM investment_products
         WHERE is_active = 1
           AND (title LIKE ? OR description LIKE ?)
         ORDER BY display_order ASC, date DESC
         LIMIT 10`, [like, like]),
            (0, database_1.executeQuery)(`SELECT id, title, title_ar AS titleAr, description, description_ar AS descriptionAr, type, link
         FROM alerts_bulletins
         WHERE is_active = 1
           AND (title LIKE ? OR title_ar LIKE ? OR description LIKE ? OR description_ar LIKE ?)
         ORDER BY display_order ASC, date_published DESC
         LIMIT 10`, [like, like, like, like]),
        ]);
        const shape = (rows, type, hrefFn) => rows.map((r) => ({
            id: r.id,
            type,
            title: r.title ?? '',
            titleAr: r.titleAr ?? null,
            description: r.description ?? '',
            descriptionAr: r.descriptionAr ?? null,
            href: hrefFn(r),
            authorityName: r.authority_name ?? null,
            fileUrl: r.fileUrl ?? null,
            externalLink: r.link ?? null,
            slug: r.slug ?? null,
            alertType: r.type ?? null,
        }));
        const results = [
            ...shape(news, 'news', (r) => `/news/${r.id}`),
            ...shape(publications, 'publication', (r) => `/education/members-activities/publications`),
            ...shape(programs, 'program', (r) => `/education/members-activities/programs`),
            ...shape(portals, 'portal', (r) => `/education/members-activities/portals`),
            ...shape(glossary, 'glossary', (r) => `/glossary`),
            ...shape(principles, 'principle', (r) => `/education/reading-materials/principles/${r.id}`),
            ...shape(frameworks, 'framework', (r) => `/education/reading-materials/framework/${r.id}`),
            ...shape(products, 'investment-product', (r) => r.slug ? `/education/reading-materials/products/${r.slug}` : `/education/reading-materials/products/${r.id}`),
            ...shape(alerts, 'alert', (r) => `/education/alerts`),
        ];
        res.json({ query: q, total: results.length, results });
    }
    catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({ message: 'Search failed', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=search.js.map