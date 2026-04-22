// 项目信息（来自 Gitee 仓库同步）
export interface Project {
  id: number;
  user_id: number;
  gitee_repo_id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: 0 | 1;
  html_url: string;
  synced_at: number;
}

// 登录用户信息
export interface User {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

// 项目异常统计
export interface ProjectStat {
  project: string;
  count: number;
}

// 异常日志记录
export interface ErrorRecord {
  id: number;
  project: string;
  stack: string;
  parsed_stack: string;
  user_agent: string;
  url: string;
  source_context: string;
  source_context_line: number;
  created_at: number;
}

// 分页查询参数
export interface ErrorListParams {
  project?: string;
  url?: string;
  start_time?: string;
  end_time?: string;
  page?: number;
  page_size?: number;
}

// 分页查询结果
export interface ErrorListResult {
  total: number;
  page: number;
  page_size: number;
  list: ErrorRecord[];
}
