<template>
  <footer ref="footerRef" class="app-footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="footer-text">
          {{ t('footer.copyright', { year: currentYear }) }}
        </span>
      </div>
      <div class="footer-right">
        <span class="footer-version">
          {{ t('footer.version', { version: appVersion }) }}
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMotion } from '@vueuse/motion';
import { useI18n } from 'vue-i18n';
import { useApp } from '@/composables/useApp';

const { t } = useI18n();
const { appVersion } = useApp();

const currentYear = computed(() => new Date().getFullYear());

// Animate footer on mount
const footerRef = ref();
// @ts-ignore - useMotion accepts template refs
useMotion(footerRef, {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
});
</script>

<style scoped>
.app-footer {
  background: var(--p-surface-card);
  border-top: 1px solid var(--p-surface-border);
  padding: 1rem;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 100%;
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
}

.footer-text {
  font-size: 0.875rem;
  color: var(--p-text-color-secondary);
}

.footer-version {
  font-size: 0.875rem;
  color: var(--p-text-color-secondary);
}
</style>
