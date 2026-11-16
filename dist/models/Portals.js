var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var Portals_exports = {};
__export(Portals_exports, {
  PortalModel: () => PortalModel
});
module.exports = __toCommonJS(Portals_exports);
var import_database = require("../utils/database");
const PORTAL_UPDATE_FIELD_MAP = {
  title: "title",
  titleAr: "title_ar",
  short_title: "short_title",
  short_titleAr: "short_title_ar",
  description: "description",
  descriptionAr: "description_ar",
  image_url: "image_url",
  imageAr: "image_ar",
  link: "link",
  authority_name: "authority_name",
  authority_nameAr: "authority_name_ar",
  country: "country",
  countryAr: "country_ar",
  display_order: "display_order",
  is_active: "is_active"
};
class PortalModel {
  // Get all portals with optional filters
  static async getAll(filters = {}) {
    let query = `
            SELECT * FROM portals 
            WHERE 1=1
        `;
    const params = [];
    if (filters.authority) {
      query += ` AND authority_name = ?`;
      params.push(filters.authority);
    }
    if (filters.country) {
      query += ` AND country = ?`;
      params.push(filters.country);
    }
    if (filters.is_active !== void 0) {
      query += ` AND is_active = ?`;
      params.push(filters.is_active);
    }
    query += ` ORDER BY display_order ASC, created_at DESC`;
    return (0, import_database.executeQuery)(query, params);
  }
  // Get portal by ID
  static async getById(id) {
    const query = "SELECT * FROM portals WHERE id = ?";
    return (0, import_database.executeSingleQuery)(query, [id]);
  }
  // Create new portal
  static async create(data) {
    const {
      title,
      titleAr,
      short_title,
      short_titleAr,
      description,
      descriptionAr,
      image_url,
      imageAr,
      link,
      authority_name,
      authority_nameAr,
      country,
      countryAr,
      display_order = 0
    } = data;
    const query = `
            INSERT INTO portals 
            (title, title_ar, short_title, short_title_ar, description, description_ar,
             image_url, image_ar, link, authority_name, authority_name_ar, country, country_ar,
             display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
    const insertId = await (0, import_database.executeInsert)(query, [
      title,
      titleAr ?? null,
      short_title,
      short_titleAr ?? null,
      description,
      descriptionAr ?? null,
      image_url,
      imageAr ?? null,
      link,
      authority_name,
      authority_nameAr ?? null,
      country,
      countryAr ?? null,
      display_order
    ]);
    return this.getById(insertId);
  }
  // Update portal — uses a whitelist column map to prevent SQL injection
  static async update(id, data) {
    const fields = [];
    const values = [];
    for (const [key, dbColumn] of Object.entries(PORTAL_UPDATE_FIELD_MAP)) {
      const typedKey = key;
      if (typedKey in data && data[typedKey] !== void 0) {
        fields.push(`${dbColumn} = ?`);
        values.push(data[typedKey]);
      }
    }
    if (fields.length === 0) {
      return this.getById(id);
    }
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    const query = `UPDATE portals SET ${fields.join(", ")} WHERE id = ?`;
    const affectedRows = await (0, import_database.executeUpdate)(query, values);
    if (affectedRows > 0) {
      return this.getById(id);
    }
    return null;
  }
  // Delete portal
  static async delete(id) {
    const query = `DELETE FROM portals WHERE id = ?`;
    const affectedRows = await (0, import_database.executeUpdate)(query, [id]);
    return affectedRows > 0;
  }
  // Get unique authorities using SELECT DISTINCT (efficient — no JS dedup)
  static async getUniqueAuthorities() {
    const rows = await (0, import_database.executeQuery)(
      `SELECT DISTINCT authority_name FROM portals WHERE authority_name IS NOT NULL ORDER BY authority_name ASC`
    );
    return rows.map((r) => r.authority_name);
  }
  // Get unique countries using SELECT DISTINCT (efficient — no JS dedup)
  static async getUniqueCountries() {
    const rows = await (0, import_database.executeQuery)(
      `SELECT DISTINCT country FROM portals WHERE country IS NOT NULL ORDER BY country ASC`
    );
    return rows.map((r) => r.country);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PortalModel
});
