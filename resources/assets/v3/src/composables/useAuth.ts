// Composable for authentication and user data access
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

import type { SharedData } from '@/types/inertia';

export function useAuth() {
  const page = usePage<SharedData>();

  // Authentication state
  const isAuthenticated = computed(() => page.props.auth.check);
  const user = computed(() => page.props.auth.user);

  // User role checks
  const isAdmin = computed(() => user.value?.is_admin ?? false);
  const isDemo = computed(() => user.value?.is_demo ?? false);

  // User preferences
  const preferences = computed(() => page.props.preferences);
  const language = computed(() => preferences.value?.language ?? 'en_US');
  const darkMode = computed(() => preferences.value?.darkMode ?? 'browser');
  const listPageSize = computed(() => preferences.value?.listPageSize ?? 50);

  // Currency information
  const currency = computed(() => page.props.currency);

  // Helper functions
  const hasRole = (role: string): boolean => {
    return user.value?.roles.includes(role) ?? false;
  };

  const canAccess = (requiredRole?: string): boolean => {
    if (!isAuthenticated.value) return false;
    if (!requiredRole) return true;
    return hasRole(requiredRole);
  };

  return {
    // State
    isAuthenticated,
    user,
    preferences,
    currency,

    // Computed properties
    isAdmin,
    isDemo,
    language,
    darkMode,
    listPageSize,

    // Methods
    hasRole,
    canAccess,
  };
}
