<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ErrorRecord } from '../types/index.js';

const props = defineProps<{ record: ErrorRecord }>();
const { t } = useI18n();

// 格式化日期时间
function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

// 将 source_context 按行分割，标注起始行号
function getSourceLines(): { lineNo: number; code: string; highlight: boolean }[] {
  if (!props.record.source_context) return [];
  const lines = props.record.source_context.split('\n');
  return lines.map((code, i) => ({
    lineNo: i + 1,
    code,
    highlight: i + 1 === props.record.source_context_line,
  }));
}
</script>

<template>
  <div class="flex flex-col gap-5 pb-6">
    <!-- 基本信息 -->
    <el-descriptions :column="1" border class="text-[13px]">
      <el-descriptions-item :label="t('stack.reportTime')">{{ formatDateTime(record.created_at) }}</el-descriptions-item>
      <el-descriptions-item :label="t('stack.project')">{{ record.project }}</el-descriptions-item>
      <el-descriptions-item label="URL">
        <a :href="record.url" target="_blank" rel="noopener">{{ record.url }}</a>
      </el-descriptions-item>
      <el-descriptions-item label="UserAgent">{{ record.user_agent }}</el-descriptions-item>
    </el-descriptions>

    <!-- 源码错误栈 -->
    <div>
      <div class="text-[13px] font-semibold text-slate-800 mb-2">{{ t('stack.sourceStack') }}</div>
      <pre class="bg-code-bg text-code-fg px-4 py-3 rounded-md overflow-auto max-h-[300px] whitespace-pre leading-[1.6] font-mono text-xs">{{ record.parsed_stack || t('stack.none') }}</pre>
    </div>

    <!-- 源码片段 -->
    <div v-if="record.source_context">
      <div class="text-[13px] font-semibold text-slate-800 mb-2">{{ t('stack.sourceContext') }}</div>
      <div class="bg-slate-50 border border-ep-border-light rounded-md overflow-auto max-h-[300px] font-mono text-xs">
        <div
          v-for="line in getSourceLines()"
          :key="line.lineNo"
          class="flex leading-[1.6] py-px"
          :class="{ 'bg-code-highlight': line.highlight }"
        >
          <span class="w-10 min-w-[40px] text-right pr-3 text-ep-text-placeholder select-none border-r border-ep-border-light mr-3">{{ line.lineNo }}</span>
          <span class="whitespace-pre flex-1">{{ line.code }}</span>
        </div>
      </div>
    </div>

    <!-- 混淆后错误栈 -->
    <div>
      <div class="text-[13px] font-semibold text-slate-800 mb-2">{{ t('stack.minifiedStack') }}</div>
      <pre class="bg-code-bg text-code-fg px-4 py-3 rounded-md overflow-auto max-h-[300px] whitespace-pre leading-[1.6] font-mono text-xs">{{ record.stack || t('stack.none') }}</pre>
    </div>
  </div>
</template>
