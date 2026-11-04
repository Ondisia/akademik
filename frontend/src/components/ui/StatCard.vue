<template>
  <div class="card stat-card" :class="`card-accent-${variant}`">
    <div class="stat-card-content">
      <span class="stat-label">{{ title }}</span>
      <h3 class="stat-value">{{ value }}</h3>
      <p class="stat-trend" v-if="trend">
        <TrendingUp :size="14" class="trend-icon" /> {{ trend }}
      </p>
    </div>
    <div class="stat-icon-wrapper" :class="`icon-bg-${variant}`">
      <slot name="icon" />
    </div>
  </div>
</template>

<script setup>
import { TrendingUp } from "lucide-vue-next";

defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  trend: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "primary",
    validator: (v) =>
      ["primary", "success", "warning", "danger", "info"].includes(v),
  },
});
</script>

<style scoped>
.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-left: 4px solid transparent;
}

.card-accent-primary {
  border-left-color: var(--color-primary-500);
}
.card-accent-success {
  border-left-color: var(--color-success);
}
.card-accent-warning {
  border-left-color: var(--color-warning);
}
.card-accent-danger {
  border-left-color: var(--color-danger);
}
.card-accent-info {
  border-left-color: var(--color-info);
}

.stat-card-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.stat-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-neutral-800);
  line-height: 1.1;
}

.stat-trend {
  font-size: var(--font-size-xs);
  color: var(--color-neutral-400);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-bg-primary {
  background-color: var(--color-primary-50);
  color: var(--color-primary-600);
}
.icon-bg-success {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}
.icon-bg-warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}
.icon-bg-danger {
  background-color: var(--color-danger-light);
  color: var(--color-danger-dark);
}
.icon-bg-info {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
}
</style>
