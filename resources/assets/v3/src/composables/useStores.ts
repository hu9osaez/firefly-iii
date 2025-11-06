// Composable for easy access to all Pinia stores
import { useAppStore, useAccountsStore } from '@/stores';

export function useStores() {
  const appStore = useAppStore();
  const accountsStore = useAccountsStore();

  return {
    app: appStore,
    accounts: accountsStore,
  };
}

// Individual store composables for convenience
export function useApp() {
  return useAppStore();
}

export function useAccounts() {
  return useAccountsStore();
}
