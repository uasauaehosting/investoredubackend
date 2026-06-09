import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { 
  News, 
  Member, 
  HomeStats, 
  AboutSection, 
  ContactInfo, 
  ReadingMaterial, 
  MemberActivity, 
  AlertsBulletinsModel, 
  GlossaryTerm, 
  AdminModel 
} from './models';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uasa-portal');

    console.log('Clearing existing data...');
    // Note: Since we're using SQL models, we need to handle clearing data differently
    // For now, we'll skip the clearing step and focus on seeding
    // await AdminModel.deleteMany({});
    // await News.deleteMany({});
    // await Member.deleteMany({});
    // await HomeStats.deleteMany({});
    // await AboutSection.deleteMany({});
    // await ContactInfo.deleteMany({});
    // await ReadingMaterial.deleteMany({});
    // await MemberActivity.deleteMany({});
    // await AlertsBulletin.deleteMany({});
    // await GlossaryTerm.deleteMany({});

    console.log('Seeding admin users...');
    const superAdminId = await AdminModel.create({
      username: 'superadmin',
      email: 'superadmin@uasa.ae',
      password: 'admin123',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'Super Admin',
      permissions: ['all'],
      isActive: true
    });

    const adminId = await AdminModel.create({
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
      await News.create(newsItem);
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
      await Member.create(memberItem);
    }

    console.log('Seeding home stats...');
    const homeStatsId = await HomeStats.create({
      readingMaterials: "1,200+",
      membersActivities: "350+",
      alertsBulletins: "120",
      lastUpdated: new Date()
    });

    console.log('Seeding about sections...');
    const aboutSections = [
      {
        title: "The Union Of Arab Securities Authorities: Investor Education & Awareness Portal",
        content: "Established in 2007, the Union of Arab Securities Authorities (UASA henceforth) is not a profit entity with an independent legal status. The United Arab Emirates is the headquarters of the Union. The Members of the Union are Arab Securities Authorities and markets Regulators.",
        order: 1,
        isActive: true
      },
      {
        title: "Mission & Regulatory Goals",
        content: "The UASA aims to improve the legislative and regulatory framework of Arab securities markets with a view to achieving fairness, efficiency and transparency. It also seeks to unify efforts towards achieving effective levels of oversight over transactions in the Arab securities markets and to ensure coordination and cooperation among members to achieve maximum harmony and consistency with regard to relevant laws and regulations applicable in the Member States. The Union also aims to overcome difficulties facing investment in the Arab securities markets, and to expand the investment base, diversify its tools and promote the culture of investing in these markets.",
        order: 2,
        isActive: true
      },
      {
        title: "Investor Education & Awareness",
        content: "Raising awareness and education of investors in Arab countries, especially those with limited resources, is one of the Union's priorities and a main pillar of its strategic plan 2016 – 2017, and has a particular importance as it enhances investment culture and market efficiency. By setting up this web portal that includes investors' awareness and education initiatives of the Union's members.",
        order: 3,
        isActive: true
      },
      {
        title: "Impact & Importance",
        content: "Investor education and awareness helps not only to protect investors, but it also contributes to the development of capital markets by enhancing investors' confidence as it complements the work on regulations, supervision and enforcement. Some regulators have used investor education as an important means to increase participation in the capital markets. Normally, regulators play a key role in investor education and in raising investor awareness. However, both public and private sectors could also play a supporting role in this regard.",
        order: 4,
        isActive: true
      }
    ];
    for (const sectionItem of aboutSections) {
      await AboutSection.create(sectionItem);
    }

    console.log('Seeding contact info...');
    const contactInfo = [
      {
        type: "headquarters" as const,
        address: "Al Rashedeya, Um el Rumoul Dubai, P.O.Box No. 117555, Dubai, U.A.E.",
        phone: "+971 4 290 0000",
        email: "info@uasa.ae",
        isActive: true
      },
      {
        type: "contact" as const,
        phone: "+971 4 290 0000",
        email: "info@uasa.ae",
        isActive: true
      }
    ];
    for (const contactItem of contactInfo) {
      await ContactInfo.create(contactItem);
    }

    console.log('Seeding reading materials...');
    const readingMaterials = [
      {
        title: "IOSCO issues The Core Competencies Framework on Financial Literacy For Investors",
        description: "Comprehensive framework outlining essential financial literacy competencies for investors across global markets.",
        category: "Principles" as const,
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
        category: "Framework" as const,
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
        category: "Investment Products/ Literature" as const,
        author: "UASA Educational Committee",
        date: new Date('2024-01-20'),
        pdfUrl: "#",
        views: 1450,
        downloads: 520,
        isActive: true
      }
    ];
    for (const materialItem of readingMaterials) {
      await ReadingMaterial.create(materialItem);
    }

    console.log('Seeding member activities...');
    const memberActivities = [
      {
        title: "Annual Investor Awareness Campaign",
        description: "UASA members collaborate on regional investor education initiatives reaching over 100,000 participants.",
        type: "Campaign" as const,
        organization: "UASA",
        date: new Date('2024-04-10'),
        status: "Active" as const,
        participants: 100000,
        isActive: true
      },
      {
        title: "Financial Literacy Workshop Series",
        description: "Monthly workshops focusing on different aspects of investment education and risk management.",
        type: "Workshop" as const,
        organization: "CMA Kuwait",
        date: new Date('2024-03-25'),
        status: "Ongoing" as const,
        participants: 2500,
        isActive: true
      },
      {
        title: "Digital Investment Education Portal",
        description: "Interactive online platform offering courses, webinars, and educational resources.",
        type: "Digital Initiative" as const,
        organization: "QFMA Qatar",
        date: new Date('2024-02-15'),
        status: "Live" as const,
        participants: 15000,
        isActive: true
      }
    ];
    for (const activityItem of memberActivities) {
      await MemberActivity.create(activityItem);
    }

    console.log('Seeding alerts and bulletins...');
    const alertsBulletins = [
      {
        title: "Market Volatility Alert",
        description: "Important notice regarding recent market volatility and investor protection measures.",
        type: "Alert" as const,
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
        type: "Bulletin" as const,
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
        type: "Bulletin" as const,
        priority: "High",
        date_published: new Date('2024-03-28'),
        authority_name: "Capital Market Authority Saudi Arabia",
        content: "New measures implemented to enhance investor protection across member countries.",
        year: "2024",
        link: "#"
      }
    ];
    for (const alertItem of alertsBulletins) {
      await AlertsBulletinsModel.create(alertItem);
    }

    console.log('Seeding glossary terms...');
    const glossaryTerms = [
      {
        term: "Asset",
        definition: "A resource with economic value that an individual, corporation, or country owns or controls with the expectation that it will provide future benefit.",
        category: "Basic Concepts" as const,
        language: "English" as const,
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
        category: "Investment Management" as const,
        language: "English" as const,
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
        category: "Risk Management" as const,
        language: "English" as const,
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
      await GlossaryTerm.create(termItem);
    }

    console.log('Database seeded successfully!');
    console.log('Login credentials:');
    console.log('Super Admin: username: superadmin, password: admin123');
    console.log('Admin: username: admin, password: admin123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
