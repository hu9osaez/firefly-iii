<template>
  <aside ref="sidebarRef" class="app-sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="sidebar-header">
      <Button
        icon="pi pi-bars"
        text
        severity="secondary"
        class="sidebar-toggle"
        @click="toggleSidebar"
      />
    </div>
    <nav class="sidebar-nav">
      <PanelMenu :model="menuItems" class="sidebar-menu" />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { useMotion } from '@vueuse/motion';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import PanelMenu from 'primevue/panelmenu';
import { useAppStore } from '@/stores/appStore';
import { useAuth } from '@/composables/useAuth';

const { t } = useI18n();
const appStore = useAppStore();
const { isAdmin } = useAuth();

const isCollapsed = computed(() => !appStore.sidebarOpen);

// Sidebar menu items
const menuItems = computed(() => {
  const items = [
    {
      label: t('navigation.dashboard'),
      icon: 'pi pi-home',
      command: () => router.visit('/dashboard'),
    },
    {
      label: t('navigation.accounts'),
      icon: 'pi pi-wallet',
      items: [
        {
          label: t('accounts.all'),
          icon: 'pi pi-list',
          command: () => router.visit('/accounts'),
        },
        {
          label: t('accounts.create'),
          icon: 'pi pi-plus',
          command: () => router.visit('/accounts/create'),
        },
      ],
    },
    {
      label: t('navigation.transactions'),
      icon: 'pi pi-money-bill',
      items: [
        {
          label: t('transactions.all'),
          icon: 'pi pi-list',
          command: () => router.visit('/transactions'),
        },
        {
          label: t('transactions.create'),
          icon: 'pi pi-plus',
          command: () => router.visit('/transactions/create'),
        },
      ],
    },
    {
      label: t('navigation.budgets'),
      icon: 'pi pi-chart-pie',
      items: [
        {
          label: t('budgets.all'),
          icon: 'pi pi-list',
          command: () => router.visit('/budgets'),
        },
        {
          label: t('budgets.create'),
          icon: 'pi pi-plus',
          command: () => router.visit('/budgets/create'),
        },
      ],
    },
    {
      label: t('navigation.reports'),
      icon: 'pi pi-chart-bar',
      command: () => router.visit('/reports'),
    },
  ];

  // Add admin section if user is admin
  if (isAdmin.value) {
    items.push({
      label: t('navigation.admin'),
      icon: 'pi pi-cog',
      items: [
        {
          label: t('admin.users'),
          icon: 'pi pi-users',
          command: () => router.visit('/admin/users'),
        },
        {
          label: t('admin.settings'),
          icon: 'pi pi-cog',
          command: () => router.visit('/admin/settings'),
        },
      ],
    });
  }

  return items;
});

// Animate sidebar
const sidebarRef = ref();
// @ts-ignore - useMotion accepts template refs
useMotion(sidebarRef, {
  initial: { opacity: 0, x: -20 },
  enter: { opacity: 1, x: 0 },
});

const toggleSidebar = () => {
  appStore.toggleSidebar();
};
</script>

<style scoped>
.app-sidebar {
  width: 250px;
  background: var(--p-surface-card);
  border-right: 1px solid var(--p-surface-border);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--p-surface-border);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.sidebar-toggle {
  width: 2rem;
  height: 2rem;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.sidebar-menu {
  border: none;
}

.sidebar-collapsed .sidebar-menu :deep(.p-panelmenu-header) {
  padding: 0.5rem;
  justify-content: center;
}

.sidebar-collapsed .sidebar-menu :deep(.p-panelmenu-header-content) {
  display: none;
}
</style>
