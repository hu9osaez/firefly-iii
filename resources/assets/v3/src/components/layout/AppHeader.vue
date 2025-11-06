<template>
  <header ref="headerRef" class="app-header">
    <Menubar :model="menuItems" class="header-menubar">
      <template #start>
        <div class="header-logo">
          <span class="logo-text">{{ appName }}</span>
        </div>
      </template>
      <template #end>
        <div class="header-actions">
          <Button
            icon="pi pi-bell"
            text
            severity="secondary"
            aria-label="Notifications"
            @click="toggleNotifications"
          />
          <Button
            icon="pi pi-cog"
            text
            severity="secondary"
            aria-label="Settings"
            @click="goToSettings"
          />
          <Menu
            ref="userMenu"
            :model="userMenuItems"
            popup
            class="user-menu"
          >
            <template #start>
              <div class="user-info">
                <span class="user-email">{{ user?.email }}</span>
              </div>
            </template>
          </Menu>
          <Button
            icon="pi pi-user"
            text
            severity="secondary"
            aria-label="User menu"
            @click="toggleUserMenu"
          />
        </div>
      </template>
    </Menubar>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import { useMotion } from '@vueuse/motion';
import { useI18n } from 'vue-i18n';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { useAuth } from '@/composables/useAuth';
import { useApp } from '@/composables/useApp';

const { t } = useI18n();
const { user } = useAuth();
const { appName } = useApp();

const userMenu = ref();

// Menu items for navigation
const menuItems = computed(() => [
  {
    label: t('navigation.dashboard'),
    icon: 'pi pi-home',
    command: () => router.visit('/dashboard'),
  },
  {
    label: t('navigation.accounts'),
    icon: 'pi pi-wallet',
    command: () => router.visit('/accounts'),
  },
  {
    label: t('navigation.transactions'),
    icon: 'pi pi-money-bill',
    command: () => router.visit('/transactions'),
  },
  {
    label: t('navigation.budgets'),
    icon: 'pi pi-chart-pie',
    command: () => router.visit('/budgets'),
  },
  {
    label: t('navigation.reports'),
    icon: 'pi pi-chart-bar',
    command: () => router.visit('/reports'),
  },
]);

// User menu items
const userMenuItems = computed(() => [
  {
    label: t('user.profile'),
    icon: 'pi pi-user',
    command: () => router.visit('/profile'),
  },
  {
    label: t('user.preferences'),
    icon: 'pi pi-cog',
    command: () => router.visit('/preferences'),
  },
  {
    separator: true,
  },
  {
    label: t('user.logout'),
    icon: 'pi pi-sign-out',
    command: () => router.post('/logout'),
  },
]);

// Animate header on mount
const headerRef = ref();
// @ts-ignore - useMotion accepts template refs
useMotion(headerRef, {
  initial: { opacity: 0, y: -20 },
  enter: { opacity: 1, y: 0 },
});

const toggleUserMenu = (event: Event) => {
  userMenu.value?.toggle(event);
};

const toggleNotifications = () => {
  // TODO: Implement notifications panel
  console.log('Toggle notifications');
};

const goToSettings = () => {
  router.visit('/preferences');
};
</script>

<style scoped>
.app-header {
  background: var(--p-surface-card);
  border-bottom: 1px solid var(--p-surface-border);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-menubar {
  border: none;
  border-radius: 0;
  padding: 0.75rem 1rem;
}

.header-logo {
  display: flex;
  align-items: center;
  margin-right: 2rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--p-primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-info {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--p-surface-border);
}

.user-email {
  font-size: 0.875rem;
  color: var(--p-text-color-secondary);
}
</style>
