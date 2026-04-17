// 项目信息
export interface Project {
  id: number;
  name: string;
  created_at: string;
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
