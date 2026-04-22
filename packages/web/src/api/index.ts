import type { Project, ProjectStat, ErrorListParams, ErrorListResult } from '../types/index.js';
import { getToken, clearToken, clearCurrentUser } from '../utils/auth.js';

const BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 通用 fetch 封装，非 2xx 或业务 status !== 200 均 reject
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });
  if (res.status === 401) {
    clearToken();
    clearCurrentUser();
    window.location.href = '/login';
    return Promise.reject(new Error('Unauthorized'));
  }
  if (!res.ok) {
    return Promise.reject(new Error(`HTTP ${res.status}: ${url}`));
  }
  const json = await res.json();
  if (json.status !== 200) {
    return Promise.reject(new Error(`API error: ${JSON.stringify(json)}`));
  }
  return json as T;
}

// 将对象转为 query string，忽略 undefined / null / 空字符串
function toQuery(params: Record<string, string | number | undefined>): string {
  const pairs: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') {
      pairs.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
  }
  return pairs.length ? `?${pairs.join('&')}` : '';
}

// 获取项目列表（读缓存，速度快）
export async function getProjects(): Promise<Project[]> {
  const data = await request<{ status: number; list: Project[] }>(`${BASE}/projects`);
  return data.list;
}

// 从 Gitee 同步仓库列表（最新数据，耗时略长）
export async function syncRepos(): Promise<Project[]> {
  const data = await request<{ status: number; list: Project[] }>(`${BASE}/repos/sync`, { method: 'POST' });
  return data.list;
}

// 获取项目异常统计
export async function getProjectStats(params?: { start_time?: string; end_time?: string }): Promise<ProjectStat[]> {
  const qs = toQuery({ start_time: params?.start_time, end_time: params?.end_time });
  const data = await request<{ status: number; list: ProjectStat[] }>(`${BASE}/project-stats${qs}`);
  return data.list;
}

// 分页查询异常日志
export async function getErrorList(params: ErrorListParams): Promise<ErrorListResult> {
  const qs = toQuery({
    project: params.project,
    url: params.url,
    start_time: params.start_time,
    end_time: params.end_time,
    page: params.page,
    page_size: params.page_size,
  });
  const data = await request<{ status: number } & ErrorListResult>(`${BASE}/report-list${qs}`);
  return { total: data.total, page: data.page, page_size: data.page_size, list: data.list };
}

