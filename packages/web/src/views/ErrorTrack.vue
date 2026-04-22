<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { Refresh } from '@element-plus/icons-vue';
import { getProjects, syncRepos, getErrorList } from '../api/index.js';
import type { Project, ErrorRecord } from '../types/index.js';
import StackViewer from '../components/StackViewer.vue';

const route = useRoute();
const { t } = useI18n();

// 项目列表（用于下拉）
const projects = ref<Project[]>([]);
const projectsLoading = ref(false);

// 筛选表单
const filter = reactive({
  project: '',
  url: '',
  dateRange: null as [Date, Date] | null,
});

// 分页
const pagination = reactive({
  page: 1,
  page_size: 20,
  total: 0,
});

// 表格
const tableData = ref<ErrorRecord[]>([]);
const tableLoading = ref(false);

// 抽屉
const drawerVisible = ref(false);
const activeRecord = ref<ErrorRecord | null>(null);

// 格式化日期时间：YYYY-MM-DD HH:mm:ss
function formatDateTime(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

// 构建查询参数并请求列表
async function fetchList() {
  tableLoading.value = true;
  try {
    const params: Parameters<typeof getErrorList>[0] = {
      page: pagination.page,
      page_size: pagination.page_size,
    };
    if (filter.project) params.project = filter.project;
    if (filter.url.trim()) params.url = filter.url.trim();
    if (filter.dateRange) {
      params.start_time = formatDateTime(filter.dateRange[0].getTime());
      params.end_time = formatDateTime(filter.dateRange[1].getTime());
    }
    const result = await getErrorList(params);
    tableData.value = result.list;
    pagination.total = result.total;
  } catch (e) {
    console.error('加载异常列表失败:', e);
  } finally {
    tableLoading.value = false;
  }
}

// 搜索按钮 / 回车：重置到第一页再请求
function handleSearch() {
  pagination.page = 1;
  fetchList();
}

// 重置筛选
function handleReset() {
  filter.project = '';
  filter.url = '';
  filter.dateRange = null;
  pagination.page = 1;
  fetchList();
}

// 分页切换
function handlePageChange(page: number) {
  pagination.page = page;
  fetchList();
}

function handleSizeChange(size: number) {
  pagination.page_size = size;
  pagination.page = 1;
  fetchList();
}

// 行点击打开抽屉
function handleRowClick(row: ErrorRecord) {
  activeRecord.value = row;
  drawerVisible.value = true;
}

async function loadProjects(sync = false) {
  if (projectsLoading.value) return;
  projectsLoading.value = true;
  try {
    projects.value = sync ? await syncRepos() : await getProjects();
  } catch {
    ElMessage.error(t('errorTrack.loadProjectsFail'));
  } finally {
    projectsLoading.value = false;
  }
}

onMounted(async () => {
  loadProjects();

  const qProject = route.query.project;
  if (qProject && typeof qProject === 'string') {
    filter.project = qProject;
  }

  fetchList();
});

// 监听路由 query.project 变化（从 Dashboard 图表跳转过来时）
watch(
  () => route.query.project,
  (val) => {
    if (val && typeof val === 'string') {
      filter.project = val;
      pagination.page = 1;
      fetchList();
    }
  },
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 筛选区 -->
    <el-card shadow="never" class="filter-card">
      <div class="flex items-center flex-wrap gap-3">
        <!-- 项目下拉 -->
        <div class="project-select-wrap flex items-stretch border border-ep-border rounded hover:border-ep-text-disabled focus-within:border-ep-blue transition-colors overflow-hidden">
          <el-select
            v-model="filter.project"
            :placeholder="t('errorTrack.allProjects')"
            clearable
            filterable
            :loading="projectsLoading"
            style="width: 200px"
            @change="handleSearch"
            @clear="handleSearch"
          >
            <el-option :label="t('errorTrack.all')" value="" />
            <el-option v-for="p in projects" :key="p.id" :label="p.full_name" :value="p.full_name" />
          </el-select>
          <el-button
            :icon="Refresh"
            :loading="projectsLoading"
            :title="t('errorTrack.refresh')"
            @click="loadProjects(true)"
          />
        </div>

        <!-- URL 模糊搜索 -->
        <el-input
          v-model="filter.url"
          placeholder="URL"
          clearable
          style="width: 220px"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />

        <!-- 时间范围 -->
        <el-date-picker
          v-model="filter.dateRange"
          type="datetimerange"
          format="YYYY-MM-DD HH:mm"
          :range-separator="t('errorTrack.rangeSep')"
          :start-placeholder="t('errorTrack.startTime')"
          :end-placeholder="t('errorTrack.endTime')"
          @change="handleSearch"
          @clear="handleSearch"
        />

        <div class="ml-auto flex gap-2">
          <el-button type="primary" @click="handleSearch">{{ t('errorTrack.search') }}</el-button>
          <el-button @click="handleReset">{{ t('errorTrack.reset') }}</el-button>
        </div>
      </div>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        row-key="id"
        stripe
        style="width: 100%"
        @row-click="handleRowClick"
        class="clickable-table"
      >
        <el-table-column :label="t('errorTrack.colTime')" width="170" prop="created_at">
          <template #default="{ row }">{{ formatDateTime(row.created_at) }}</template>
        </el-table-column>
        <el-table-column :label="t('errorTrack.colProject')" width="200" prop="project" show-overflow-tooltip />
        <el-table-column label="URL" min-width="160" prop="url" show-overflow-tooltip />
        <el-table-column label="UserAgent" min-width="160" prop="user_agent" show-overflow-tooltip />
        <el-table-column :label="t('errorTrack.colStack')" min-width="220">
          <template #default="{ row }">
            <span class="font-mono text-xs text-ep-text">{{ (row.parsed_stack || row.stack)?.slice(0, 100) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end p-4">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.page_size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="t('errorTrack.drawerTitle')"
      size="600px"
      direction="rtl"
      destroy-on-close
    >
      <StackViewer v-if="activeRecord" :record="activeRecord" />
    </el-drawer>
  </div>
</template>

<style scoped>
@reference "../style.css";

.filter-card :deep(.el-card__body) {
  @apply p-4;
}
.table-card :deep(.el-card__body) {
  @apply p-0;
}
.project-select-wrap :deep(.el-select__wrapper) {
  box-shadow: none !important;
  border-radius: 0;
}
.project-select-wrap :deep(.el-button) {
  @apply border-0 border-l border-solid border-ep-border rounded-none px-2.5 text-ep-text;
}
.project-select-wrap :deep(.el-button:hover) {
  @apply bg-slate-50 text-ep-blue;
}
:deep(.el-date-editor--datetimerange) {
  flex: 0 0 380px !important;
  width: 380px !important;
}
.clickable-table :deep(.el-table__row) {
  @apply cursor-pointer;
}
</style>
