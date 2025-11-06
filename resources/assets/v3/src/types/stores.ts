/* eslint-disable @typescript-eslint/no-explicit-any */
// Store types for Firefly III v3 Pinia stores

// Account types based on AccountTypeEnum
export type AccountType =
  | 'Asset account'
  | 'Beneficiary account'
  | 'Cash account'
  | 'Credit card'
  | 'Debt'
  | 'Default account'
  | 'Expense account'
  | 'Import account'
  | 'Initial balance account'
  | 'Liability credit account'
  | 'Loan'
  | 'Mortgage'
  | 'Reconciliation account'
  | 'Revenue account';

// Account interface
export interface Account {
  id: number;
  name: string;
  type: AccountType;
  active: boolean;
  iban?: string;
  virtual_balance?: string;
  native_virtual_balance?: string;
  current_balance?: string;
  current_balance_date?: string;
  currency_id?: number;
  currency_code?: string;
  currency_symbol?: string;
  currency_decimal_places?: number;
  user_id: number;
  user_group_id: number;
  created_at: string;
  updated_at: string;
}

// Account creation/update data
export interface AccountFormData {
  name: string;
  type: AccountType;
  active: boolean;
  iban?: string;
  virtual_balance?: string;
  currency_id?: number;
  notes?: string;
  [key: string]: any; // Allow additional properties for form data
}

// Account balance information
export interface AccountBalance {
  account_id: number;
  balance: string;
  date: string;
  currency_code: string;
  currency_symbol: string;
  currency_decimal_places: number;
}

// Transaction interface (simplified for stores)
export interface Transaction {
  id: number;
  type: 'withdrawal' | 'deposit' | 'transfer';
  description: string;
  amount: string;
  date: string;
  source_account_id?: number;
  source_account_name?: string;
  destination_account_id?: number;
  destination_account_name?: string;
  category_id?: number;
  category_name?: string;
  budget_id?: number;
  budget_name?: string;
  currency_code: string;
  currency_symbol: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Budget interface
export interface Budget {
  id: number;
  name: string;
  active: boolean;
  order: number;
  auto_budget_type?: string;
  auto_budget_amount?: string;
  auto_budget_period?: string;
  created_at: string;
  updated_at: string;
}

// Category interface
export interface Category {
  id: number;
  name: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// App Store State
export interface AppStoreState {
  loading: boolean;
  sidebarOpen: boolean;
  darkMode: 'light' | 'dark' | 'browser';
  language: string;
  locale: string;
  notifications: Notification[];
  errors: Record<string, string[]>;
}

// Accounts Store State
export interface AccountsStoreState {
  accounts: Account[];
  currentAccount: Account | null;
  loading: boolean;
  error: string | null;
  balances: Record<number, AccountBalance>;
  recentTransactions: Record<number, Transaction[]>;
}

// Notification interface
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  timeout?: number;
  persistent?: boolean;
  created_at: string;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}
