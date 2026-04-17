<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import type { Locale } from './i18n/index.js';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const activeMenu = computed(() => route.path);
const elLocale = computed(() => (locale.value === 'zh' ? zhCn : en));

function handleMenuSelect(path: string) {
  router.push(path);
}

const localeOptions = [
  { label: '中文', value: 'zh' },
  { label: 'English', value: 'en' },
];

function handleLocaleChange(val: Locale) {
  locale.value = val;
  localStorage.setItem('wec-locale', val);
}
</script>

<template>
  <el-config-provider :locale="elLocale">
    <div class="layout">
      <header class="header">
        <div class="header-inner">
          <span class="logo">
            <img src="/favicon.svg" class="logo-icon" alt="logo" />
            Frontend Monitor
          </span>
          <el-menu
            mode="horizontal"
            :default-active="activeMenu"
            :ellipsis="false"
            @select="handleMenuSelect"
            class="nav-menu"
          >
            <el-menu-item index="/">{{ t('nav.dashboard') }}</el-menu-item>
            <el-menu-item index="/errors">{{ t('nav.errorTracking') }}</el-menu-item>
          </el-menu>
          <el-select
            :model-value="locale"
            class="lang-select"
            style="width: 100px"
            @change="handleLocaleChange"
          >
            <el-option v-for="opt in localeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </div>
      </header>
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </el-config-provider>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #0f172a;
  border-bottom: none;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #f8fafc;
  white-space: nowrap;
}

.logo-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.nav-menu {
  border-bottom: none;
  flex: 1;
  background: transparent;
  --el-menu-text-color: #ffffff;
  --el-menu-active-color: #facc15;
  --el-menu-hover-text-color: #f8fafc;
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.06);
  --el-menu-active-bg-color: transparent;
  --el-menu-bg-color: transparent;
}

.lang-select {
  flex-shrink: 0;
  --el-select-border-color-hover: #facc15;
  --el-input-border-color: rgba(255, 255, 255, 0.35);
  --el-input-bg-color: transparent;
  --el-input-text-color: #f8fafc;
  --el-fill-color-blank: transparent;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}
</style>
