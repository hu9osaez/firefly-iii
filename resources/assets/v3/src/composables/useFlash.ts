// Composable for flash messages handling
import { computed } from 'vue';
import { usePage } from '@inertiajs/vue3';

import type { SharedData } from '@/types/inertia';

export function useFlash() {
  const page = usePage<SharedData>();

  // Flash messages
  const flash = computed(() => page.props.flash);

  // Individual message types
  const success = computed(() => flash.value.success);
  const error = computed(() => flash.value.error);
  const info = computed(() => flash.value.info);
  const warning = computed(() => flash.value.warning);
  const message = computed(() => flash.value.message);

  // Check if any message exists
  const hasMessages = computed(() => {
    const f = flash.value;
    return !!(f.success || f.error || f.info || f.warning || f.message);
  });

  // Get all messages as an array with their types
  const allMessages = computed(() => {
    const messages: Array<{ type: string; message: string }> = [];
    const f = flash.value;

    if (f.success) messages.push({ type: 'success', message: f.success });
    if (f.error) messages.push({ type: 'error', message: f.error });
    if (f.info) messages.push({ type: 'info', message: f.info });
    if (f.warning) messages.push({ type: 'warning', message: f.warning });
    if (f.message) messages.push({ type: 'message', message: f.message });

    return messages;
  });

  return {
    // Raw flash object
    flash,

    // Individual message types
    success,
    error,
    info,
    warning,
    message,

    // Computed helpers
    hasMessages,
    allMessages,
  };
}
