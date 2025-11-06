<template>
  <nav ref="breadcrumbsRef" class="app-breadcrumbs" aria-label="Breadcrumb">
    <Breadcrumb :model="breadcrumbItems" />
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { router } from '@inertiajs/vue3';
import { useMotion } from '@vueuse/motion';
import { useI18n } from 'vue-i18n';
import { usePage } from '@inertiajs/vue3';
import Breadcrumb from 'primevue/breadcrumb';

const { t } = useI18n();
const page = usePage();

// Generate breadcrumb items from current route
const breadcrumbItems = computed(() => {
  const path = page.url;
  const segments = path.split('/').filter(Boolean);
  
  const items: Array<{ label: string; command?: () => void }> = [
    {
      label: t('navigation.dashboard'),
      command: () => router.visit('/dashboard'),
    },
  ];

  // Map segments to breadcrumb items
  segments.forEach((segment, index) => {
    const segmentPath = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    
    let label = segment;
    
    // Translate common route segments
    const translations: Record<string, string> = {
      accounts: t('navigation.accounts'),
      transactions: t('navigation.transactions'),
      budgets: t('navigation.budgets'),
      reports: t('navigation.reports'),
      admin: t('navigation.admin'),
      create: t('common.create'),
      edit: t('common.edit'),
      show: t('common.show'),
    };
    
    label = translations[segment] || segment;

    items.push({
      label,
      ...(!isLast && {
        command: () => router.visit(segmentPath),
      }),
    });
  });

  return items;
});

// Animate breadcrumbs on mount
const breadcrumbsRef = ref();
// @ts-ignore - useMotion accepts template refs
useMotion(breadcrumbsRef, {
  initial: { opacity: 0, x: -10 },
  enter: { opacity: 1, x: 0 },
  transition: { delay: 100 },
});
</script>

<style scoped>
.app-breadcrumbs {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--p-surface-border);
}

.app-breadcrumbs :deep(.p-breadcrumb) {
  border: none;
  background: transparent;
  padding: 0;
}
</style>
