// Composable for application configuration and settings
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

import type { SharedData } from '@/types/inertia';

export function useApp() {
  const page = usePage<SharedData>();

  // App configuration
  const app = computed(() => page.props.app);
  const options = computed(() => page.props.options);

  // Individual app properties
  const appName = computed(() => app.value.name);
  const appVersion = computed(() => app.value.version);
  const appUrl = computed(() => app.value.url);
  const locale = computed(() => app.value.locale);
  const timezone = computed(() => app.value.timezone);
  const isDemo = computed(() => app.value.demo);

  // Available options
  const languages = computed(() => options.value.languages);
  const darkModes = computed(() => options.value.darkModes);
  const viewRanges = computed(() => options.value.viewRanges);

  // Helper functions
  const getLanguageName = (code: string): string => {
    return languages.value[code] ?? code;
  };

  const isValidDarkMode = (mode: string): boolean => {
    return darkModes.value.includes(mode);
  };

  const isValidViewRange = (range: string): boolean => {
    return viewRanges.value.includes(range);
  };

  return {
    // App configuration
    app,
    appName,
    appVersion,
    appUrl,
    locale,
    timezone,
    isDemo,

    // Available options
    options,
    languages,
    darkModes,
    viewRanges,

    // Helper methods
    getLanguageName,
    isValidDarkMode,
    isValidViewRange,
  };
}
