// Insert portal data into database
const axios = require('axios');

const baseURL = 'http://localhost:5001/api';

const portalsData = [
    {
        title: "Conseil du Marché Financier - Tunisia",
        short_title: "CMF - Tunisia",
        description: "Financial market regulatory authority for Tunisia",
        image_url: "http://uasa.ae/en/galorg/30312018123118Tunisia2.png",
        link: "https://www.myinvestia.com/",
        authority_name: "Conseil du Marché Financier - Tunisia",
        country: "Tunisia",
        display_order: 1
    },
    {
        title: "Commission d'Organisation et de Surveillance des opérations de Bourse",
        short_title: "COSOB - Algeria",
        description: "Securities exchange commission for Algeria",
        image_url: "http://uasa.ae/en/galorg/30532018125329Algeria.png",
        link: "http://www.cosob.org/guides/",
        authority_name: "Commission d'Organisation et de Surveillance des opérations de Bourse",
        country: "Algeria",
        display_order: 2
    },
    {
        title: "Saudi Capital Market Authority",
        short_title: "CMA - Saudi Arabia",
        description: "Capital market authority for Saudi Arabia",
        image_url: "http://uasa.ae/en/galorg/30542018125450KSA2.png",
        link: "https://www.si.org.sa/?lang=en",
        authority_name: "Saudi Capital Market Authority",
        country: "Saudi Arabia",
        display_order: 3
    },
    {
        title: "Syrian Commission on financial markets and securities",
        short_title: "SCFMS - Syria",
        description: "Financial markets and securities commission for Syria",
        image_url: "http://uasa.ae/en/galorg/30552018125546Syria.png",
        link: "http://scfms.sy/awarenessLetters/ar/37/0/?????-???????",
        authority_name: "Syrian Commission on financial markets and securities",
        country: "Syria",
        display_order: 4
    },
    {
        title: "Palestine Capital Market Authority",
        short_title: "PCMA - Palestine",
        description: "Capital market authority for Palestine",
        image_url: "http://uasa.ae/en/galorg/30572018125706Palestine.png",
        link: "http://www.pcma.ps/portal/awareness/SitePages/Home.aspx",
        authority_name: "Palestine Capital Market Authority",
        country: "Palestine",
        display_order: 5
    },
    {
        title: "Qatar Financial Markets Authority",
        short_title: "QFMA - Qatar",
        description: "Financial markets authority for Qatar",
        image_url: "http://uasa.ae/en/galorg/30592018125923Qatar.png",
        link: "https://www.qfma.org.qa/English/mediacenter/pages/investorawareness.aspx",
        authority_name: "Qatar Financial Markets Authority",
        country: "Qatar",
        display_order: 6
    },
    {
        title: "Kuwait Capital Markets Authority",
        short_title: "CMA - Kuwait",
        description: "Capital markets authority for Kuwait",
        image_url: "http://uasa.ae/en/galorg/30042018010402Kuwait.png",
        link: "https://www.cma.gov.kw/ar/web/cma/awareness",
        authority_name: "Kuwait Capital Markets Authority",
        country: "Kuwait",
        display_order: 7
    },
    {
        title: "Capital Markets Authority of Lebanon",
        short_title: "CMA - Lebanon",
        description: "Capital markets authority for Lebanon",
        image_url: "http://uasa.ae/en/galorg/30272018012743Lebanon.png",
        link: "https://www.cma.gov.lb/investor-education/",
        authority_name: "Capital Markets Authority of Lebanon",
        country: "Lebanon",
        display_order: 8
    },
    {
        title: "Financial Regulatory Authority - Egypt",
        short_title: "FRA - Egypt",
        description: "Financial regulatory authority for Egypt",
        image_url: "http://uasa.ae/en/galorg/30432018014338Egypt.png",
        link: "http://www.iinvest.org.eg/general/index.jsp",
        authority_name: "Financial Regulatory Authority - Egypt",
        country: "Egypt",
        display_order: 9
    },
    {
        title: "Autorité Marocaine du Marché des Capitaux (AMMC)",
        short_title: "AMMC - Morocco",
        description: "Capital markets authority for Morocco",
        image_url: "http://uasa.ae/en/galorg/30442018014432Morocco.png",
        link: "http://www.ammc.ma/en/espace-epargnants",
        authority_name: "Autorité Marocaine du Marché des Capitaux (AMMC)",
        country: "Morocco",
        display_order: 10
    }
];

async function insertPortalsData() {
    console.log('🚀 Inserting Portal Data into Database...\n');

    try {
        // Clear existing data first
        console.log('🗑️ Clearing existing portal data...');
        try {
            const existingPortals = await axios.get(`${baseURL}/portals`);
            if (existingPortals.data.length > 0) {
                console.log(`Found ${existingPortals.data.length} existing portals, deleting them...`);
                for (const portal of existingPortals.data) {
                    await axios.delete(`${baseURL}/portals/${portal.id}`);
                }
                console.log('✅ Cleared existing portal data');
            }
        } catch (error) {
            console.log('No existing data to clear');
        }

        // Insert new portal data
        console.log('\n📤 Inserting new portal data...');
        let successCount = 0;
        
        for (const portalData of portalsData) {
            try {
                console.log(`📝 Inserting: ${portalData.short_title}`);
                const response = await axios.post(`${baseURL}/portals`, portalData);
                console.log(`✅ Success - Created with ID: ${response.data.id}`);
                successCount++;
            } catch (error) {
                console.log(`❌ Failed to insert ${portalData.short_title}:`, error.response?.data || error.message);
            }
        }

        console.log(`\n🎉 Portal Data Insertion Complete!`);
        console.log(`✅ Successfully inserted: ${successCount}/${portalsData.length} portals`);

        // Verify the data was inserted
        console.log('\n🔍 Verifying inserted data...');
        const verifyResponse = await axios.get(`${baseURL}/portals`);
        console.log(`✅ Total portals in database: ${verifyResponse.data.length}`);
        
        console.log('\n📋 Inserted Portals:');
        verifyResponse.data.forEach((portal, index) => {
            console.log(`${index + 1}. ${portal.short_title} - ${portal.country}`);
        });

    } catch (error) {
        console.error('❌ Error inserting portal data:', error.message);
    }
}

// Run the insertion
insertPortalsData();
