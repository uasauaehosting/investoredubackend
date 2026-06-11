"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slide = exports.HomeStats = exports.Member = exports.News = exports.SlideModel = exports.HomeStatsModel = exports.MemberModel = exports.NewsModel = void 0;
const database_1 = require("../utils/database");
function mapNewsRow(result) {
    return {
        id: result.id,
        title: result.title,
        titleAr: result.title_ar,
        excerpt: result.summary || result.content || '',
        excerptAr: result.summary_ar || result.content_ar || '',
        fullDetail: result.full_detail,
        fullDetailAr: result.full_detail_ar,
        category: result.category,
        link: result.link || '',
        image: result.image,
        pdfFile: result.pdf_file,
        date: result.date,
        displayOrder: result.display_order ?? 0,
        isActive: result.is_active,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
    };
}
class NewsModel {
    static async getNextDisplayOrder() {
        const result = await (0, database_1.executeSingleQuery)('SELECT COALESCE(MAX(display_order), 0) + 1 AS next_order FROM news');
        return Number(result?.next_order ?? 1);
    }
    static async create(newsData) {
        const { title, titleAr, excerpt, excerptAr, fullDetail, fullDetailAr, category, link, image, pdfFile, date, displayOrder, isActive = true } = newsData;
        const newsDate = date || new Date();
        const order = displayOrder ?? await NewsModel.getNextDisplayOrder();
        const query = `
      INSERT INTO news (title, title_ar, summary, summary_ar, content, content_ar, full_detail, full_detail_ar, category, link, image, pdf_file, date, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        return await (0, database_1.executeInsert)(query, [title, titleAr, excerpt, excerptAr, excerpt, excerptAr, fullDetail, fullDetailAr, category || 'News', link, image, pdfFile, newsDate, order, isActive]);
    }
    static async findAll() {
        const query = 'SELECT * FROM news WHERE is_active = true ORDER BY display_order ASC, date DESC, id DESC';
        const results = await (0, database_1.executeQuery)(query);
        return results.map(mapNewsRow);
    }
    static async findById(id) {
        const query = 'SELECT * FROM news WHERE id = ? AND is_active = true';
        console.log('NewsModel.findById - Query:', query, 'ID:', id);
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
        console.log('NewsModel.findById - Raw result:', result);
        if (result) {
            const newsItem = mapNewsRow(result);
            console.log('NewsModel.findById - Processed result:', newsItem);
            return newsItem;
        }
        return null;
    }
    static async update(id, updateData) {
        console.log('NewsModel.update - Input data:', updateData);
        const { title, titleAr, excerpt, excerptAr, fullDetail, fullDetailAr, category, link, image, pdfFile, date, displayOrder, isActive } = updateData;
        const updateFields = [];
        const updateValues = [];
        if (title !== undefined) {
            updateFields.push('title = ?');
            updateValues.push(title);
        }
        if (titleAr !== undefined) {
            updateFields.push('title_ar = ?');
            updateValues.push(titleAr);
        }
        if (excerpt !== undefined) {
            updateFields.push('summary = ?');
            updateValues.push(excerpt);
        }
        if (excerptAr !== undefined) {
            updateFields.push('summary_ar = ?');
            updateValues.push(excerptAr);
        }
        if (fullDetail !== undefined) {
            updateFields.push('full_detail = ?');
            updateValues.push(fullDetail);
        }
        if (fullDetailAr !== undefined) {
            updateFields.push('full_detail_ar = ?');
            updateValues.push(fullDetailAr);
        }
        if (category !== undefined) {
            updateFields.push('category = ?');
            updateValues.push(category);
        }
        if (link !== undefined) {
            updateFields.push('link = ?');
            updateValues.push(link);
        }
        if (image !== undefined) {
            updateFields.push('image = ?');
            updateValues.push(image);
        }
        if (pdfFile !== undefined) {
            updateFields.push('pdf_file = ?');
            updateValues.push(pdfFile);
        }
        if (date !== undefined) {
            updateFields.push('date = ?');
            updateValues.push(date);
        }
        if (displayOrder !== undefined) {
            updateFields.push('display_order = ?');
            updateValues.push(displayOrder);
        }
        if (isActive !== undefined) {
            updateFields.push('is_active = ?');
            updateValues.push(isActive);
        }
        if (updateFields.length === 0)
            return false;
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE news SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await (0, database_1.executeUpdate)(query, updateValues);
        return result > 0;
    }
    static async delete(id) {
        const query = 'UPDATE news SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
    static async reorder(ids) {
        for (let i = 0; i < ids.length; i++) {
            await (0, database_1.executeUpdate)('UPDATE news SET display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [i + 1, ids[i]]);
        }
    }
}
exports.NewsModel = NewsModel;
exports.News = NewsModel;
class MemberModel {
    static async create(memberData) {
        const { name, nameAr, country, countryAr, website, logo, isActive } = memberData;
        const query = `
      INSERT INTO members (name, name_ar, country, country_ar, website, logo, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        return await (0, database_1.executeInsert)(query, [name, nameAr, country, countryAr, website, logo, isActive]);
    }
    static async findAll() {
        const query = 'SELECT * FROM members WHERE is_active = true ORDER BY display_order ASC, created_at DESC, id DESC';
        const results = await (0, database_1.executeQuery)(query);
        return results.map(result => ({
            id: result.id,
            name: result.name,
            nameAr: result.name_ar,
            country: result.country,
            countryAr: result.country_ar,
            website: result.website,
            logo: result.logo,
            isActive: result.is_active,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        }));
    }
    static async findById(id) {
        const query = 'SELECT * FROM members WHERE id = ? AND is_active = true';
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
        if (result) {
            return {
                id: result.id,
                name: result.name,
                nameAr: result.name_ar,
                country: result.country,
                countryAr: result.country_ar,
                website: result.website,
                logo: result.logo,
                isActive: result.is_active,
                createdAt: result.created_at,
                updatedAt: result.updated_at
            };
        }
        return null;
    }
    static async update(id, updateData) {
        const { name, nameAr, country, countryAr, website, logo, isActive } = updateData;
        const updateFields = [];
        const updateValues = [];
        if (name !== undefined) {
            updateFields.push('name = ?');
            updateValues.push(name);
        }
        if (nameAr !== undefined) {
            updateFields.push('name_ar = ?');
            updateValues.push(nameAr);
        }
        if (country !== undefined) {
            updateFields.push('country = ?');
            updateValues.push(country);
        }
        if (countryAr !== undefined) {
            updateFields.push('country_ar = ?');
            updateValues.push(countryAr);
        }
        if (website !== undefined) {
            updateFields.push('website = ?');
            updateValues.push(website);
        }
        if (logo !== undefined) {
            updateFields.push('logo = ?');
            updateValues.push(logo);
        }
        if (isActive !== undefined) {
            updateFields.push('is_active = ?');
            updateValues.push(isActive);
        }
        if (updateFields.length === 0)
            return false;
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE members SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await (0, database_1.executeUpdate)(query, updateValues);
        return result > 0;
    }
    static async delete(id) {
        const query = 'UPDATE members SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
}
exports.MemberModel = MemberModel;
exports.Member = MemberModel;
class HomeStatsModel {
    static async create(statsData) {
        const { readingMaterials, membersActivities, alertsBulletins, lastUpdated } = statsData;
        const query = `
      INSERT INTO home_stats (reading_materials, members_activities, alerts_bulletins, last_updated)
      VALUES (?, ?, ?, ?)
    `;
        return await (0, database_1.executeInsert)(query, [readingMaterials, membersActivities, alertsBulletins, lastUpdated]);
    }
    static async findLatest() {
        const query = 'SELECT * FROM home_stats ORDER BY last_updated DESC LIMIT 1';
        const result = await (0, database_1.executeSingleQuery)(query);
        if (result) {
            return {
                id: result.id,
                readingMaterials: result.reading_materials,
                membersActivities: result.members_activities,
                alertsBulletins: result.alerts_bulletins,
                lastUpdated: result.last_updated,
                createdAt: result.created_at,
                updatedAt: result.updated_at
            };
        }
        return null;
    }
    static async update(id, updateData) {
        const { readingMaterials, membersActivities, alertsBulletins, lastUpdated } = updateData;
        const updateFields = [];
        const updateValues = [];
        if (readingMaterials !== undefined) {
            updateFields.push('reading_materials = ?');
            updateValues.push(readingMaterials);
        }
        if (membersActivities !== undefined) {
            updateFields.push('members_activities = ?');
            updateValues.push(membersActivities);
        }
        if (alertsBulletins !== undefined) {
            updateFields.push('alerts_bulletins = ?');
            updateValues.push(alertsBulletins);
        }
        if (lastUpdated !== undefined) {
            updateFields.push('last_updated = ?');
            updateValues.push(lastUpdated);
        }
        if (updateFields.length === 0)
            return false;
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE home_stats SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await (0, database_1.executeUpdate)(query, updateValues);
        return result > 0;
    }
}
exports.HomeStatsModel = HomeStatsModel;
exports.HomeStats = HomeStatsModel;
class SlideModel {
    static async create(slideData) {
        const { title, titleAr, subtitle, subtitleAr, image_url, cta_text, cta_textAr, cta_href, display_order, is_active = true } = slideData;
        const query = `
      INSERT INTO slides (title, title_ar, subtitle, subtitle_ar, image_url, cta_text, cta_text_ar, cta_href, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        return await (0, database_1.executeInsert)(query, [title, titleAr ?? null, subtitle, subtitleAr ?? null, image_url, cta_text, cta_textAr ?? null, cta_href, display_order, is_active]);
    }
    static async findAll() {
        const query = 'SELECT * FROM slides WHERE is_active = true ORDER BY display_order ASC';
        const results = await (0, database_1.executeQuery)(query);
        return results.map(result => ({
            id: result.id,
            title: result.title,
            titleAr: result.title_ar,
            subtitle: result.subtitle,
            subtitleAr: result.subtitle_ar,
            image_url: result.image_url,
            cta_text: result.cta_text,
            cta_textAr: result.cta_text_ar,
            cta_href: result.cta_href,
            display_order: result.display_order,
            is_active: result.is_active,
            createdAt: result.created_at,
            updatedAt: result.updated_at
        }));
    }
    static async findById(id) {
        const query = 'SELECT * FROM slides WHERE id = ?';
        const result = await (0, database_1.executeSingleQuery)(query, [id]);
        if (result) {
            return {
                id: result.id,
                title: result.title,
                titleAr: result.title_ar,
                subtitle: result.subtitle,
                subtitleAr: result.subtitle_ar,
                image_url: result.image_url,
                cta_text: result.cta_text,
                cta_textAr: result.cta_text_ar,
                cta_href: result.cta_href,
                display_order: result.display_order,
                is_active: result.is_active,
                createdAt: result.created_at,
                updatedAt: result.updated_at
            };
        }
        return null;
    }
    static async update(id, updateData) {
        const { title, titleAr, subtitle, subtitleAr, image_url, cta_text, cta_textAr, cta_href, display_order, is_active } = updateData;
        const updateFields = [];
        const updateValues = [];
        if (title !== undefined) {
            updateFields.push('title = ?');
            updateValues.push(title);
        }
        if (titleAr !== undefined) {
            updateFields.push('title_ar = ?');
            updateValues.push(titleAr);
        }
        if (subtitle !== undefined) {
            updateFields.push('subtitle = ?');
            updateValues.push(subtitle);
        }
        if (subtitleAr !== undefined) {
            updateFields.push('subtitle_ar = ?');
            updateValues.push(subtitleAr);
        }
        if (image_url !== undefined) {
            updateFields.push('image_url = ?');
            updateValues.push(image_url);
        }
        if (cta_text !== undefined) {
            updateFields.push('cta_text = ?');
            updateValues.push(cta_text);
        }
        if (cta_textAr !== undefined) {
            updateFields.push('cta_text_ar = ?');
            updateValues.push(cta_textAr);
        }
        if (cta_href !== undefined) {
            updateFields.push('cta_href = ?');
            updateValues.push(cta_href);
        }
        if (display_order !== undefined) {
            updateFields.push('display_order = ?');
            updateValues.push(display_order);
        }
        if (is_active !== undefined) {
            updateFields.push('is_active = ?');
            updateValues.push(is_active);
        }
        if (updateFields.length === 0)
            return false;
        updateFields.push('updated_at = CURRENT_TIMESTAMP');
        updateValues.push(id);
        const query = `UPDATE slides SET ${updateFields.join(', ')} WHERE id = ?`;
        const result = await (0, database_1.executeUpdate)(query, updateValues);
        return result > 0;
    }
    static async delete(id) {
        const query = 'DELETE FROM slides WHERE id = ?';
        const result = await (0, database_1.executeUpdate)(query, [id]);
        return result > 0;
    }
}
exports.SlideModel = SlideModel;
exports.Slide = SlideModel;
//# sourceMappingURL=Home.js.map