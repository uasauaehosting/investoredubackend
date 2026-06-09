"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("../utils/database");
const models_1 = require("../models");
const Glossary_1 = require("../models/Glossary");
const Portals_1 = require("../models/Portals");
const InvestorEducation_1 = require("../models/InvestorEducation");
const FRONTEND = path_1.default.resolve(__dirname, '../../../investoredufrontend/src');
async function runMigrations() {
    const statements = [
        `CREATE TABLE IF NOT EXISTS education_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      section VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      content TEXT DEFAULT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_education_section (section)
    )`,
        `CREATE TABLE IF NOT EXISTS site_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content_key VARCHAR(100) NOT NULL UNIQUE,
      content JSON NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
        `CREATE TABLE IF NOT EXISTS benchmarking_records (
      id INT AUTO_INCREMENT PRIMARY KEY,
      authority_name VARCHAR(255) NOT NULL,
      year VARCHAR(10) NOT NULL,
      indicator VARCHAR(255) DEFAULT NULL,
      value VARCHAR(255) DEFAULT NULL,
      data JSON DEFAULT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
        `CREATE TABLE IF NOT EXISTS footer_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(100) NOT NULL,
      value VARCHAR(50) NOT NULL,
      display_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    ];
    for (const sql of statements) {
        await (0, database_1.executeQuery)(sql);
    }
    try {
        await (0, database_1.executeQuery)('ALTER TABLE investment_products ADD COLUMN slug VARCHAR(255) DEFAULT NULL');
    }
    catch {
    }
    await (0, database_1.executeQuery)(`CREATE TABLE IF NOT EXISTS glossary_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(255) NOT NULL,
    definition TEXT NOT NULL,
    category ENUM('Basic Concepts', 'Investment Management', 'Risk Management', 'Corporate Finance', 'Market Operations', 'Regulatory Terms') DEFAULT 'Basic Concepts',
    language ENUM('English', 'Arabic', 'French') DEFAULT 'English',
    arabic_term VARCHAR(255),
    arabic_definition TEXT,
    french_term VARCHAR(255),
    french_definition TEXT,
    views INT DEFAULT 0,
    downloads INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
}
async function seedSiteContent() {
    const blocks = {
        'home.welcome': {
            badge: 'Welcome',
            title: 'Welcome to the UASA Investor Education Portal',
            paragraphs: [
                'The Union of Arab Securities Authorities (UASA) Investor Education Portal is your gateway to financial knowledge and empowerment. Our mission is to build a financially literate society across the Arab world by providing accessible, accurate, and comprehensive investment education resources.',
                'Whether you are a first-time investor or an experienced market participant, our portal offers tools, guides, and resources to help you make informed financial decisions and navigate Arab capital markets with confidence.',
            ],
            ctaText: 'Explore the Portal',
            ctaHref: '#',
            highlights: [
                { icon: 'TrendingUp', title: 'Smart Investing', description: 'Learn evidence-based strategies to grow your wealth and achieve your financial goals.' },
                { icon: 'Shield', title: 'Investor Protection', description: 'Understand your rights and how to protect yourself from fraud and financial misconduct.' },
                { icon: 'Globe', title: 'Arab Capital Markets', description: 'Explore opportunities across Arab financial markets with informed confidence.' },
            ],
        },
        'home.portal_section': {
            heroImage: '/images/portal-hero.png',
            cards: [
                { title: 'Investor Education', href: '/education/reading-materials/principles', image_url: 'https://images.pexels.com/photos/7948059/pexels-photo-7948059.jpeg?auto=compress&cs=tinysrgb&w=800' },
                { title: 'Financial Inclusion', href: '/inclusion/projects', image_url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800' },
                { title: 'Glossary', href: '/glossary', image_url: 'https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=800' },
            ],
        },
        'about.hero': {
            badge: 'About UASA',
            title: 'The Union Of Arab Securities Authorities: Investor Education & Awareness Portal',
        },
        principles: {
            introParagraphs: [
                'Investor education plays a vital role in helping individuals make informed financial decisions, understand investment opportunities, and manage financial risks effectively. Through comprehensive educational resources, investors can develop the knowledge and skills needed to participate confidently in financial markets.',
                'This section provides access to key principles, frameworks, and guidance documents that support investor awareness and financial literacy initiatives. The objective is to empower investors with the information necessary to evaluate investment products, understand market dynamics, and protect themselves from potential financial risks.',
            ],
            objectives: [
                'Promote financial literacy among investors.',
                'Improve understanding of investment products and services.',
                'Encourage informed decision-making.',
                'Enhance investor protection and awareness.',
                'Support responsible participation in financial markets.',
            ],
            benefits: [
                'Better understanding of financial products.',
                'Improved risk assessment capabilities.',
                'Enhanced confidence in investment decisions.',
                'Increased awareness of investor rights and responsibilities.',
                'Greater ability to identify fraudulent schemes and financial scams.',
            ],
        },
        framework: {
            introParagraphs: [
                'The need for investor education and financial literacy has never been greater. As the financial marketplace continues to evolve and innovate, investment products are becoming increasingly complex and financial services increasingly diverse. Greater understanding of key financial concepts is required on the part of retail investors to understand and evaluate the choices available to them and avoid fraud. Underscoring the importance of investor education and financial literacy is the critical – and increasing – need for retirement planning as responsibility for saving and investing in many jurisdictions shifts from the employer to the individual.',
                "The International Organization of Securities Commissions (IOSCO) is responding to these challenges. The IOSCO Board approved the establishment of the Committee on Retail Investors (C8). The committee's primary mandate is to conduct IOSCO's policy work on retail investor education and financial literacy. Its secondary mandate is to advise the IOSCO Board on emerging retail investor protection matters and conduct investor protection policy work as directed by the IOSCO Board.",
            ],
            practices: [
                'Focus investor education and financial literacy programs on improving retail investor knowledge of basic core competencies for investing, and on raising awareness, and promoting understanding of the types of investment products and services that are available.',
                'Develop investor education and financial literacy programs that meet investor needs and support regulatory initiatives.',
                'Develop investor education and financial literacy programs to meet the needs of specific audiences.',
                'Consider insights gathered from research when developing investor education and financial literacy programs.',
                'Develop investor education and financial literacy programs with clear and measurable outcomes, and where possible, evaluate them on an ongoing basis.',
                'Collaborate or partner with other relevant organisations in developing and delivering investor education and financial literacy programs.',
                'When developing investor education and financial literacy programs, consider national strategies and/or collaboration with other organisations to complement or reinforce financial education and financial consumer protection programs generally.',
                'Promote international cooperation, sharing of information and coordination on investor education and financial literacy, including forums for exchange of information and experiences within IOSCO and with other agencies and organisations.',
            ],
            imageUrl: 'http://uasa.ae/en/galorg/23562017015639iosco.jpg',
            pdfUrl: 'http://www.iosco.org/library/pubdocs/pdf/IOSCOPD462.pdf',
        },
        the_index: {
            content: "A guideline on financial inclusion index to be developed based on AFI's financial inclusion index (the Financial Inclusion Data Working Group (FIDWG)) for the UASA members to track the progress of financial inclusion in their nations.",
        },
        feedback: {
            title: 'Feedback & Inquiries',
            subtitle: 'Your voice matters. Help us improve the portal or reach out with your questions.',
            contactEmail: 'info@uasa.ae',
            contactWebsite: 'https://investoreducation.uasa.ae',
        },
        footer: {
            educationLinks: ['Investment Basics', 'Types of Investments', 'Investment Risks', 'Market Indices', 'Protecting Against Fraud', 'Savings and Investment'],
            inclusionLinks: ['Financial Literacy', 'Digital Finance', 'Microfinance', 'Women Empowerment', 'Youth Financial Education'],
            usefulLinks: [
                { label: 'UASA Official Website', href: '#' },
                { label: 'IOSCO', href: '#' },
                { label: 'World Federation of Exchanges', href: '#' },
                { label: 'Arab Monetary Fund', href: '#' },
                { label: 'Securities Commission Resources', href: '#' },
            ],
            address: 'Al Rashedeya, Um el Rumoul Dubai, P.O.Box No. 117555, Dubai, U.A.E.',
            phone: '+971 4 290 0000',
            email: 'info@uasa.ae',
        },
        glossary_meta: {
            pdfUrl: 'http://uasa.ae/en/galimg/06152019021545UASA Glossary_Final_03_10_2019.pdf',
        },
    };
    for (const [key, content] of Object.entries(blocks)) {
        await models_1.SiteContent.upsert(key, content);
        console.log(`  ✓ site_content: ${key}`);
    }
}
async function seedAboutSections() {
    const existing = await models_1.AboutSection.findAll();
    if (existing.length >= 4) {
        console.log('  ⊘ about_sections already seeded');
        return;
    }
    const sections = [
        { title: 'About UASA', content: 'Established in 2007, the Union of Arab Securities Authorities (UASA henceforth) is not a profit entity with an independent legal status. The United Arab Emirates is the headquarters of the Union. The Members of the Union are Arab Securities Authorities and markets Regulators.', order: 1, isActive: true },
        { title: 'Mission', content: 'The UASA aims to improve the legislative and regulatory framework of Arab securities markets with a view to achieving fairness, efficiency and transparency. It also seeks to unify efforts towards achieving effective levels of oversight over transactions in the Arab securities markets and to ensure coordination and cooperation among members to achieve maximum harmony and consistency with regard to relevant laws and regulations applicable in the Member States. The Union also aims to overcome difficulties facing investment in the Arab securities markets, and to expand the investment base, diversify its tools and promote the culture of investing in these markets.', order: 2, isActive: true },
        { title: 'Investor Education', content: "Raising awareness and education of investors in Arab countries, especially those with limited resources, is one of the Union's priorities and a main pillar of its strategic plan 2016 – 2017, and has a particular importance as it enhances investment culture and market efficiency. By setting up this web portal that includes investors' awareness and education initiatives of the Union's members.", order: 3, isActive: true },
        { title: 'Impact', content: "Investor education and awareness helps not only to protect investors, but it also contributes to the development of capital markets by enhancing investors' confidence as it complements the work on regulations, supervision and enforcement. Some regulators have used investor education as an important means to increase participation in the capital markets. Normally, regulators play a key role in investor education and in raising investor awareness. However, both public and private sectors could also play a supporting role in this regard.", order: 4, isActive: true },
    ];
    for (const s of sections) {
        await models_1.AboutSection.create(s);
    }
    console.log(`  ✓ about_sections: ${sections.length} rows`);
}
async function seedFooterStats() {
    const existing = await models_1.FooterStats.findAll();
    if (existing.length >= 4) {
        console.log('  ⊘ footer_stats already seeded');
        return;
    }
    await models_1.FooterStats.upsertAll([
        { label: 'Member States', value: '10+', displayOrder: 1, isActive: true },
        { label: 'Educational Resources', value: '1000+', displayOrder: 2, isActive: true },
        { label: 'Publications', value: '50+', displayOrder: 3, isActive: true },
        { label: 'Years of Service', value: '20+', displayOrder: 4, isActive: true },
    ]);
    console.log('  ✓ footer_stats');
}
async function seedGlossary() {
    const glossaryPath = path_1.default.join(FRONTEND, 'data/glossaryTerms.json');
    if (!fs_1.default.existsSync(glossaryPath)) {
        console.log('  ⊘ glossary JSON not found');
        return;
    }
    const existing = await Glossary_1.GlossaryTerm.findAll();
    if (existing.length > 100) {
        console.log(`  ⊘ glossary already has ${existing.length} terms`);
        return;
    }
    const data = JSON.parse(fs_1.default.readFileSync(glossaryPath, 'utf-8'));
    const terms = data.terms;
    let count = 0;
    for (const term of terms) {
        await Glossary_1.GlossaryTerm.create({
            term: term.english,
            definition: term.definition,
            category: 'Basic Concepts',
            language: 'English',
            arabicTerm: term.arabic,
            arabicDefinition: term.definition,
            frenchTerm: term.french,
            frenchDefinition: term.definition,
            views: 0,
            downloads: 0,
            isActive: true,
        });
        count++;
        if (count % 200 === 0)
            console.log(`    ... ${count} glossary terms`);
    }
    console.log(`  ✓ glossary: ${count} terms`);
}
async function seedMemberPortals() {
    const existing = await Portals_1.PortalModel.getAll({ is_active: true });
    if (existing.length >= 5) {
        console.log(`  ⊘ portals already has ${existing.length} entries`);
        return;
    }
    const portalsPath = path_1.default.join(FRONTEND, 'data/memberPortals.ts');
    const raw = fs_1.default.readFileSync(portalsPath, 'utf-8');
    const portalMatches = [...raw.matchAll(/panelTitle:\s*'([^']+)'[\s\S]*?displayTitle:\s*'([^']+)'[\s\S]*?imageUrl:\s*'([^']+)'[\s\S]*?link:\s*'([^']+)'/g)];
    let order = 1;
    for (const match of portalMatches) {
        const [, panelTitle, displayTitle, imageUrl, link] = match;
        await Portals_1.PortalModel.create({
            title: panelTitle,
            short_title: displayTitle,
            description: displayTitle,
            image_url: imageUrl,
            link,
            authority_name: panelTitle,
            country: 'Arab Region',
            display_order: order++,
        });
    }
    console.log(`  ✓ member portals: ${portalMatches.length} entries`);
}
async function seedInvestmentProducts() {
    const existing = await InvestorEducation_1.InvestmentProductModel.findAll();
    if (existing.length >= 3) {
        console.log(`  ⊘ investment_products already has ${existing.length} entries`);
        return;
    }
    const productsModule = require(path_1.default.join(FRONTEND, 'lib/investmentProducts'));
    const INVESTMENT_PRODUCTS = productsModule.INVESTMENT_PRODUCTS ?? [];
    for (const product of INVESTMENT_PRODUCTS) {
        await (0, database_1.executeInsert)(`INSERT INTO investment_products (title, description, author, date, file_url, image_url, content, slug, views, downloads, is_active)
       VALUES (?, ?, '', CURDATE(), '', ?, ?, ?, 0, 0, true)`, [product.title, product.excerpt, product.imageUrl, JSON.stringify({ blocks: product.blocks }), product.slug]);
    }
    console.log(`  ✓ investment_products: ${INVESTMENT_PRODUCTS.length} entries`);
}
async function main() {
    await (0, database_1.initConnection)();
    console.log('Running CMS migrations...');
    await runMigrations();
    console.log('Seeding site content blocks...');
    await seedSiteContent();
    console.log('Seeding about sections...');
    await seedAboutSections();
    console.log('Seeding footer stats...');
    await seedFooterStats();
    console.log('Seeding glossary...');
    await seedGlossary();
    console.log('Seeding member portals...');
    await seedMemberPortals();
    console.log('Seeding investment products...');
    await seedInvestmentProducts();
    console.log('\n✅ All content seeded successfully!');
    process.exit(0);
}
main().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed-all-content.js.map