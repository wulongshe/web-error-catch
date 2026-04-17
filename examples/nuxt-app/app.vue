<template>
  <div style="padding: 2rem; font-family: sans-serif">
    <h1>DT-WEC Nuxt 示例</h1>
    <p>点击按钮触发不同类型的错误，观察 <code>http://127.0.0.1:8000/report</code> 是否收到上报。</p>
    <div style="display: flex; gap: 1rem; margin-top: 1rem">
      <button @click="triggerSync">同步错误</button>
      <button @click="triggerAsync">Promise 未捕获</button>
      <button @click="triggerNitro">Nitro 服务端错误</button>
    </div>
    <p v-if="nitroResult" style="margin-top: 1rem; color: red">{{ nitroResult }}</p>
  </div>
</template>

<script setup lang="ts">
const nitroResult = ref('');

function triggerSync() {
  throw new Error('custom sync error - web-error-catch test');
}

function triggerAsync() {
  Promise.reject(new Error('custom async rejection - web-error-catch test'));
}

async function triggerNitro() {
  try {
    await $fetch('/api/boom');
  } catch (e: any) {
    nitroResult.value = `Nitro 错误已触发: ${e.message}`;
  }
}
</script>
