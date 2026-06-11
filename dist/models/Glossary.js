"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlossaryTerm = exports.GlossaryTermModel = void 0;
const database_1 = require("../utils/database");
class GlossaryTermModel {
    static async create(termData) {
        const { term, definition, category, language, arabicTerm, arabicDefinition, frenchTerm, frenchDefinition, views, downloads, isActive } = termData;
        const query = `
      INSERT INTO glossary_terms (term, definition, category, language, arabic_term, arabic_definition, french_term, french_definition, views, downloads, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        return await (0, database_1.executeInsert)(query, [term, definition, category, language, arabicTerm, arabicDefinition, frenchTerm, frenchDefinition, views, downloads, isActive]);
    }
    static async findAll() {
        const query = 'SELECT * FROM glossary_terms WHERE is_active = true ORDER BY display_order ASC, term ASC, id ASC';
        const results = await (0, database_1.executeQuery)(query);
        return results.map(result => ({
            id: result.id,
            term: result.term,
            definition: result.definition,
            category: result.category,
            language: result.language,
            arabicTerm: result.arabic_term,
            arabicDefinition: result.arabic_definition,
            frenchTerm: result.french_term,
            frenchDefinition: result.french_definition,
            views: result.views,
            downloads: result.downloads,
            isActive: result.is_active,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        }));
    }
    static async findById(id) {
        const query = 'SELECT * FROM glossary_terms WHERE id = ? AND is_active = true';
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
        if (result) {
            return {
                id: result.id,
                term: result.term,
                definition: result.definition,
                category: result.category,
                language: result.language,
                arabicTerm: result.arabic_term,
                arabicDefinition: result.arabic_definition,
                frenchTerm: result.french_term,
                frenchDefinition: result.french_definition,
                views: result.views,
                downloads: result.downloads,
                isActive: result.is_active,
                createdAt: result.created_at,
                updatedAt: result.updated_at
            };
        }
        return null;
    }
    static async findByCategory(category) {
        const query = 'SELECT * FROM glossary_terms WHERE category = ? AND is_active = true ORDER BY display_order ASC, term ASC, id ASC';
        const results = await (0, database_1.executeQuery)(query, [category]);
        return results.map(result => ({
            id: result.id,
            term: result.term,
            definition: result.definition,
            category: result.category,
            language: result.language,
            arabicTerm: result.arabic_term,
            arabicDefinition: result.arabic_definition,
            frenchTerm: result.french_term,
            frenchDefinition: result.french_definition,
            views: result.views,
            downloads: result.downloads,
            isActive: result.is_active,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        }));
    }
    static async findByLanguage(language) {
        const query = 'SELECT * FROM glossary_terms WHERE language = ? AND is_active = true ORDER BY display_order ASC, term ASC, id ASC';
        const results = await (0, database_1.executeQuery)(query, [language]);
        return results.map(result => ({
            id: result.id,
            term: result.term,
            definition: result.definition,
            category: result.category,
            language: result.language,
            arabicTerm: result.arabic_term,
            arabicDefinition: result.arabic_definition,
            frenchTerm: result.french_term,
            frenchDefinition: result.french_definition,
            views: result.views,
            downloads: result.downloads,
            isActive: result.is_active,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        }));
    }
    static async search(searchTerm) {
        const query = 'SELECT * FROM glossary_terms WHERE (term LIKE ? OR definition LIKE ?) AND is_active = true ORDER BY display_order ASC, term ASC, id ASC';
        const searchPattern = `%${searchTerm}%`;
        const results = await (0, database_1.executeQuery)(query, [searchPattern, searchPattern]);
        return results.map(result => ({
            id: result.id,
            term: result.term,
            definition: result.definition,
            category: result.category,
            language: result.language,
            arabicTerm: result.arabic_term,
            arabicDefinition: result.arabic_definition,
            frenchTerm: result.french_term,
            frenchDefinition: result.french_definition,
            views: result.views,
            downloads: result.downloads,
            isActive: result.is_active,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        }));
    }
    static async update(id, updateData) {
        const { term, definition, category, language, arabicTerm, arabicDefinition, frenchTerm, frenchDefinition, views, downloads, isActive } = updateData;
        const updateFields = [];
        const updateValues = [];
        if (term !== undefined) {
            updateFields.push('term = ?');
            updateValues.push(term);
        }
        if (definition !== undefined) {
            updateFields.push('definition = ?');
            updateValues.push(definition);
        }
        if (category !== undefined) {
            updateFields.push('category = ?');
            updateValues.push(category);
        }
        if (language !== undefined) {
            updateFields.push('language = ?');
            updateValues.push(language);
        }
        if (arabicTerm !== undefined) {
            updateFields.push('arabic_term = ?');
            updateValues.push(arabicTerm);
        }
        if (arabicDefinition !== undefined) {
            updateFields.push('arabic_definition = ?');
            updateValues.push(arabicDefinition);
        }
        if (frenchTerm !== undefined) {
            updateFields.push('french_term = ?');
            updateValues.push(frenchTerm);
        }
        if (frenchDefinition !== undefined) {
            updateFields.push('french_definition = ?');
            updateValues.push(frenchDefinition);
        }
        if (views !== undefined) {
            updateFields.push('views = ?');
            updateValues.push(views);
        }
        if (downloads !== undefined) {
            updateFields.push('downloads = ?');
            updateValues.push(downloads);
        }
        if (isActive !== undefined) {
            updateFields.push('is_active = ?');
            updateValues.push(isActive);
        }
        if (updateFields.length === 0)
            return false;
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE glossary_terms SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await (0, database_1.executeUpdate)(query, updateValues);
        return result > 0;
    }
    static async incrementViews(id) {
        const query = 'UPDATE glossary_terms SET views = views + 1 WHERE id = ? AND is_active = true';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
    static async incrementDownloads(id) {
        const query = 'UPDATE glossary_terms SET downloads = downloads + 1 WHERE id = ? AND is_active = true';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
    static async delete(id) {
        const query = 'UPDATE glossary_terms SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
}
exports.GlossaryTermModel = GlossaryTermModel;
exports.GlossaryTerm = GlossaryTermModel;
//# sourceMappingURL=Glossary.js.map