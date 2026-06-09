"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("./models");
const seedData = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uasa-portal');
        console.log('Clearing existing data...');
        console.log('Seeding admin users...');
        const superAdminId = await models_1.AdminModel.create({
            username: 'superadmin',
            email: 'superadmin@uasa.ae',
            password: 'admin123',
            firstName: 'Super',
            lastName: 'Admin',
            role: 'Super Admin',
            permissions: ['all'],
            isActive: true
        });
        const adminId = await models_1.AdminModel.create({
            username: 'admin',
            email: 'admin@uasa.ae',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            role: 'Admin',
            permissions: ['read', 'write', 'edit'],
            isActive: true
        });
        console.log('Seeding news...');
        const newsData = [
            {
                title: "Second Edition of the Fintech Glossary",
                excerpt: "The Arab Regional Fintech Working Group issued the second edition of the Fintech Glossary...",
                link: "#",
                date: new Date('2024-03-15'),
                isActive: true
            },
            {
                title: "Glossary: French Edition",
                excerpt: "UASA released a French glossary after Arabic & English editions...",
                link: "#",
                date: new Date('2024-03-10'),
                isActive: true
            },
            {
                title: "IOSCO Competencies Framework",
                excerpt: "IOSCO published the Core Competencies Framework on Financial Literacy.",
                link: "#",
                date: new Date('2024-03-05'),
                isActive: true
            }
        ];
        for (const newsItem of newsData) {
            await models_1.News.create(newsItem);
        }
        console.log('Seeding members...');
        const membersData = [
            { name: "Conseil du Marché Financier - Tunisia", country: "Tunisia", isActive: true },
            { name: "COSOB - Algeria", country: "Algeria", isActive: true },
            { name: "Capital Market Authority - Saudi Arabia", country: "Saudi Arabia", isActive: true },
            { name: "Palestine Capital Market Authority - Palestine", country: "Palestine", isActive: true },
            { name: "Qatar Financial Markets Authority - Qatar", country: "Qatar", isActive: true },
            { name: "Capital Markets Authority - Kuwait", country: "Kuwait", isActive: true },
            { name: "Capital Markets Authority - Lebanon", country: "Lebanon", isActive: true },
            { name: "Financial Regulatory Authority - Egypt", country: "Egypt", isActive: true },
            { name: "Autorité Marocaine du Marché des Capitaux - Morocco", country: "Morocco", isActive: true }
        ];
        for (const memberItem of membersData) {
            await models_1.Member.create(memberItem);
        }
        console.log('Seeding home stats...');
        const homeStatsId = await models_1.HomeStats.create({
            readingMaterials: "1,200+",
            membersActivities: "350+",
            alertsBulletins: "120",
            lastUpdated: new Date()
        });
        console.log('Seeding about sections...');
        const aboutSections = [
            {
                title: "The Union Of Arab Securities Authorities",
                content: "Established in 2007, the Union of Arab Securities Authorities (UASA henceforth) is not a profit entity with an independent legal status. The United Arab Emirates is the headquarters of the Union. The Members of the Union are Arab Securities Authorities and markets Regulators.",
                order: 1,
                isActive: true
            },
            {
                title: "Our Mission & Goals",
                content: "The UASA aims to improve the legislative and regulatory framework of Arab securities markets with a view to achieving fairness, efficiency and transparency. It also seeks to unify efforts towards achieving effective levels of oversight over transactions in the Arab securities markets and to ensure coordination and cooperation among members to achieve maximum harmony and consistency with regard to relevant laws and regulations applicable in the Member States.",
                order: 2,
                isActive: true
            },
            {
                title: "Investor Education & Awareness",
                content: "Raising awareness and education of investors in Arab countries, especially those with limited resources, is one of the Union's priorities and a main pillar of its strategic plan 2016 – 2017, and has a particular importance as it enhances investment culture and market efficiency.",
                order: 3,
                isActive: true
            },
            {
                title: "Impact & Importance",
                content: "Investor education and awareness helps not only to protect investors, but it also contributes to the development of capital markets by enhancing investors' confidence as it complements the work on regulations, supervision and enforcement.",
                order: 4,
                isActive: true
            }
        ];
        for (const sectionItem of aboutSections) {
            await models_1.AboutSection.create(sectionItem);
        }
        console.log('Seeding contact info...');
        const contactInfo = [
            {
                type: "headquarters",
                address: "Al Rashedeya, Um el Rumoul Dubai, P.O.Box No. 117555, Dubai, U.A.E.",
                phone: "+971 4 290 0000",
                email: "info@uasa.ae",
                isActive: true
            },
            {
                type: "contact",
                phone: "+971 4 290 0000",
                email: "info@uasa.ae",
                isActive: true
            }
        ];
        for (const contactItem of contactInfo) {
            await models_1.ContactInfo.create(contactItem);
        }
        console.log('Seeding reading materials...');
        const readingMaterials = [
            {
                title: "IOSCO issues The Core Competencies Framework on Financial Literacy For Investors",
                description: "Comprehensive framework outlining essential financial literacy competencies for investors across global markets.",
                category: "Principles",
                author: "International Organization of Securities Commissions (IOSCO)",
                date: new Date('2024-03-15'),
                pdfUrl: "#",
                views: 1250,
                downloads: 450,
                isActive: true
            },
            {
                title: "IOSCO Framework",
                description: "Regulatory framework developed by the International Organization of Securities Commissions to establish standards and principles for securities regulation.",
                category: "Framework",
                author: "International Organization of Securities Commissions (IOSCO)",
                date: new Date('2024-02-28'),
                pdfUrl: "#",
                views: 980,
                downloads: 320,
                isActive: true
            },
            {
                title: "Introduction to Financial Markets",
                description: "A comprehensive guide to understanding financial markets, their structure, functions, and the various instruments traded within them.",
                category: "Investment Products/ Literature",
                author: "UASA Educational Committee",
                date: new Date('2024-01-20'),
                pdfUrl: "#",
                views: 1450,
                downloads: 520,
                isActive: true
            }
        ];
        for (const materialItem of readingMaterials) {
            await models_1.ReadingMaterial.create(materialItem);
        }
        console.log('Seeding member activities...');
        const memberActivities = [
            {
                title: "Annual Investor Awareness Campaign",
                description: "UASA members collaborate on regional investor education initiatives reaching over 100,000 participants.",
                type: "Campaign",
                organization: "UASA",
                date: new Date('2024-04-10'),
                status: "Active",
                participants: 100000,
                isActive: true
            },
            {
                title: "Financial Literacy Workshop Series",
                description: "Monthly workshops focusing on different aspects of investment education and risk management.",
                type: "Workshop",
                organization: "CMA Kuwait",
                date: new Date('2024-03-25'),
                status: "Ongoing",
                participants: 2500,
                isActive: true
            },
            {
                title: "Digital Investment Education Portal",
                description: "Interactive online platform offering courses, webinars, and educational resources.",
                type: "Digital Initiative",
                organization: "QFMA Qatar",
                date: new Date('2024-02-15'),
                status: "Live",
                participants: 15000,
                isActive: true
            }
        ];
        for (const activityItem of memberActivities) {
            await models_1.MemberActivity.create(activityItem);
        }
        console.log('Seeding alerts and bulletins...');
        const alertsBulletins = [
            {
                title: "Market Volatility Alert",
                description: "Important notice regarding recent market volatility and investor protection measures.",
                type: "Alert",
                priority: "High",
                date_published: new Date('2024-04-12'),
                authority_name: "UASA Risk Committee",
                content: "Important notice regarding recent market volatility and investor protection measures.",
                year: "2024",
                link: "#"
            },
            {
                title: "New Regulatory Guidelines",
                description: "Updated guidelines for cryptocurrency investments and digital assets.",
                type: "Bulletin",
                priority: "Medium",
                date_published: new Date('2024-04-05'),
                authority_name: "Financial Regulatory Authority Egypt",
                content: "Updated guidelines for cryptocurrency investments and digital assets.",
                year: "2024",
                link: "#"
            },
            {
                title: "Investor Protection Measures",
                description: "New measures implemented to enhance investor protection across member countries.",
                type: "Bulletin",
                priority: "High",
                date_published: new Date('2024-03-28'),
                authority_name: "Capital Market Authority Saudi Arabia",
                content: "New measures implemented to enhance investor protection across member countries.",
                year: "2024",
                link: "#"
            }
        ];
        for (const alertItem of alertsBulletins) {
            await models_1.AlertsBulletinsModel.create(alertItem);
        }
        console.log('Seeding glossary terms...');
        const glossaryTerms = [
            {
                term: "Asset",
                definition: "A resource with economic value that an individual, corporation, or country owns or controls with the expectation that it will provide future benefit.",
                category: "Basic Concepts",
                language: "English",
                arabicTerm: "أصل",
                arabicDefinition: "مورد ذو قيمة اقتصادية يمتلكه أو يتحكم فيه فرد أو شركة أو دولة مع توقع أنه سيوفر فائدة مستقبلية.",
                frenchTerm: "Actif",
                frenchDefinition: "Une ressource ayant une valeur économique qu'une personne, une entreprise ou un pays possède ou contrôle dans l'attente d'un bénéfice futur.",
                views: 0,
                downloads: 0,
                isActive: true
            },
            {
                term: "Portfolio",
                definition: "A collection of investments owned by an individual or institution.",
                category: "Investment Management",
                language: "English",
                arabicTerm: "محفظة استثمارية",
                arabicDefinition: "مجموعة الاستثمارات المملوكة لفرد أو مؤسسة.",
                frenchTerm: "Portefeuille",
                frenchDefinition: "Un ensemble d'investissements détenus par une personne ou une institution.",
                views: 0,
                downloads: 0,
                isActive: true
            },
            {
                term: "Risk",
                definition: "The possibility that an actual outcome or return will differ from the expected outcome or return.",
                category: "Risk Management",
                language: "English",
                arabicTerm: "مخاطرة",
                arabicDefinition: "إمكانية أن يختلف النتيجة الفعلية أو العائد عن النتيجة المتوقعة أو العائد.",
                frenchTerm: "Risque",
                frenchDefinition: "La possibilité qu'un résultat réel ou un rendement diffère du résultat attendu ou du rendement.",
                views: 0,
                downloads: 0,
                isActive: true
            }
        ];
        for (const termItem of glossaryTerms) {
            await models_1.GlossaryTerm.create(termItem);
        }
        console.log('Database seeded successfully!');
        console.log('Login credentials:');
        console.log('Super Admin: username: superadmin, password: admin123');
        console.log('Admin: username: admin, password: admin123');
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedData();
//# sourceMappingURL=seed.js.map