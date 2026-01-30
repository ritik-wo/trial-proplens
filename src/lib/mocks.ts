import { CompetitorProject, Presentation, Project, DetailedProject } from './types';
export const DEFAULT_PROJECTS: DetailedProject[] = [
  {
    title: 'Sobha Hartland II',
    url: '#',
    videos: [],
    coordinates: '',
    documents: [],
    createdAt: '2025-08-15'
  },
  {
    title: 'Sobha One',
    url: '#',
    videos: [],
    coordinates: '',
    documents: [],
    createdAt: '2025-08-15'
  },
];

let _projects: Project[] = DEFAULT_PROJECTS.map((p, idx) => ({ id: `p${idx + 1}`, name: p.title, createdAt: p.createdAt }));
let _presentations: Presentation[] = [
  { id: 'pr1', name: 'Reidin Market trend insights December 2025', sizeMB: 12.3, uploadedAt: '2025-08-15' },
  { id: 'pr2', name: 'Portfolio Showcase', sizeMB: 8.7, uploadedAt: '2025-08-15' }
];
let _competitors: CompetitorProject[] = [
  { id: 'c1', name: 'Emaar Beachfront', createdAt: '2025-08-15' },
  { id: 'c2', name: 'Damac Lagoons', createdAt: '2025-08-15' }
];
type CompetitionDetail = { url?: string; coordinates?: string; documents?: { name: string; type?: string }[] };
let _competitionDetails: Record<string, CompetitionDetail> = {
  c1: {
    url: 'https://emaar.com',
    coordinates: '25.0760, 55.1777',
    documents: [{ name: 'Emaar_Brochure.pdf', type: 'PDF Document' }],
  },
  c2: {
    url: 'https://damacproperties.com',
    coordinates: '25.1000, 55.2000',
    documents: [{ name: 'Damac_Brochure.pdf', type: 'PDF Document' }],
  },
};

let _salesSops: Presentation[] = [
  { id: 'sales-1', name: 'Sales Process Manual v2.1', uploadedAt: '2025-08-15', sizeMB: 2.5 },
  { id: 'sales-2', name: 'Customer Interaction Guidelines', uploadedAt: '2025-08-15', sizeMB: 1.8 },
];
let _kycGuidelines: Presentation[] = [
  { id: 'kyc-1', name: 'KYC Document Checklist', uploadedAt: '2025-08-15', sizeMB: 1.2 },
];
let _registrationProcesses: Presentation[] = [
  { id: 'broker-1', name: 'Broker Onboarding Process', uploadedAt: '2025-08-15', sizeMB: 3.1 },
];
let _stakeholderContacts: Presentation[] = [];

export const CONVERSATION_USERS = [
  { id: 'all', name: 'All users' },
  { id: '1', name: 'Priya Sharma' },
  { id: '2', name: 'Rahul Patel' },
  { id: '3', name: 'Anjali Kumar' },
  { id: '4', name: 'Wei Zhang' },
  { id: '5', name: 'Li Ming' },
  { id: '6', name: 'Chen Yu' },
  { id: '7', name: 'Ahmad Hassan' },
  { id: '8', name: 'Fatima Al-Zahra' },
  { id: '9', name: 'Omar Abdullahi' },
  { id: '10', name: 'Aisha Mohamed' },
];

export const ENGAGEMENT_STATS = {
  totalQueries: '12453',
  activeUsers: '312',
  queriesPerUser: '39.9',
  unhelpfulRate: '6.4%',
};

export const ENGAGEMENT_USAGE_TREND = [
  { date: 'Aug 01', value: 430 },
  { date: 'Aug 03', value: 450 },
  { date: 'Aug 06', value: 520 },
  { date: 'Aug 09', value: 680 },
  { date: 'Aug 12', value: 850 },
  { date: 'Aug 15', value: 1100 },
  { date: 'Aug 18', value: 1350 },
];

export const ENGAGEMENT_UNHELPFUL_REASONS = [
  { name: 'Incorrect', value: 35 },
  { name: 'Out of scope', value: 18 },
  { name: 'Incomplete', value: 22 },
  { name: 'Formatting issues', value: 12 },
  { name: 'Outdated information', value: 8 },
  { name: 'Other', value: 15 },
];

export const MONITORING_STATS = {
  cumulativeTokens: '135 M',
  cumulativeTokenCost: '$500',
  failedQueries: '1.8%',
  avgLatency: '1.9s',
  cacheHitRate: '37%',
};

export const MONITORING_TOKENS_CONSUMED = [
  { date: 'Jun 01', value: 9 },
  { date: 'Jun 15', value: 12 },
  { date: 'Jul 01', value: 14 },
  { date: 'Jul 15', value: 16 },
  { date: 'Aug 01', value: 24 },
  { date: 'Aug 15', value: 30 },
];

export const mocks = {
  DEFAULT_PROJECTS,
  get projects() { return _projects; },
  addProject(p: Project) { _projects = [p, ..._projects]; },
  removeProject(id: string) { _projects = _projects.filter(p => p.id !== id); },

  get presentations() { return _presentations; },
  removePresentation(id: string) { _presentations = _presentations.filter(p => p.id !== id); },

  get competitors() { return _competitors; },
  addCompetitor(c: CompetitorProject) { _competitors = [c, ..._competitors]; },
  removeCompetitor(id: string) { _competitors = _competitors.filter(c => c.id !== id); delete _competitionDetails[id]; },

  get competitionDetails() { return _competitionDetails; },
  setCompetitorDetail(id: string, d: CompetitionDetail) { _competitionDetails[id] = d; },
  getCompetitorDetail(id: string) { return _competitionDetails[id]; },

  get salesSops() { return _salesSops; },
  addSalesSop(d: Presentation) { _salesSops = [d, ..._salesSops]; },
  removeSalesSop(id: string) { _salesSops = _salesSops.filter(d => d.id !== id); },

  get kycGuidelines() { return _kycGuidelines; },
  addKycGuideline(d: Presentation) { _kycGuidelines = [d, ..._kycGuidelines]; },
  removeKycGuideline(id: string) { _kycGuidelines = _kycGuidelines.filter(d => d.id !== id); },

  get registrationProcesses() { return _registrationProcesses; },
  addRegistrationProcess(d: Presentation) { _registrationProcesses = [d, ..._registrationProcesses]; },
  removeRegistrationProcess(id: string) { _registrationProcesses = _registrationProcesses.filter(d => d.id !== id); },

  get stakeholderContacts() { return _stakeholderContacts; },
  addStakeholderContact(d: Presentation) { _stakeholderContacts = [d, ..._stakeholderContacts]; },
  removeStakeholderContact(id: string) { _stakeholderContacts = _stakeholderContacts.filter(d => d.id !== id); },
};



export const HISTORY_CONVERSATIONS = [
  {
    id: 'c1',
    title: 'Azizi Riviera Transactions',
    subtitle: 'Last 5 transaction insights',
    updatedAt: '2025-10-25',
    messages: [
      { id: 'm1', role: 'user', time: '10:30 AM', content: 'Give me the last 5 transactions in Azizi Riviera.' },
      { id: 'm2', role: 'assistant', time: '10:31 AM', content: 'Here are the last 5 transactions: 3BR – AED 3.1M, 2BR – AED 2.4M, 1BR – AED 1.6M, etc.' },
      { id: 'm3', role: 'user', time: '10:32 AM', content: 'What’s the average price per sq.ft there?' },
      { id: 'm4', role: 'assistant', time: '10:33 AM', content: 'Approximately AED 1,750–1,900 per sq.ft depending on tower.' },
      { id: 'm5', role: 'user', time: '10:34 AM', content: 'Which phase performs best?' },
      { id: 'm6', role: 'assistant', time: '10:35 AM', content: 'Phase 1 shows the highest absorption and resale demand.' },
      { id: 'm7', role: 'user', time: '10:36 AM', content: 'Any new launches coming?' },
      { id: 'm8', role: 'assistant', time: '10:37 AM', content: 'A new waterfront mid-rise is expected in Q1 2026.' },
      { id: 'm9', role: 'user', time: '10:38 AM', content: 'What’s the rental yield range?' },
      { id: 'm10', role: 'assistant', time: '10:39 AM', content: 'Rental yields average 6.5%–7.2% annually.' }
    ]
  },
  {
    id: 'c2',
    title: 'Channel Partner Registration Policy',
    subtitle: 'Partner registration guidelines',
    updatedAt: '2025-10-20',
    messages: [
      { id: 'm1', role: 'user', time: '3:12 PM', content: 'Share channel partner registration policy.' },
      { id: 'm2', role: 'assistant', time: '3:14 PM', content: 'The policy includes documentation, due diligence, and approval steps.' },
      { id: 'm3', role: 'user', time: '3:15 PM', content: 'What documents are mandatory?' },
      { id: 'm4', role: 'assistant', time: '3:16 PM', content: 'Trade license, passport copies, company profile, and bank details.' },
      { id: 'm5', role: 'user', time: '3:17 PM', content: 'How long does approval take?' },
      { id: 'm6', role: 'assistant', time: '3:18 PM', content: 'Typically 3–5 business days post verification.' },
      { id: 'm7', role: 'user', time: '3:19 PM', content: 'Is onboarding training required?' },
      { id: 'm8', role: 'assistant', time: '3:20 PM', content: 'Yes, a mandatory 45-minute orientation session.' },
      { id: 'm9', role: 'user', time: '3:21 PM', content: 'Any fees involved?' },
      { id: 'm10', role: 'assistant', time: '3:22 PM', content: 'Registration is free, but compliance checks may apply.' }
    ]
  },
  {
    id: 'c3',
    title: 'Sobha One 4-Bed Units',
    subtitle: 'Pricing & maintenance overview',
    updatedAt: '2025-10-13',
    messages: [
      { id: 'm1', role: 'user', time: '11:12 AM', content: 'Give 4-bed pricing details for Sobha One.' },
      { id: 'm2', role: 'assistant', time: '11:14 AM', content: '4-bed units start at AED 7.8M depending on floor level.' },
      { id: 'm3', role: 'user', time: '11:15 AM', content: 'What’s the per sq.ft rate?' },
      { id: 'm4', role: 'assistant', time: '11:16 AM', content: 'Approximately AED 2,450–2,650 per sq.ft.' },
      { id: 'm5', role: 'user', time: '11:17 AM', content: 'Any premium floors?' },
      { id: 'm6', role: 'assistant', time: '11:18 AM', content: 'High floors (30+) carry a 3–5% premium.' },
      { id: 'm7', role: 'user', time: '11:19 AM', content: 'Maintenance cost?' },
      { id: 'm8', role: 'assistant', time: '11:20 AM', content: 'AED 25–28 per sq.ft annually.' },
      { id: 'm9', role: 'user', time: '11:21 AM', content: 'Handover timeline?' },
      { id: 'm10', role: 'assistant', time: '11:22 AM', content: 'Expected Q4 2026.' }
    ]
  },
  {
    id: 'c4',
    title: 'Sobha vs Ellington Comparison',
    subtitle: 'Pricing & amenity analysis',
    updatedAt: '2025-10-06',
    messages: [
      { id: 'm1', role: 'user', time: '9:01 AM', content: 'Compare Riverside Crescent vs Ellington One.' },
      { id: 'm2', role: 'assistant', time: '9:05 AM', content: 'Riverside ~AED 2,150/sq.ft; Ellington One ~AED 2,350/sq.ft.' },
      { id: 'm3', role: 'user', time: '9:06 AM', content: 'Which has better ROI?' },
      { id: 'm4', role: 'assistant', time: '9:07 AM', content: 'Ellington historically performs slightly higher on rentals.' },
      { id: 'm5', role: 'user', time: '9:08 AM', content: 'What about amenities?' },
      { id: 'm6', role: 'assistant', time: '9:09 AM', content: 'Ellington offers premium interiors; Sobha offers stronger community facilities.' },
      { id: 'm7', role: 'user', time: '9:10 AM', content: 'Any upcoming price changes?' },
      { id: 'm8', role: 'assistant', time: '9:11 AM', content: 'Both expecting 3–4% increases post next launch.' },
      { id: 'm9', role: 'user', time: '9:12 AM', content: 'Which suits families more?' },
      { id: 'm10', role: 'assistant', time: '9:13 AM', content: 'Riverside Crescent due to larger parks and quieter surroundings.' }
    ]
  },
  {
    id: 'c5',
    title: 'Creek Harbour Market Update',
    subtitle: 'Sales trends & rental yields',
    updatedAt: '2025-09-30',
    messages: [
      { id: 'm1', role: 'user', time: '2:08 PM', content: 'Give me the latest market update for Creek Harbour.' },
      { id: 'm2', role: 'assistant', time: '2:09 PM', content: 'Prices increased 6% YoY driven by high waterfront demand.' },
      { id: 'm3', role: 'user', time: '2:10 PM', content: 'What’s the average ticket size?' },
      { id: 'm4', role: 'assistant', time: '2:11 PM', content: '1BR at AED 1.7M, 2BR at AED 2.6M, 3BR at AED 4.1M.' },
      { id: 'm5', role: 'user', time: '2:12 PM', content: 'Rental yields?' },
      { id: 'm6', role: 'assistant', time: '2:13 PM', content: 'Average yields 5.8%–6.4%.' },
      { id: 'm7', role: 'user', time: '2:14 PM', content: 'Any new project launches?' },
      { id: 'm8', role: 'assistant', time: '2:15 PM', content: 'Emaar launching a waterfront mid-rise cluster soon.' },
      { id: 'm9', role: 'user', time: '2:16 PM', content: 'How’s resale activity?' },
      { id: 'm10', role: 'assistant', time: '2:17 PM', content: 'Moderate but improving due to upcoming metro connectivity.' }
    ]
  },
  {
    id: 'c6',
    title: 'Palm Jumeirah Villas',
    subtitle: 'Luxury villa price movement',
    updatedAt: '2025-09-22',
    messages: [
      { id: 'm1', role: 'user', time: '4:30 PM', content: 'Give me latest pricing for Palm villas.' },
      { id: 'm2', role: 'assistant', time: '4:31 PM', content: 'Signature Villas now start at AED 28M.' },
      { id: 'm3', role: 'user', time: '4:32 PM', content: 'What’s the highest transaction this year?' },
      { id: 'm4', role: 'assistant', time: '4:33 PM', content: 'A record AED 185M villa was sold in 2025.' },
      { id: 'm5', role: 'user', time: '4:34 PM', content: 'How’s rental demand?' },
      { id: 'm6', role: 'assistant', time: '4:35 PM', content: 'Strong among UHNW tenants; yields ~4%.' },
      { id: 'm7', role: 'user', time: '4:36 PM', content: 'Any new mansion launches?' },
      { id: 'm8', role: 'assistant', time: '4:37 PM', content: 'A new ultra-luxury frond project launches Q2 2026.' },
      { id: 'm9', role: 'user', time: '4:38 PM', content: 'Price trend forecast?' },
      { id: 'm10', role: 'assistant', time: '4:39 PM', content: 'Expected growth: 3–6% in the next 12 months.' }
    ]
  },
  {
    id: 'c7',
    title: 'Singapore Hills Townhouses',
    subtitle: 'Demand & resale analysis',
    updatedAt: '2025-09-10',
    messages: [
      { id: 'm1', role: 'user', time: '12:01 PM', content: 'Tell me about Singapore Hills townhouse market.' },
      { id: 'm2', role: 'assistant', time: '12:02 PM', content: 'Townhouses average AED 4.2M with high family demand.' },
      { id: 'm3', role: 'user', time: '12:03 PM', content: 'Which clusters are best?' },
      { id: 'm4', role: 'assistant', time: '12:04 PM', content: 'Maple and Sidra show the strongest resale and rental traction.' },
      { id: 'm5', role: 'user', time: '12:05 PM', content: 'Price growth this year?' },
      { id: 'm6', role: 'assistant', time: '12:06 PM', content: 'Up nearly 9% YoY.' },
      { id: 'm7', role: 'user', time: '12:07 PM', content: 'Rental yields?' },
      { id: 'm8', role: 'assistant', time: '12:08 PM', content: 'Around 5.6% depending on layout.' },
      { id: 'm9', role: 'user', time: '12:09 PM', content: 'Upcoming launches?' },
      { id: 'm10', role: 'assistant', time: '12:10 PM', content: 'A new townhouse enclave expected in Q3 2026.' }
    ]
  },
  {
    id: 'c8',
    title: 'JVC Apartment Demand',
    subtitle: 'Budget-friendly segment insights',
    updatedAt: '2025-09-02',
    messages: [
      { id: 'm1', role: 'user', time: '5:10 PM', content: 'How’s the demand in JVC apartments?' },
      { id: 'm2', role: 'assistant', time: '5:11 PM', content: 'Strong due to affordability and rental demand.' },
      { id: 'm3', role: 'user', time: '5:12 PM', content: 'Price per sq.ft?' },
      { id: 'm4', role: 'assistant', time: '5:13 PM', content: 'Ranges AED 900–1,200.' },
      { id: 'm5', role: 'user', time: '5:14 PM', content: 'Best performing developers?' },
      { id: 'm6', role: 'assistant', time: '5:15 PM', content: 'Ellington, Binghatti, and Samana.' },
      { id: 'm7', role: 'user', time: '5:16 PM', content: 'Average ROI?' },
      { id: 'm8', role: 'assistant', time: '5:17 PM', content: '6.8%–7.5% annually.' },
      { id: 'm9', role: 'user', time: '5:18 PM', content: 'Any oversupply risk?' },
      { id: 'm10', role: 'assistant', time: '5:19 PM', content: 'Mild risk, but absorbed quickly due to rentals.' }
    ]
  },
  {
    id: 'c9',
    title: 'Downtown Singapore Premium Units',
    subtitle: 'High-end apartment pricing',
    updatedAt: '2025-08-20',
    messages: [
      { id: 'm1', role: 'user', time: '11:00 AM', content: 'What’s the price of premium Downtown units?' },
      { id: 'm2', role: 'assistant', time: '11:01 AM', content: '1BR starts at AED 2.1M; 2BR at AED 3.8M; 3BR at AED 6.2M.' },
      { id: 'm3', role: 'user', time: '11:02 AM', content: 'Which towers sell fastest?' },
      { id: 'm4', role: 'assistant', time: '11:03 AM', content: 'Burj Crown, Boulevard Point, and Act One Two.' },
      { id: 'm5', role: 'user', time: '11:04 AM', content: 'Rental yields?' },
      { id: 'm6', role: 'assistant', time: '11:05 AM', content: 'Around 5–6% due to tourism demand.' },
      { id: 'm7', role: 'user', time: '11:06 AM', content: 'Resale liquidity?' },
      { id: 'm8', role: 'assistant', time: '11:07 AM', content: 'High—units sell within 30–45 days on average.' },
      { id: 'm9', role: 'user', time: '11:08 AM', content: 'Any new off-plan towers?' },
      { id: 'm10', role: 'assistant', time: '11:09 AM', content: 'Emaar planning a new tower near Opera District.' }
    ]
  },
  {
    id: 'c10',
    title: 'Business Bay Investment Inquiry',
    subtitle: 'Investor demand & pricing trends',
    updatedAt: '2025-08-11',
    messages: [
      { id: 'm1', role: 'user', time: '4:00 PM', content: 'How’s investment performance in Business Bay?' },
      { id: 'm2', role: 'assistant', time: '4:01 PM', content: 'It remains among the top 3 investor hotspots.' },
      { id: 'm3', role: 'user', time: '4:02 PM', content: 'What’s the average price?' },
      { id: 'm4', role: 'assistant', time: '4:03 PM', content: 'AED 1,450–1,650 per sq.ft depending on tower.' },
      { id: 'm5', role: 'user', time: '4:04 PM', content: 'Rental yields?' },
      { id: 'm6', role: 'assistant', time: '4:05 PM', content: '6.2%–7.1% annually.' },
      { id: 'm7', role: 'user', time: '4:06 PM', content: 'Which buildings perform best?' },
      { id: 'm8', role: 'assistant', time: '4:07 PM', content: 'Peninsula, Aykon City, and Bayswater rank high.' },
      { id: 'm9', role: 'user', time: '4:08 PM', content: 'Future growth?' },
      { id: 'm10', role: 'assistant', time: '4:09 PM', content: 'Forecasted 3–5% price appreciation in next year.' }
    ]
  }
];