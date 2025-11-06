/* eslint-disable @typescript-eslint/no-explicit-any */
// Accounts store for Firefly III v3
import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { router } from '@inertiajs/vue3';

import type {
  Account,
  AccountFormData,
  AccountBalance,
  Transaction,
  ApiResponse,
} from '@/types/stores';
import { useAppStore } from './appStore';

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const accounts = ref<Account[]>([]);
  const currentAccount = ref<Account | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const balances = ref<Record<number, AccountBalance>>({});
  const recentTransactions = ref<Record<number, Transaction[]>>({});

  // Get app store for notifications
  const appStore = useAppStore();

  // Computed
  const assetAccounts = computed(() =>
    accounts.value.filter((account) => account.type === 'Asset account')
  );

  const expenseAccounts = computed(() =>
    accounts.value.filter((account) => account.type === 'Expense account')
  );

  const revenueAccounts = computed(() =>
    accounts.value.filter((account) => account.type === 'Revenue account')
  );

  const liabilityAccounts = computed(() =>
    accounts.value.filter((account) =>
      [
        'Debt',
        'Loan',
        'Mortgage',
        'Credit card',
        'Liability credit account',
      ].includes(account.type)
    )
  );

  const activeAccounts = computed(() =>
    accounts.value.filter((account) => account.active)
  );

  const totalBalance = computed(() => {
    return assetAccounts.value.reduce((total, account) => {
      const balance = balances.value[account.id];
      if (balance) {
        return total + parseFloat(balance.balance);
      }
      return total;
    }, 0);
  });

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value;
    appStore.setLoading(value);
  };

  const setError = (message: string | null) => {
    error.value = message;
    if (message) {
      appStore.addNotification({
        type: 'error',
        message,
        persistent: true,
      });
    }
  };

  const clearError = () => {
    error.value = null;
  };

  // Fetch all accounts
  const fetchAccounts = async (): Promise<void> => {
    try {
      setLoading(true);
      clearError();

      // Use Inertia to fetch accounts
      router.get(
        '/api/v1/accounts',
        {},
        {
          onSuccess: (page: any) => {
            const response = page.props.data as ApiResponse<Account[]>;
            accounts.value = response.data;
          },
          onError: (errors: any) => {
            setError('Failed to fetch accounts');
            console.error('Error fetching accounts:', errors);
          },
          onFinish: () => {
            setLoading(false);
          },
        }
      );
    } catch (err) {
      setError('Failed to fetch accounts');
      console.error('Error fetching accounts:', err);
      setLoading(false);
    }
  };

  // Fetch single account
  const fetchAccount = async (id: number): Promise<Account | null> => {
    try {
      setLoading(true);
      clearError();

      return new Promise((resolve, reject) => {
        router.get(
          `/api/v1/accounts/${id}`,
          {},
          {
            onSuccess: (page: any) => {
              const response = page.props.data as ApiResponse<Account>;
              const account = response.data;

              // Update the account in the list if it exists
              const index = accounts.value.findIndex(
                (a) => a.id === account.id
              );
              if (index > -1) {
                accounts.value[index] = account;
              } else {
                accounts.value.push(account);
              }

              currentAccount.value = account;
              resolve(account);
            },
            onError: (errors: any) => {
              setError(`Failed to fetch account ${id}`);
              console.error('Error fetching account:', errors);
              reject(errors);
            },
            onFinish: () => {
              setLoading(false);
            },
          }
        );
      });
    } catch (err) {
      setError(`Failed to fetch account ${id}`);
      console.error('Error fetching account:', err);
      setLoading(false);
      return null;
    }
  };

  // Create account
  const createAccount = async (
    accountData: AccountFormData
  ): Promise<Account | null> => {
    try {
      setLoading(true);
      clearError();

      return new Promise((resolve, reject) => {
        router.post('/api/v1/accounts', accountData, {
          onSuccess: (page: any) => {
            const response = page.props.data as ApiResponse<Account>;
            const newAccount = response.data;

            accounts.value.push(newAccount);
            currentAccount.value = newAccount;

            appStore.addNotification({
              type: 'success',
              message: `Account "${newAccount.name}" created successfully`,
            });

            resolve(newAccount);
          },
          onError: (errors: any) => {
            setError('Failed to create account');
            appStore.setErrors(errors);
            console.error('Error creating account:', errors);
            reject(errors);
          },
          onFinish: () => {
            setLoading(false);
          },
        });
      });
    } catch (err) {
      setError('Failed to create account');
      console.error('Error creating account:', err);
      setLoading(false);
      return null;
    }
  };

  // Update account
  const updateAccount = async (
    id: number,
    accountData: Partial<AccountFormData>
  ): Promise<Account | null> => {
    try {
      setLoading(true);
      clearError();

      return new Promise((resolve, reject) => {
        router.put(`/api/v1/accounts/${id}`, accountData, {
          onSuccess: (page: any) => {
            const response = page.props.data as ApiResponse<Account>;
            const updatedAccount = response.data;

            // Update the account in the list
            const index = accounts.value.findIndex((a) => a.id === id);
            if (index > -1) {
              accounts.value[index] = updatedAccount;
            }

            if (currentAccount.value?.id === id) {
              currentAccount.value = updatedAccount;
            }

            appStore.addNotification({
              type: 'success',
              message: `Account "${updatedAccount.name}" updated successfully`,
            });

            resolve(updatedAccount);
          },
          onError: (errors: any) => {
            setError('Failed to update account');
            appStore.setErrors(errors);
            console.error('Error updating account:', errors);
            reject(errors);
          },
          onFinish: () => {
            setLoading(false);
          },
        });
      });
    } catch (err) {
      setError('Failed to update account');
      console.error('Error updating account:', err);
      setLoading(false);
      return null;
    }
  };

  // Delete account
  const deleteAccount = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();

      return new Promise((resolve, reject) => {
        router.delete(`/api/v1/accounts/${id}`, {
          onSuccess: () => {
            // Remove from accounts list
            const index = accounts.value.findIndex((a) => a.id === id);
            if (index > -1) {
              const account = accounts.value[index];
              const accountName = account?.name || 'Unknown Account';
              accounts.value.splice(index, 1);

              appStore.addNotification({
                type: 'success',
                message: `Account "${accountName}" deleted successfully`,
              });
            }

            // Clear current account if it was deleted
            if (currentAccount.value?.id === id) {
              currentAccount.value = null;
            }

            // Clear related data
            delete balances.value[id];
            delete recentTransactions.value[id];

            resolve(true);
          },
          onError: (errors: any) => {
            setError('Failed to delete account');
            console.error('Error deleting account:', errors);
            reject(errors);
          },
          onFinish: () => {
            setLoading(false);
          },
        });
      });
    } catch (err) {
      setError('Failed to delete account');
      console.error('Error deleting account:', err);
      setLoading(false);
      return false;
    }
  };

  // Fetch account balance
  const fetchAccountBalance = async (
    id: number
  ): Promise<AccountBalance | null> => {
    try {
      router.get(
        `/api/v1/accounts/${id}/balance`,
        {},
        {
          onSuccess: (page: any) => {
            const response = page.props.data as ApiResponse<AccountBalance>;
            const balance = response.data;
            balances.value[id] = balance;
          },
          onError: (errors: any) => {
            console.error('Error fetching account balance:', errors);
          },
        }
      );

      return balances.value[id] || null;
    } catch (err) {
      console.error('Error fetching account balance:', err);
      return null;
    }
  };

  // Fetch recent transactions for account
  const fetchRecentTransactions = async (
    id: number,
    limit = 10
  ): Promise<Transaction[]> => {
    try {
      router.get(
        `/api/v1/accounts/${id}/transactions`,
        { limit },
        {
          onSuccess: (page: any) => {
            const response = page.props.data as ApiResponse<Transaction[]>;
            const transactions = response.data;
            recentTransactions.value[id] = transactions;
          },
          onError: (errors: any) => {
            console.error('Error fetching recent transactions:', errors);
          },
        }
      );

      return recentTransactions.value[id] || [];
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
      return [];
    }
  };

  // Set current account
  const setCurrentAccount = (account: Account | null) => {
    currentAccount.value = account;
  };

  // Get account by ID
  const getAccountById = (id: number): Account | undefined => {
    return accounts.value.find((account) => account.id === id);
  };

  // Reset store
  const reset = () => {
    accounts.value = [];
    currentAccount.value = null;
    loading.value = false;
    error.value = null;
    balances.value = {};
    recentTransactions.value = {};
  };

  return {
    // State
    accounts: readonly(accounts),
    currentAccount: readonly(currentAccount),
    loading: readonly(loading),
    error: readonly(error),
    balances: readonly(balances),
    recentTransactions: readonly(recentTransactions),

    // Computed
    assetAccounts,
    expenseAccounts,
    revenueAccounts,
    liabilityAccounts,
    activeAccounts,
    totalBalance,

    // Actions
    fetchAccounts,
    fetchAccount,
    createAccount,
    updateAccount,
    deleteAccount,
    fetchAccountBalance,
    fetchRecentTransactions,
    setCurrentAccount,
    getAccountById,
    reset,
    clearError,
  };
});

// Export type for the store
export type AccountsStore = ReturnType<typeof useAccountsStore>;
