<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

function handleLogin() {
  window.location.href = '/auth/gitee';
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card" shadow="always">
      <div class="login-body">
        <img src="/favicon.svg" class="login-logo" alt="logo" />
        <h1 class="login-title">Frontend Monitor</h1>
        <p class="login-subtitle">{{ t('login.subtitle') }}</p>
        <el-button type="primary" size="large" class="gitee-btn" @click="handleLogin">
          {{ t('login.giteeBtn') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 380px;
  border-radius: 12px;
}

.login-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 16px;
}

.login-logo {
  width: 56px;
  height: 56px;
}

.login-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.login-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.gitee-btn {
  width: 100%;
  margin-top: 8px;
}
</style>
