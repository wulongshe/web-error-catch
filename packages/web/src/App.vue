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

    <div v-else class="min-h-screen flex flex-col">
      <header class="bg-white border-b border-slate-200 sticky top-0 z-[100]">
        <div class="max-w-[1400px] mx-auto px-6 flex items-center gap-4 h-16">
          <span class="flex items-center gap-2 text-base font-semibold text-brand whitespace-nowrap">
            <img src="/favicon.svg" class="w-7 h-7 shrink-0" alt="logo" />
            Frontend Monitor
          </span>
          <el-menu
            mode="horizontal"
            :default-active="activeMenu"
            :ellipsis="false"
            @select="handleMenuSelect"
            class="nav-menu"
          >
            <el-menu-item index="/dashboard">{{ t('nav.dashboard') }}</el-menu-item>
            <el-menu-item index="/errors">{{ t('nav.errorTracking') }}</el-menu-item>
          </el-menu>

          <!-- 语言切换：地球 icon + 语言文字 -->
          <el-button link class="shrink-0 !text-slate-600 hover:!text-brand !gap-1" @click="toggleLocale">
            <el-icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                <path d="M12 2a15.3 15.3 0 0 0 0 20" />
              </svg>
            </el-icon>
            <span class="ml-0.5 text-[13px]">{{ locale === 'zh' ? '中文' : 'EN' }}</span>
          </el-button>

          <!-- 用户头像下拉 -->
          <el-dropdown v-if="user" trigger="click" @command="handleLogout" @visible-change="(v: boolean) => userDropdownOpen = v">
            <div class="flex items-center gap-1.5 cursor-pointer shrink-0">
              <el-avatar :size="28" :src="user.avatar_url" :icon="UserFilled" />
              <span class="text-brand text-sm max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">{{ user.name || user.login }}</span>
              <el-icon
                class="text-slate-500 text-xs transition-transform duration-200"
                :class="{ 'rotate-180': userDropdownOpen }"
              ><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="SwitchButton" command="logout">{{ t('user.logout') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <main class="flex-1 p-6 max-w-[1400px] w-full mx-auto">
        <router-view />
      </main>
    </div>
  </el-config-provider>
</template>

<style scoped>
/* Element Plus 菜单 CSS 变量定制 —— 无对应工具类 */
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
</style>
