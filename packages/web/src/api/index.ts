import type { Project, ProjectStat, ErrorListParams, ErrorListResult } from '../types/index.js';

const BASE = '/api';

// 通用 fetch 封装，非 2xx 或业务 status !== 200 均 reject
async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
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

// 获取项目列表
export async function getProjects(): Promise<Project[]> {
  const data = await request<{ status: number; list: Project[] }>(`${BASE}/projects`);
  return data.list;
}

// 获取项目异常统计（start_time / end_time 可选，格式为 ISO 字符串或时间戳字符串）
export async function getProjectStats(params?: { start_time?: string; end_time?: string }): Promise<ProjectStat[]> {
  const qs = toQuery({ start_time: params?.start_time, end_time: params?.end_time });
  const data = await request<{ status: number; list: ProjectStat[] }>(`${BASE}/project-stats${qs}`);
  return data.list;
}

// 分页查询异常日志
export async function getErrorList(params: ErrorListParams): Promise<ErrorListResult> {
  const qs = toQuery({
    project: params.project,
    start_time: params.start_time,
    end_time: params.end_time,
    page: params.page,
    page_size: params.page_size,
  });
  const data = await request<{ status: number } & ErrorListResult>(`${BASE}/report-list${qs}`);
  return { total: data.total, page: data.page, page_size: data.page_size, list: data.list };
}
