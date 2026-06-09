"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
exports.getDatabase = getDatabase;
exports.executeQuery = executeQuery;
exports.executeSingleQuery = executeSingleQuery;
exports.executeInsert = executeInsert;
exports.executeUpdate = executeUpdate;
exports.executeDelete = executeDelete;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
let db = null;
async function initializeDatabase() {
    try {
        const dbPath = path_1.default.join(__dirname, '../../database.sqlite');
        db = await (0, sqlite_1.open)({
            filename: dbPath,
            driver: sqlite3_1.default.Database
        });
        console.log('✅ SQLite database connected successfully');
        await db.exec(`
      CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_name TEXT NOT NULL,
        general_info TEXT,
        education_materials TEXT,
        specific_materials TEXT,
        assisting_groups TEXT,
        evaluation TEXT,
        successful_programs TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT,
        link TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        country TEXT,
        website TEXT,
        logo TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS home_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reading_materials TEXT,
        members_activities TEXT,
        alerts_bulletins TEXT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Admin',
        permissions TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS alerts_bulletins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        content TEXT,
        authority_name TEXT,
        year TEXT,
        date_published DATETIME,
        priority TEXT DEFAULT 'Medium',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        rating INTEGER,
        category TEXT DEFAULT 'General',
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS glossary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        term TEXT NOT NULL,
        definition TEXT NOT NULL,
        category TEXT DEFAULT 'Basic Concepts',
        language TEXT DEFAULT 'English',
        arabic_term TEXT,
        arabic_definition TEXT,
        french_term TEXT,
        french_definition TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS about_sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        "order" INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        await db.exec(`
      CREATE TABLE IF NOT EXISTS portals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        short_title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        link TEXT NOT NULL,
        authority_name TEXT NOT NULL,
        country TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
        const programsCount = await db.get('SELECT COUNT(*) as count FROM programs');
        if (programsCount.count === 0) {
            await db.exec(`
        INSERT INTO programs (member_name, general_info, education_materials, specific_materials, assisting_groups, evaluation, successful_programs, is_active) VALUES 
        ('Jordan Securities Commission', '["Stated Goal of Investor Education Program", "Stated Institutional Support for Investor Education"]', '["Investing - Basic Materials", "Calculators / Tools"]', '["High School", "College"]', '["Single Young Adults", "Married Young Adults"]', '["How do you evaluate investor education initiatives?"]', '["Program"]', 1),
        ('Securities and Commodities Authority of UAE', '["What is New? (New programs, developments, policies etc.)"]', '["Investment and Understanding Risk and Rewards", "Materials Relating to Scams, Frauds, and/or Alerts to Investors"]', '["Youth (Grade School)", "Saving for College"]', '["Adults with Children", "Preparing for Retirement"]', '["How do you determine if the investor education program influences investors in their investment decisions?"]', '["Program", "Supporting Research"]', 1)
      `);
            console.log('✅ Sample programs data inserted');
        }
        const adminsCount = await db.get('SELECT COUNT(*) as count FROM admins');
        if (adminsCount.count === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.exec(`
        INSERT INTO admins (username, email, password, first_name, last_name, role, permissions) VALUES 
        ('admin', 'admin@uasa.ae', '${hashedPassword}', 'System', 'Administrator', 'Super Admin', '["all"]')
      `);
            console.log('✅ Default admin user created');
        }
        return db;
    }
    catch (error) {
        console.error('❌ SQLite database initialization failed:', error);
        throw error;
    }
}
function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
}
async function executeQuery(query, params = []) {
    const db = getDatabase();
    try {
        const rows = await db.all(query, params);
        return rows;
    }
    catch (error) {
        console.error('Query execution error:', error);
        throw error;
    }
}
async function executeSingleQuery(query, params = []) {
    const db = getDatabase();
    try {
        const row = await db.get(query, params);
        return row || null;
    }
    catch (error) {
        console.error('Single query execution error:', error);
        throw error;
    }
}
async function executeInsert(query, params = []) {
    const db = getDatabase();
    try {
        const result = await db.run(query, params);
        return result.lastID || 0;
    }
    catch (error) {
        console.error('Insert execution error:', error);
        throw error;
    }
}
async function executeUpdate(query, params = []) {
    const db = getDatabase();
    try {
        const result = await db.run(query, params);
        return result.changes || 0;
    }
    catch (error) {
        console.error('Update execution error:', error);
        throw error;
    }
}
async function executeDelete(query, params = []) {
    const db = getDatabase();
    try {
        const result = await db.run(query, params);
        return result.changes || 0;
    }
    catch (error) {
        console.error('Delete execution error:', error);
        throw error;
    }
}
//# sourceMappingURL=sqlite.js.map