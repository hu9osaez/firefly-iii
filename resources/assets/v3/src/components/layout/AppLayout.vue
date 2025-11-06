<template>
  <div class="app-layout">
    <AppHeader />
    <div class="layout-container">
      <AppSidebar />
      <main class="main-content">
        <AppBreadcrumbs v-if="showBreadcrumbs" />
        <slot />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';
import AppFooter from './AppFooter.vue';
import AppBreadcrumbs from './AppBreadcrumbs.vue';

// Props
interface Props {
  showBreadcrumbs?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showBreadcrumbs: true,
});

// Get page data from Inertia
const page = usePage();
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-container {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  overflow-y: auto;
}
</style>
