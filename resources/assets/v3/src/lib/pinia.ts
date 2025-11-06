// Pinia configuration for Firefly III v3
import { createPinia } from 'pinia';

// Create pinia instance
export const pinia = createPinia();

// Plugin for persistence (optional - can be added later)
// For now, we'll rely on Inertia shared data for state hydration

export default pinia;
