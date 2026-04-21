<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

function handleLogin() {
  window.location.href = '/auth/gitee';
}
</script>

<template>
  <div class="min-h-screen bg-brand flex items-center justify-center">
    <el-card class="w-[380px] rounded-xl" shadow="always">
      <div class="flex flex-col items-center gap-4 py-6 px-4">
        <img src="/favicon.svg" class="w-14 h-14" alt="logo" />
        <h1 class="text-[22px] font-bold text-brand">Frontend Monitor</h1>
        <p class="text-slate-500 text-sm">{{ t('login.subtitle') }}</p>
        <el-button type="primary" size="large" class="!w-full !mt-2" @click="handleLogin">
          {{ t('login.giteeBtn') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>
