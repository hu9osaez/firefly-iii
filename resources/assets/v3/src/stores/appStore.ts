// Main application store for Firefly III v3
import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { Notification } from '@/types/stores';
import type { SharedData } from '@/types/inertia';

export const useAppStore = defineStore('app', () => {
  // State
  const loading = ref(false);
  const sidebarOpen = ref(true);
  const notifications = ref<Notification[]>([]);
  const errors = ref<Record<string, string[]>>({});

  // Get data from Inertia shared props
  const page = usePage<SharedData>();

  // Computed properties from Inertia shared data
  const darkMode = computed(
    () => page.props.preferences?.darkMode ?? 'browser'
  );
  const language = computed(() => page.props.preferences?.language ?? 'en_US');
  const locale = computed(() => page.props.preferences?.locale ?? 'equal');
  const appName = computed(() => page.props.app.name);
  const appVersion = computed(() => page.props.app.version);
  const isDemo = computed(() => page.props.app.demo);

  // User authentication state
  const user = computed(() => page.props.auth.user);
  const isAuthenticated = computed(() => page.props.auth.check);
  const isAdmin = computed(() => user.value?.is_admin ?? false);

  // Available options
  const availableLanguages = computed(() => page.props.options.languages);
  const availableDarkModes = computed(() => page.props.options.darkModes);
  const availableViewRanges = computed(() => page.props.options.viewRanges);

  // Actions
  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  const setSidebarOpen = (value: boolean) => {
    sidebarOpen.value = value;
  };

  const addNotification = (
    notification: Omit<Notification, 'id' | 'created_at'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      timeout: notification.timeout ?? 5000,
      persistent: notification.persistent ?? false,
    };

    notifications.value.push(newNotification);

    // Auto-remove non-persistent notifications
    if (
      !newNotification.persistent &&
      newNotification.timeout &&
      newNotification.timeout > 0
    ) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.timeout);
    }
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  const setErrors = (newErrors: Record<string, string[]>) => {
    errors.value = newErrors;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  const addError = (field: string, message: string) => {
    if (!errors.value[field]) {
      errors.value[field] = [];
    }
    errors.value[field].push(message);
  };

  const removeError = (field: string) => {
    delete errors.value[field];
  };

  // Flash message handling from Inertia
  const flashMessages = computed(() => page.props.flash);

  const processFlashMessages = () => {
    const flash = flashMessages.value;

    if (flash.success) {
      addNotification({
        type: 'success',
        message: flash.success,
      });
    }

    if (flash.error) {
      addNotification({
        type: 'error',
        message: flash.error,
        persistent: true,
      });
    }

    if (flash.info) {
      addNotification({
        type: 'info',
        message: flash.info,
      });
    }

    if (flash.warning) {
      addNotification({
        type: 'warning',
        message: flash.warning,
      });
    }

    if (flash.message) {
      addNotification({
        type: 'info',
        message: flash.message,
      });
    }
  };

  // Utility functions
  const formatCurrency = (
    amount: string | number,
    currencyCode?: string
  ): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const currency = page.props.currency;

    if (!currency) {
      return numAmount.toFixed(2);
    }

    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: currencyCode || currency.code,
      minimumFractionDigits: currency.decimal_places,
      maximumFractionDigits: currency.decimal_places,
    }).format(numAmount);
  };

  const formatDate = (
    date: string | Date,
    format: 'short' | 'medium' | 'long' = 'medium'
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const optionsMap = {
      short: {
        year: '2-digit' as const,
        month: 'short' as const,
        day: 'numeric' as const,
      },
      medium: {
        year: 'numeric' as const,
        month: 'short' as const,
        day: 'numeric' as const,
      },
      long: {
        year: 'numeric' as const,
        month: 'long' as const,
        day: 'numeric' as const,
        weekday: 'long' as const,
      },
    };
    const options = optionsMap[format];

    return new Intl.DateTimeFormat(locale.value, options).format(dateObj);
  };

  return {
    // State
    loading: readonly(loading),
    sidebarOpen: readonly(sidebarOpen),
    notifications: readonly(notifications),
    errors: readonly(errors),

    // Computed from Inertia
    darkMode,
    language,
    locale,
    appName,
    appVersion,
    isDemo,
    user,
    isAuthenticated,
    isAdmin,
    availableLanguages,
    availableDarkModes,
    availableViewRanges,
    flashMessages,

    // Actions
    setLoading,
    toggleSidebar,
    setSidebarOpen,
    addNotification,
    removeNotification,
    clearNotifications,
    setErrors,
    clearErrors,
    addError,
    removeError,
    processFlashMessages,

    // Utilities
    formatCurrency,
    formatDate,
  };
});

// Export type for the store
export type AppStore = ReturnType<typeof useAppStore>;
