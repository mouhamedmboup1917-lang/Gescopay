// ===== CORE ENTITY TYPES =====

export type UserRole = 'user' | 'merchant' | 'admin';
export type KycStatus = 'pending' | 'submitted' | 'verified' | 'rejected';
export type WalletProvider = 'wave' | 'orange_money' | 'free_money' | 'qmoney' | 'africell_money' | 'airtel_money' | 'mtn_momo';
export type Currency = 'XOF' | 'USD' | 'EUR' | 'GHS' | 'NGN' | 'KES' | 'RWF';
export type TransactionType = 'send' | 'receive' | 'payment' | 'top_up' | 'withdrawal' | 'refund' | 'fee';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
export type CardStatus = 'active' | 'frozen' | 'expired' | 'cancelled';
export type SettlementStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
export type MerchantType = 'individual' | 'business';
export type QRType = 'static' | 'dynamic';
export type NotificationChannel = 'push' | 'email' | 'sms' | 'in_app';
export type SupportTicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

// ===== USER =====

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  avatar?: string;
  role: UserRole;
  kycStatus: KycStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBiometricsEnabled: boolean;
  isPinEnabled: boolean;
  twoFactorEnabled: boolean;
  preferredCurrency: Currency;
  language: 'en' | 'fr';
  createdAt: string;
  lastLoginAt: string;
}

// ===== WALLET =====

export interface WalletProviderInfo {
  id: WalletProvider;
  name: string;
  shortName: string;
  color: string;
  gradientColors: string[];
  logo: string;
  country: string[];
  isAvailable: boolean;
}

export interface Wallet {
  id: string;
  userId: string;
  provider: WalletProvider;
  providerInfo: WalletProviderInfo;
  phoneNumber: string;
  alias: string;
  balance: number;
  currency: Currency;
  isDefault: boolean;
  isActive: boolean;
  lastSyncAt: string;
  createdAt: string;
}

// ===== TRANSACTION =====

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  fee: number;
  currency: Currency;
  fromWallet?: string;
  toWallet?: string;
  merchantId?: string;
  merchantName?: string;
  merchantLogo?: string;
  description: string;
  reference: string;
  qrId?: string;
  invoiceId?: string;
  metadata?: Record<string, string>;
  createdAt: string;
  completedAt?: string;
}

// ===== VIRTUAL CARD =====

export interface VirtualCard {
  id: string;
  userId: string;
  cardNumber: string;
  maskedNumber: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  status: CardStatus;
  spendingLimit?: number;
  spentAmount: number;
  linkedWalletId: string;
  currency: Currency;
  createdAt: string;
  frozenAt?: string;
}

// ===== QR CODE =====

export interface QRCode {
  id: string;
  userId: string;
  merchantId?: string;
  type: QRType;
  amount?: number;
  currency?: Currency;
  description?: string;
  data: string;
  isActive: boolean;
  scansCount: number;
  expiresAt?: string;
  createdAt: string;
}

// ===== MERCHANT =====

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  merchantType: MerchantType;
  registrationNumber?: string;
  taxNumber?: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  isVerified: boolean;
  isActive: boolean;
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  transactionCount: number;
  createdAt: string;
}

// ===== INVOICE =====

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

export interface Invoice {
  id: string;
  merchantId: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  total: number;
  currency: Currency;
  dueDate: string;
  paidAt?: string;
  notes?: string;
  qrCodeId?: string;
  paymentLink?: string;
  createdAt: string;
}

// ===== SETTLEMENT =====

export interface Settlement {
  id: string;
  merchantId: string;
  amount: number;
  fee: number;
  netAmount: number;
  currency: Currency;
  status: SettlementStatus;
  destinationType: 'bank' | 'wallet';
  destinationDetails: {
    bankName?: string;
    accountNumber?: string;
    walletProvider?: WalletProvider;
    walletPhone?: string;
  };
  reference: string;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  transactions: string[];
}

// ===== NOTIFICATION =====

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'transaction' | 'security' | 'promotion' | 'system';
  channel: NotificationChannel;
  isRead: boolean;
  data?: Record<string, string>;
  createdAt: string;
}

// ===== SUPPORT =====

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// ===== ANALYTICS =====

export interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface RevenueDataPoint {
  date: string;
  amount: number;
  label: string;
}

export interface DashboardMetrics {
  totalBalance: number;
  monthlySpend: number;
  monthlyReceived: number;
  pendingTransactions: number;
  currency: Currency;
}

export interface MerchantDashboardMetrics {
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalRevenue: number;
  pendingSettlements: number;
  transactionCount: number;
  averageOrderValue: number;
  growthRate: number;
}

// ===== AUTH =====

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isPinVerified: boolean;
  isBiometricVerified: boolean;
}

export interface LoginCredentials {
  identifier: string; // email or phone
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  country: string;
}

export interface OTPVerification {
  identifier: string;
  otp: string;
  purpose: 'login' | 'register' | 'transaction' | 'pin_reset';
}

// ===== API RESPONSES =====

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

// ===== UI STATE =====

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'fr';
