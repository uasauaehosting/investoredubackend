export interface ProgramSeedRow {
  member_name: string;
  general_info: string[];
  education_materials: string[];
  specific_materials: string[];
  assisting_groups: string[];
  evaluation: string[];
  successful_programs: string[];
}

export const PROGRAMS_SEED_DATA: ProgramSeedRow[] = [
  {
    member_name: 'Jordan Securities Commission',
    general_info: [
      'Stated Goal of Investor Education Program',
      'Stated Institutional Support for Investor Education',
    ],
    education_materials: ['Investing - Basic Materials', 'Calculators / Tools'],
    specific_materials: ['High School', 'College'],
    assisting_groups: ['Single Young Adults', 'Married Young Adults'],
    evaluation: ['How do you evaluate investor education initiatives?'],
    successful_programs: ['Program'],
  },
  {
    member_name: 'Capital Market Authority',
    general_info: [
      'Stated Goal of Investor Education Program',
      'What is New? (New programs, developments, policies etc.)',
    ],
    education_materials: [
      'Investing - Basic Materials',
      'Investment and Understanding Risk and Rewards',
      'Materials Relating to Scams, Frauds, and/or Alerts to Investors',
    ],
    specific_materials: ['Youth (Grade School)', 'High School'],
    assisting_groups: ['Adults with Children', 'Investors who have "some" experience in investing'],
    evaluation: [
      'How do you evaluate investor education initiatives?',
      'How do you determine if the investor education program influences investors in their investment decisions?',
    ],
    successful_programs: ['Program', 'Supporting Research'],
  },
  {
    member_name: 'Conseil du Marché Financier - Tunisia',
    general_info: ['Other authority(ies) in my jurisdiction providing Investor Education'],
    education_materials: ['Different Types of Investments', 'Classroom Instruction Materials'],
    specific_materials: ['College', 'Saving for College'],
    assisting_groups: ['Single Young Adults', 'Military'],
    evaluation: ['How do you evaluate investor education initiatives?'],
    successful_programs: ['Program'],
  },
  {
    member_name: "Commission d'Organisation et de Surveillance des opérations de Bourse",
    general_info: ['Stated Institutional Support for Investor Education'],
    education_materials: [
      'Investing - Basic Materials',
      'Unique Resources for Investors',
      'Materials Relating to Scams, Frauds, and/or Alerts to Investors',
    ],
    specific_materials: ['Youth (Grade School)', 'High School', 'College'],
    assisting_groups: ['Single Young Adults', 'Married Young Adults', 'Adults with Children'],
    evaluation: [
      'How do you determine if the investor education program influences investors in their investment decisions?',
    ],
    successful_programs: ['Program', 'Supporting Research'],
  },
  {
    member_name: 'Saudi Capital Market Authority',
    general_info: [
      'Stated Goal of Investor Education Program',
      'What is New? (New programs, developments, policies etc.)',
    ],
    education_materials: [
      'Investing - Advanced Materials',
      'Complex and/or New Financial Products',
      'Calculators / Tools',
    ],
    specific_materials: ['High School', 'Saving for College'],
    assisting_groups: ['Preparing for Retirement', 'Retirement'],
    evaluation: ['How do you evaluate investor education initiatives?'],
    successful_programs: ['Supporting Research'],
  },
  {
    member_name: 'Financial Services Authority - Oman',
    general_info: ['Stated Goal of Investor Education Program'],
    education_materials: [
      'Investing - Basic Materials',
      'Different Types of Investments',
      'Materials Relating to Scams, Frauds, and/or Alerts to Investors',
    ],
    specific_materials: ['Youth (Grade School)'],
    assisting_groups: ['Adults with Children', 'Preparing for Retirement'],
    evaluation: [
      'How do you evaluate investor education initiatives?',
      'How do you determine if the investor education program influences investors in their investment decisions?',
    ],
    successful_programs: ['Program'],
  },
  {
    member_name: 'Qatar Financial Markets Authority',
    general_info: ['Stated Institutional Support for Investor Education'],
    education_materials: ['Investing - Basic Materials', 'Classroom Instruction Materials'],
    specific_materials: ['High School', 'College'],
    assisting_groups: ['Married Young Adults', 'Investors who have "some" experience in investing'],
    evaluation: ['How do you evaluate investor education initiatives?'],
    successful_programs: ['Program', 'Supporting Research'],
  },
  {
    member_name: 'Financial Regulatory Authority - Egypt',
    general_info: [
      'Other authority(ies) in my jurisdiction providing Investor Education',
      'What is New? (New programs, developments, policies etc.)',
    ],
    education_materials: [
      'Investment and Understanding Risk and Rewards',
      'Unique Resources for Investors',
    ],
    specific_materials: ['Saving for College', 'College'],
    assisting_groups: ['Single Young Adults', 'Retirement'],
    evaluation: [
      'How do you determine if the investor education program influences investors in their investment decisions?',
    ],
    successful_programs: ['Program'],
  },
  {
    member_name: 'Autorité Marocaine du Marché des Capitaux (AMMC)',
    general_info: ['Stated Goal of Investor Education Program'],
    education_materials: ['Investing - Basic Materials', 'Different Types of Investments'],
    specific_materials: ['Youth (Grade School)', 'High School'],
    assisting_groups: ['Single Young Adults', 'Married Young Adults'],
    evaluation: ['How do you evaluate investor education initiatives?'],
    successful_programs: ['Program', 'Supporting Research'],
  },
  {
    member_name: 'Dubai Financial Services Authority',
    general_info: ['What is New? (New programs, developments, policies etc.)'],
    education_materials: [
      'Investing - Advanced Materials',
      'Complex and/or New Financial Products',
      'Materials Relating to Scams, Frauds, and/or Alerts to Investors',
    ],
    specific_materials: ['College'],
    assisting_groups: ['Investors who have "some" experience in investing', 'Preparing for Retirement'],
    evaluation: [
      'How do you evaluate investor education initiatives?',
      'How do you determine if the investor education program influences investors in their investment decisions?',
    ],
    successful_programs: ['Supporting Research'],
  },
];
