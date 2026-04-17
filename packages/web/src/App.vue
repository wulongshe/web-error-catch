<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus';
import { UserFilled, SwitchButton, ArrowDown } from '@element-plus/icons-vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import type { Locale } from './i18n/index.js';
import { getCurrentUser, logout } from './utils/auth.js';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();

const activeMenu = computed(() => route.path);
const elLocale = computed(() => (locale.value === 'zh' ? zhCn : en));
const isBlankLayout = computed(() => route.meta.layout === 'blank');

const user = ref(getCurrentUser());
const userDropdownOpen = ref(false);
router.afterEach(() => {
  user.value = getCurrentUser();
});

function handleMenuSelect(path: string) {
  router.push(path);
}

function toggleLocale() {
  const next: Locale = locale.value === 'zh' ? 'en' : 'zh';
  locale.value = next;
  localStorage.setItem('wec-locale', next);
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm(t('user.logout') + '?', { type: 'warning', confirmButtonText: t('user.logout'), cancelButtonText: '取消' });
    logout();
  } catch {
    // 用户取消
  }
}
</script>

<template>
  <el-config-provider :locale="elLocale">
    <template v-if="isBlankLayout">
      <router-view />
    </template>

    <div v-else class="layout">
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

          <!-- 语言切换：地球 icon + 语言文字 -->
          <el-button link class="lang-btn" @click="toggleLocale">
            <el-icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                <path d="M12 2a15.3 15.3 0 0 0 0 20" />
              </svg>
            </el-icon>
            <span class="lang-label">{{ locale === 'zh' ? '中文' : 'EN' }}</span>
          </el-button>

          <!-- 用户头像下拉 -->
          <el-dropdown v-if="user" trigger="click" @command="handleLogout" @visible-change="(v: boolean) => userDropdownOpen = v">
            <div class="user-trigger">
              <el-avatar :size="28" :src="user.avatar_url" :icon="UserFilled" />
              <span class="user-name">{{ user.name || user.login }}</span>
              <el-icon class="user-arrow" :class="{ 'is-open': userDropdownOpen }"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="SwitchButton" command="logout">{{ t('user.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
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
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
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
  --el-menu-text-color: #334155;
  --el-menu-active-color: #facc15;
  --el-menu-hover-text-color: #0f172a;
  --el-menu-hover-bg-color: rgba(0, 0, 0, 0.04);
  --el-menu-active-bg-color: transparent;
  --el-menu-bg-color: transparent;
}

.lang-btn {
  flex-shrink: 0;
  color: #475569 !important;
  gap: 4px;
}
.lang-btn:hover {
  color: #0f172a !important;
}
.lang-label {
  margin-left: 2px;
  font-size: 13px;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.user-arrow {
  color: #64748b;
  font-size: 12px;
  transition: transform 0.2s;
}
.user-arrow.is-open {
  transform: rotate(180deg);
}

.user-name {
  color: #0f172a;
  font-size: 14px;
  line-height: normal;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
}
</style>
