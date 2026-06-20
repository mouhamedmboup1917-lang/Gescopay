import {
  User,
  Wallet,
  Transaction,
  VirtualCard,
  Merchant,
  Invoice,
  Settlement,
  WalletProviderInfo,
  WalletProvider,
} from '@/types';

// ===== WALLET PROVIDERS =====

export const WALLET_PROVIDERS: WalletProviderInfo[] = [
  {
    id: 'wave',
    name: 'Wave',
    shortName: 'Wave',
    color: '#1B6FE4',
    gradientColors: ['#1B6FE4', '#0A4DB0'],
    logo: 'wave',
    country: ['SN', 'CI', 'ML', 'BF', 'GN', 'GM'],
    isAvailable: true,
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    shortName: 'Orange',
    color: '#FF6600',
    gradientColors: ['#FF6600', '#CC5200'],
    logo: 'orange-money',
    country: ['SN', 'CI', 'ML', 'GN', 'CM'],
    isAvailable: true,
  },
  {
    id: 'free_money',
    name: 'Free Money',
    shortName: 'Free',
    color: '#00B050',
    gradientColors: ['#00B050', '#007A38'],
    logo: 'free-money',
    country: ['SN'],
    isAvailable: true,
  },
  {
    id: 'qmoney',
    name: 'QMoney',
    shortName: 'QMoney',
    color: '#E30613',
    gradientColors: ['#E30613', '#B0040F'],
    logo: 'qmoney',
    country: ['SN'],
    isAvailable: true,
  },
  {
    id: 'africell_money',
    name: 'Africell Money',
    shortName: 'Africell',
    color: '#E31E24',
    gradientColors: ['#E31E24', '#B01519'],
    logo: 'africell',
    country: ['GM', 'SL', 'UG', 'CD'],
    isAvailable: true,
  },
  {
    id: 'airtel_money',
    name: 'Airtel Money',
    shortName: 'Airtel',
    color: '#EC1C24',
    gradientColors: ['#EC1C24', '#C0141B'],
    logo: 'airtel',
    country: ['GH', 'NG', 'KE', 'UG', 'ZM', 'RW'],
    isAvailable: true,
  },
  {
    id: 'mtn_momo',
    name: 'MTN MoMo',
    shortName: 'MTN',
    color: '#FFCC00',
    gradientColors: ['#FFCC00', '#CCA300'],
    logo: 'mtn',
    country: ['GH', 'NG', 'UG', 'RW', 'CM', 'CI', 'ZA', 'ZM'],
    isAvailable: true,
  },
];

export const getWalletProvider = (id: WalletProvider): WalletProviderInfo =>
  WALLET_PROVIDERS.find((p) => p.id === id)!;

// ===== MOCK USERS =====

const africanFirstNames = [
  'Amadou', 'Fatou', 'Moussa', 'Aissatou', 'Ibrahima', 'Mariama', 'Cheikh',
  'Rokhaya', 'Abdoulaye', 'Ndeye', 'Oumar', 'Khady', 'Modou', 'Astou',
  'Lamine', 'Coumba', 'Seydou', 'Bineta', 'Mamadou', 'Yacine',
  'Kofi', 'Ama', 'Kwame', 'Abena', 'Yaw', 'Akosua', 'Kojo', 'Adwoa',
  'Emeka', 'Ngozi', 'Chidi', 'Adaeze', 'Tunde', 'Bisi', 'Kayode', 'Folake',
  'Thierno', 'Kadiatou', 'Alpha', 'Fatoumata', 'Boubacar', 'Oumou',
  'Hassan', 'Halima', 'Yusuf', 'Zainab', 'Ibrahim', 'Fatima',
  'Jean-Pierre', 'Marie-Claire', 'Patrick', 'Grace', 'Samuel', 'Esther',
  'David', 'Ruth', 'Daniel', 'Miriam', 'Joseph', 'Naomi', 'Benjamin', 'Sarah',
  'Kwabena', 'Efua', 'Mensah', 'Esi', 'Nana', 'Baah', 'Asante', 'Acheampong',
  'Diallo', 'Barry', 'Bah', 'Kouyaté', 'Camara', 'Conté', 'Souaré', 'Sylla',
  'Traoré', 'Coulibaly', 'Koné', 'Touré', 'Bamba', 'Dembélé', 'Keïta', 'Sanogo',
  'Seck', 'Diop', 'Fall', 'Ndiaye', 'Ndoye', 'Sarr', 'Mbaye', 'Gueye',
  'Adeola', 'Taiwo', 'Kehinde', 'Olumide', 'Adeyemi', 'Adebayo', 'Ayodeji', 'Oluwatobi',
];

const africanLastNames = [
  'Diallo', 'Traoré', 'Coulibaly', 'Diop', 'Ndiaye', 'Fall', 'Sarr', 'Gueye',
  'Konaté', 'Touré', 'Bamba', 'Koné', 'Cissé', 'Barry', 'Bah', 'Keita',
  'Asante', 'Mensah', 'Owusu', 'Osei', 'Boateng', 'Appiah', 'Ankrah', 'Agyei',
  'Okonkwo', 'Adeyemi', 'Ogundimu', 'Adeleke', 'Afolabi', 'Adekunle', 'Balogun', 'Ibrahim',
  'Camara', 'Condé', 'Sylla', 'Kouyaté', 'Souaré', 'Baldé', 'Conté', 'Magassouba',
  'Sow', 'Mbaye', 'Ndoye', 'Faye', 'Thiam', 'Ba', 'Diouf', 'Sène',
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

const countries = ['SN', 'CI', 'GH', 'NG', 'ML', 'GN', 'BF'];
const cities = {
  SN: ['Dakar', 'Thiès', 'Kaolack', 'Saint-Louis', 'Ziguinchor'],
  CI: ['Abidjan', 'Bouaké', 'San Pédro', 'Yamoussoukro'],
  GH: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast'],
  NG: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan'],
  ML: ['Bamako', 'Sikasso', 'Mopti'],
  GN: ['Conakry', 'Kankan', 'Nzérékoré'],
  BF: ['Ouagadougou', 'Bobo-Dioulasso'],
};

export function generateMockUsers(count = 100): User[] {
  return Array.from({ length: count }, (_, i) => {
    const country = randomItem(countries);
    const firstName = randomItem(africanFirstNames);
    const lastName = randomItem(africanLastNames);
    const citiesList = cities[country as keyof typeof cities] || ['Dakar'];
    return {
      id: `user_${String(i + 1).padStart(4, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gescopay.com`,
      phone: `+221 7${randomBetween(0, 9)} ${String(randomBetween(100, 999))} ${String(randomBetween(10, 99))} ${String(randomBetween(10, 99))}`,
      country,
      city: randomItem(citiesList),
      role: i === 0 ? 'admin' : i < 20 ? 'merchant' : 'user',
      kycStatus: randomItem(['pending', 'verified', 'verified', 'verified', 'submitted'] as const),
      isEmailVerified: Math.random() > 0.2,
      isPhoneVerified: Math.random() > 0.1,
      isBiometricsEnabled: Math.random() > 0.4,
      isPinEnabled: Math.random() > 0.1,
      twoFactorEnabled: Math.random() > 0.6,
      preferredCurrency: country === 'GH' ? 'GHS' : country === 'NG' ? 'NGN' : 'XOF',
      language: country === 'GH' || country === 'NG' ? 'en' : 'fr',
      createdAt: randomDate(new Date('2023-01-01'), new Date('2024-06-01')),
      lastLoginAt: randomDate(new Date('2024-11-01'), new Date()),
    } as User;
  });
}

export const MOCK_USERS = generateMockUsers(100);

// Current logged-in user
export const CURRENT_USER: User = {
  id: 'user_0001',
  firstName: 'Amadou',
  lastName: 'Diallo',
  email: 'amadou.diallo@gescopay.com',
  phone: '+221 77 123 45 67',
  country: 'SN',
  city: 'Dakar',
  role: 'user',
  kycStatus: 'verified',
  isEmailVerified: true,
  isPhoneVerified: true,
  isBiometricsEnabled: true,
  isPinEnabled: true,
  twoFactorEnabled: true,
  preferredCurrency: 'XOF',
  language: 'fr',
  createdAt: '2023-06-15T10:30:00Z',
  lastLoginAt: new Date().toISOString(),
};

// ===== MOCK WALLETS =====

export const MOCK_WALLETS: Wallet[] = [
  {
    id: 'wallet_001',
    userId: 'user_0001',
    provider: 'wave',
    providerInfo: WALLET_PROVIDERS[0],
    phoneNumber: '+221 77 123 45 67',
    alias: 'Mon Wave',
    balance: 458750,
    currency: 'XOF',
    isDefault: true,
    isActive: true,
    lastSyncAt: new Date().toISOString(),
    createdAt: '2023-07-01T08:00:00Z',
  },
  {
    id: 'wallet_002',
    userId: 'user_0001',
    provider: 'orange_money',
    providerInfo: WALLET_PROVIDERS[1],
    phoneNumber: '+221 77 123 45 67',
    alias: 'Orange Money',
    balance: 125000,
    currency: 'XOF',
    isDefault: false,
    isActive: true,
    lastSyncAt: new Date().toISOString(),
    createdAt: '2023-08-15T10:00:00Z',
  },
  {
    id: 'wallet_003',
    userId: 'user_0001',
    provider: 'free_money',
    providerInfo: WALLET_PROVIDERS[2],
    phoneNumber: '+221 76 123 45 67',
    alias: 'Free Money',
    balance: 67500,
    currency: 'XOF',
    isDefault: false,
    isActive: true,
    lastSyncAt: new Date().toISOString(),
    createdAt: '2024-01-10T09:00:00Z',
  },
];

export const TOTAL_BALANCE = MOCK_WALLETS.reduce((sum, w) => sum + w.balance, 0);

// ===== MOCK TRANSACTIONS =====

const merchantNames = [
  'Diallo Boutique', 'Restaurant Teranga', 'Pharmacie Santé Plus', 'Supermarché City',
  'Total Petrol Station', 'Orange Telecom', 'Wave Transfer', 'MTN Store',
  'Dakar Fast Food', 'Boulangerie Moderne', 'École Privée Excellence', 'Clinique Pasteur',
  'Air Sénégal', 'DHL Express', 'Jumia Store', 'Amazon Africa',
  'Transfert Mobile', 'Top Up Wave', 'Recharge Orange', 'Paiement Facture',
];

const transactionDescriptions = {
  send: ['Transfert à {name}', 'Envoi d\'argent à {name}', 'Paiement à {name}'],
  receive: ['Reçu de {name}', 'Transfert entrant de {name}'],
  payment: ['Paiement chez {name}', 'Achat chez {name}'],
  top_up: ['Rechargement Wave', 'Dépôt Orange Money', 'Chargement compte'],
  withdrawal: ['Retrait Wave', 'Retrait Orange Money'],
};

export function generateMockTransactions(count = 1000): Transaction[] {
  const types: Transaction['type'][] = ['send', 'receive', 'payment', 'top_up', 'withdrawal', 'refund'];
  const statuses: Transaction['status'][] = ['completed', 'completed', 'completed', 'completed', 'pending', 'failed'];
  const walletIds = ['wallet_001', 'wallet_002', 'wallet_003'];

  return Array.from({ length: count }, (_, i) => {
    const type = randomItem(types);
    const status = randomItem(statuses);
    const amount = randomBetween(500, 250000);
    const fee = Math.round(amount * 0.01);
    const merchantName = randomItem(merchantNames);

    return {
      id: `txn_${String(i + 1).padStart(6, '0')}`,
      userId: 'user_0001',
      type,
      status,
      amount,
      fee,
      currency: 'XOF' as const,
      fromWallet: type === 'send' || type === 'payment' || type === 'withdrawal' ? randomItem(walletIds) : undefined,
      toWallet: type === 'receive' || type === 'top_up' ? randomItem(walletIds) : undefined,
      merchantId: type === 'payment' ? `merchant_${randomBetween(1, 20).toString().padStart(3, '0')}` : undefined,
      merchantName: type === 'payment' ? merchantName : undefined,
      description: type === 'payment' ? `Paiement chez ${merchantName}` : type === 'send' ? `Transfert sortant` : type === 'receive' ? `Transfert entrant` : `${type === 'top_up' ? 'Rechargement' : 'Retrait'} portefeuille`,
      reference: `GP${Date.now()}${i}`,
      createdAt: randomDate(new Date('2024-01-01'), new Date()),
      completedAt: status === 'completed' ? randomDate(new Date('2024-01-01'), new Date()) : undefined,
    } as Transaction;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const MOCK_TRANSACTIONS = generateMockTransactions(1000);

// ===== MOCK VIRTUAL CARD =====

export const MOCK_CARD: VirtualCard = {
  id: 'card_001',
  userId: 'user_0001',
  cardNumber: '4532 1234 5678 9012',
  maskedNumber: '4532 •••• •••• 9012',
  holderName: 'AMADOU DIALLO',
  expiryMonth: 3,
  expiryYear: 2027,
  cvv: '425',
  status: 'active',
  spendingLimit: 500000,
  spentAmount: 127500,
  linkedWalletId: 'wallet_001',
  currency: 'XOF',
  createdAt: '2024-01-15T12:00:00Z',
};

// ===== MOCK MERCHANTS =====

const businessTypes = [
  'Restaurant', 'Boutique', 'Pharmacie', 'Supermarché', 'Station Service',
  'Hôtel', 'Clinique', 'École', 'Salon de beauté', 'Boulangerie',
  'Bijouterie', 'Épicerie', 'Librairie', 'Quincaillerie', 'Électronique',
  'Mode & Vêtements', 'Transports', 'Services', 'Télécommunications', 'E-commerce',
];

export function generateMockMerchants(count = 20): Merchant[] {
  return Array.from({ length: count }, (_, i) => {
    const businessType = businessTypes[i % businessTypes.length];
    const lastName = randomItem(africanLastNames);
    const totalRev = randomBetween(1000000, 50000000);
    return {
      id: `merchant_${String(i + 1).padStart(3, '0')}`,
      userId: `user_${String(i + 2).padStart(4, '0')}`,
      businessName: `${lastName} ${businessType}`,
      businessType,
      merchantType: Math.random() > 0.3 ? 'business' : 'individual',
      registrationNumber: `SN${randomBetween(100000, 999999)}`,
      taxNumber: `TIN-${randomBetween(10000, 99999)}`,
      address: `${randomBetween(1, 200)} Rue ${randomItem(africanLastNames)}`,
      city: randomItem(['Dakar', 'Thiès', 'Abidjan', 'Accra', 'Lagos', 'Bamako']),
      country: randomItem(countries),
      phone: `+221 7${randomBetween(0, 9)} ${String(randomBetween(100, 999))} ${String(randomBetween(10, 99))} ${String(randomBetween(10, 99))}`,
      email: `contact@${lastName.toLowerCase()}${businessType.toLowerCase().replace(/ /g, '')}.com`,
      isVerified: Math.random() > 0.2,
      isActive: Math.random() > 0.1,
      totalRevenue: totalRev,
      todayRevenue: randomBetween(50000, 500000),
      monthlyRevenue: Math.round(totalRev * 0.08),
      weeklyRevenue: Math.round(totalRev * 0.02),
      transactionCount: randomBetween(100, 5000),
      createdAt: randomDate(new Date('2023-01-01'), new Date('2024-06-01')),
    } as Merchant;
  });
}

export const MOCK_MERCHANTS = generateMockMerchants(20);

// Current merchant (for merchant dashboard)
export const CURRENT_MERCHANT: Merchant = {
  id: 'merchant_001',
  userId: 'user_0002',
  businessName: 'Diallo Restaurant & Traiteur',
  businessType: 'Restaurant',
  merchantType: 'business',
  registrationNumber: 'SN789456',
  taxNumber: 'TIN-45678',
  address: '45 Avenue Cheikh Anta Diop',
  city: 'Dakar',
  country: 'SN',
  phone: '+221 33 867 34 56',
  email: 'contact@diallorestaurant.sn',
  website: 'https://diallorestaurant.sn',
  isVerified: true,
  isActive: true,
  totalRevenue: 28500000,
  todayRevenue: 425000,
  monthlyRevenue: 2280000,
  weeklyRevenue: 570000,
  transactionCount: 3847,
  createdAt: '2023-03-01T09:00:00Z',
};

// ===== MOCK INVOICES =====

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    merchantId: 'merchant_001',
    customerName: 'Fatou Sarr',
    customerEmail: 'fatou.sarr@email.com',
    status: 'paid',
    items: [
      { description: 'Menu Thiéboudienne', quantity: 2, unitPrice: 5000, taxRate: 0.18, total: 11800 },
      { description: 'Jus Bissap', quantity: 2, unitPrice: 1500, taxRate: 0.18, total: 3540 },
    ],
    subtotal: 13000,
    taxTotal: 2340,
    total: 15340,
    currency: 'XOF',
    dueDate: '2024-12-31T23:59:59Z',
    paidAt: '2024-12-15T14:30:00Z',
    notes: 'Merci pour votre fidélité',
    createdAt: '2024-12-15T12:00:00Z',
  },
  {
    id: 'inv_002',
    merchantId: 'merchant_001',
    customerName: 'Modou Faye',
    status: 'sent',
    items: [
      { description: 'Commande traiteur 50 pers.', quantity: 1, unitPrice: 250000, taxRate: 0.18, total: 295000 },
    ],
    subtotal: 250000,
    taxTotal: 45000,
    total: 295000,
    currency: 'XOF',
    dueDate: '2025-01-15T23:59:59Z',
    notes: 'Paiement 50% à la commande, solde à la livraison',
    createdAt: '2024-12-20T09:00:00Z',
  },
];

// ===== MOCK SETTLEMENTS =====

export const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 'settle_001',
    merchantId: 'merchant_001',
    amount: 570000,
    fee: 5700,
    netAmount: 564300,
    currency: 'XOF',
    status: 'completed',
    destinationType: 'bank',
    destinationDetails: {
      bankName: 'CBAO',
      accountNumber: 'SN83000100000000000000000009',
    },
    reference: 'SETTLE-GP-20241215-001',
    requestedAt: '2024-12-15T08:00:00Z',
    processedAt: '2024-12-15T10:30:00Z',
    completedAt: '2024-12-15T14:00:00Z',
    transactions: ['txn_000001', 'txn_000002', 'txn_000003'],
  },
  {
    id: 'settle_002',
    merchantId: 'merchant_001',
    amount: 425000,
    fee: 4250,
    netAmount: 420750,
    currency: 'XOF',
    status: 'processing',
    destinationType: 'wallet',
    destinationDetails: {
      walletProvider: 'wave',
      walletPhone: '+221 33 867 34 56',
    },
    reference: 'SETTLE-GP-20241220-002',
    requestedAt: '2024-12-20T16:00:00Z',
    transactions: ['txn_000010', 'txn_000011'],
  },
];

// ===== SPENDING ANALYTICS =====

export const SPENDING_CATEGORIES = [
  { name: 'Alimentation', amount: 87500, percentage: 35, color: '#00A8A8', icon: 'restaurant' },
  { name: 'Transport', amount: 50000, percentage: 20, color: '#FF7A00', icon: 'car' },
  { name: 'Shopping', amount: 37500, percentage: 15, color: '#3B82F6', icon: 'bag' },
  { name: 'Santé', amount: 25000, percentage: 10, color: '#22C55E', icon: 'medical' },
  { name: 'Services', amount: 25000, percentage: 10, color: '#8B5CF6', icon: 'briefcase' },
  { name: 'Autres', amount: 25000, percentage: 10, color: '#EC4899', icon: 'grid' },
];

export const MONTHLY_REVENUE_DATA = [
  { date: 'Juil', amount: 1850000 },
  { date: 'Août', amount: 2100000 },
  { date: 'Sept', amount: 1950000 },
  { date: 'Oct', amount: 2400000 },
  { date: 'Nov', amount: 2650000 },
  { date: 'Déc', amount: 2280000 },
];

export const WEEKLY_REVENUE_DATA = [
  { date: 'Lun', amount: 78000 },
  { date: 'Mar', amount: 92000 },
  { date: 'Mer', amount: 65000 },
  { date: 'Jeu', amount: 110000 },
  { date: 'Ven', amount: 145000 },
  { date: 'Sam', amount: 198000 },
  { date: 'Dim', amount: 82000 },
];

export const PAYMENT_SOURCES = [
  { name: 'Wave', percentage: 45, color: '#1B6FE4' },
  { name: 'Orange Money', percentage: 28, color: '#FF6600' },
  { name: 'Free Money', percentage: 15, color: '#00B050' },
  { name: 'GescoPay Card', percentage: 8, color: '#00A8A8' },
  { name: 'Autres', percentage: 4, color: '#94A3B8' },
];

// ===== ADMIN DASHBOARD METRICS =====

export const ADMIN_METRICS = {
  totalUsers: 128543,
  activeUsers: 87234,
  totalMerchants: 4521,
  verifiedMerchants: 3892,
  totalTransactions: 2456789,
  todayTransactions: 12456,
  totalRevenue: 48500000000, // XOF
  monthlyRevenue: 3200000000,
  gmv: 385000000000,
  monthlyGmv: 25000000000,
  fraudAlerts: 23,
  pendingKyc: 156,
  openTickets: 89,
};
