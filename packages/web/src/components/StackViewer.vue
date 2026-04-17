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
  <div class="stack-viewer">
    <!-- 基本信息 -->
    <el-descriptions :column="1" border class="meta-desc">
      <el-descriptions-item :label="t('stack.reportTime')">{{ formatDateTime(record.created_at) }}</el-descriptions-item>
      <el-descriptions-item :label="t('stack.project')">{{ record.project }}</el-descriptions-item>
      <el-descriptions-item label="URL">
        <a :href="record.url" target="_blank" rel="noopener">{{ record.url }}</a>
      </el-descriptions-item>
      <el-descriptions-item label="UserAgent">{{ record.user_agent }}</el-descriptions-item>
    </el-descriptions>

    <!-- 解析后的 Stack -->
    <div class="section">
      <div class="section-title">{{ t('stack.parsedStack') }}</div>
      <pre class="parsed-stack mono">{{ record.parsed_stack || t('stack.none') }}</pre>
    </div>

    <!-- 源码片段 -->
    <div v-if="record.source_context" class="section">
      <div class="section-title">{{ t('stack.sourceContext') }}</div>
      <div class="source-context mono">
        <div
          v-for="line in getSourceLines()"
          :key="line.lineNo"
          class="source-line"
          :class="{ highlight: line.highlight }"
        >
          <span class="line-no">{{ line.lineNo }}</span>
          <span class="line-code">{{ line.code }}</span>
        </div>
      </div>
    </div>

    <!-- 混淆后 Stack -->
    <div class="section">
      <div class="section-title">{{ t('stack.minifiedStack') }}</div>
      <pre class="raw-stack mono">{{ record.stack || t('stack.none') }}</pre>
    </div>
  </div>
</template>

<style scoped>
.stack-viewer {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 24px;
}

.meta-desc {
  font-size: 13px;
}

.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

/* 等宽字体 */
.mono {
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace;
  font-size: 12px;
}

.parsed-stack {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px 16px;
  border-radius: 6px;
  overflow: auto;
  max-height: 300px;
  white-space: pre;
  line-height: 1.6;
}

.source-context {
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: auto;
  max-height: 300px;
}

.source-line {
  display: flex;
  line-height: 1.6;
  padding: 1px 0;
}

.source-line.highlight {
  background: #fffacd;
}

.line-no {
  width: 40px;
  min-width: 40px;
  text-align: right;
  padding-right: 12px;
  color: #909399;
  user-select: none;
  border-right: 1px solid #e4e7ed;
  margin-right: 12px;
}

.line-code {
  white-space: pre;
  flex: 1;
}

.raw-stack {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px 16px;
  border-radius: 6px;
  overflow: auto;
  max-height: 300px;
  white-space: pre;
  line-height: 1.6;
}
</style>
