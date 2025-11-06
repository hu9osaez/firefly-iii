/* eslint-disable @typescript-eslint/no-explicit-any */
// Inertia.js shared data types for Firefly III v3
// These types correspond to the data shared by HandleInertiaRequests middleware

export interface User {
  id: number;
  email: string;
  blocked: boolean;
  user_group_id: number;
  roles: string[];
  is_admin: boolean;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  language: string;
  locale: string;
  listPageSize: number;
  darkMode: 'light' | 'dark' | 'browser';
  customFiscalYear: boolean;
  fiscalYearStart: string;
  convertToPrimary: boolean;
  frontpageAccounts: number[];
  transactionJournalOptionalFields: Record<string, boolean>;
  viewRange: string;
}

export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  decimal_places: number;
}

export interface FlashMessages {
  message?: string;
  success?: string;
  error?: string;
  info?: string;
  warning?: string;
}

export interface AppConfig {
  name: string;
  version: string;
  url: string;
  locale: string;
  timezone: string;
  demo: boolean;
}

export interface Options {
  languages: Record<string, string>;
  darkModes: string[];
  viewRanges: string[];
}

export interface AuthData {
  user: User | null;
  check: boolean;
}

// Main Inertia shared data interface
export interface SharedData {
  auth: AuthData;
  flash: FlashMessages;
  app: AppConfig;
  preferences: UserPreferences | null;
  options: Options;
  currency: Currency | null;
  [key: string]: any; // Allow additional properties
}

// Extend Inertia's PageProps to include our shared data
declare module '@inertiajs/vue3' {
  interface PageProps extends SharedData {
    [key: string]: any; // Allow additional properties
  }
}
