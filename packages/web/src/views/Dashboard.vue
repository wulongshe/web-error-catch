<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getProjects, getProjectStats } from '../api/index.js';
import type { ProjectStat } from '../types/index.js';
import type { EChartsOption } from 'echarts';

const router = useRouter();
const { t } = useI18n();

// 加载状态
const loading = ref(true);

// 统计卡片数据
const totalProjects = ref(0);
const monthlyTotal = ref(0);
const todayTotal = ref(0);
const allTotal = ref(0);

// 近一月各项目原始数据（用于图表）
const chartData = ref<ProjectStat[]>([]);

// 图表配置（computed，语言切换时自动响应）
const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: chartData.value.map((s) => s.project),
    axisLabel: { rotate: 30 },
  },
  yAxis: { type: 'value', minInterval: 1 },
  series: [
    {
      name: t('dashboard.seriesName'),
      type: 'bar',
      data: chartData.value.map((s) => s.count),
      itemStyle: { color: '#409eff' },
    },
  ],
}));

// 格式化为 ISO 字符串（后端接受的格式）
function toISOStr(date: Date): string {
  return date.toISOString();
}

// 获取 N 天前的 Date
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// 获取今天 0 点
function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

async function fetchData() {
  loading.value = true;
  try {
    const now = new Date();
    const monthAgo = daysAgo(30);
    const dayStart = todayStart();

    // 并行拉取所有数据
    const [projects, monthStats, todayStats, allStats] = await Promise.all([
      getProjects(),
      getProjectStats({ start_time: toISOStr(monthAgo), end_time: toISOStr(now) }),
      getProjectStats({ start_time: toISOStr(dayStart), end_time: toISOStr(now) }),
      getProjectStats(),
    ]);

    totalProjects.value = projects.length;
    monthlyTotal.value = monthStats.reduce((sum, item) => sum + item.count, 0);
    todayTotal.value = todayStats.reduce((sum, item) => sum + item.count, 0);
    allTotal.value = allStats.reduce((sum, item) => sum + item.count, 0);
    chartData.value = monthStats;
  } catch (e) {
    console.error('Dashboard 数据加载失败:', e);
  } finally {
    loading.value = false;
  }
}

// 图表柱条点击：跳转到异常追踪并带上项目筛选
function onChartClick(params: { name: string }) {
  router.push({ path: '/errors', query: { project: params.name } });
}

onMounted(fetchData);
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- 统计卡片区 -->
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card shadow="hover">
          <div v-if="loading" class="py-2">
            <el-skeleton :rows="1" animated />
          </div>
          <div v-else class="text-center py-2">
            <div class="text-[13px] text-ep-text-placeholder mb-2">{{ t('dashboard.totalProjects') }}</div>
            <div class="text-[32px] font-bold text-slate-800">{{ totalProjects }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div v-if="loading" class="py-2">
            <el-skeleton :rows="1" animated />
          </div>
          <div v-else class="text-center py-2">
            <div class="text-[13px] text-ep-text-placeholder mb-2">{{ t('dashboard.monthlyErrors') }}</div>
            <div class="text-[32px] font-bold text-slate-800">{{ monthlyTotal }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div v-if="loading" class="py-2">
            <el-skeleton :rows="1" animated />
          </div>
          <div v-else class="text-center py-2">
            <div class="text-[13px] text-ep-text-placeholder mb-2">{{ t('dashboard.todayErrors') }}</div>
            <div class="text-[32px] font-bold text-slate-800">{{ todayTotal }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div v-if="loading" class="py-2">
            <el-skeleton :rows="1" animated />
          </div>
          <div v-else class="text-center py-2">
            <div class="text-[13px] text-ep-text-placeholder mb-2">{{ t('dashboard.totalErrors') }}</div>
            <div class="text-[32px] font-bold text-slate-800">{{ allTotal }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 柱状图 -->
    <el-card shadow="never" class="flex-1">
      <template #header>
        <span>{{ t('dashboard.chartTitle') }}</span>
      </template>
      <div v-if="loading" class="h-[340px] py-4">
        <el-skeleton :rows="6" animated />
      </div>
      <div v-else class="h-[340px]">
        <v-chart
          class="w-full h-full"
          :option="chartOption"
          autoresize
          @click="onChartClick"
        />
      </div>
    </el-card>
  </div>
</template>
