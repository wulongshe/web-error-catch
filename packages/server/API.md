# 前端 API 对接文档

## 概览

本文档描述服务器所有可用接口。分为**公开接口**（无需认证）和**需认证接口**（需 JWT Token）。

---

## 认证说明

### 登录流程

```
用户流程
1. 前端按钮 → "用 Gitee 登录"
   └─> GET /auth/gitee （服务器返回 302 重定向）

2. 浏览器跳转至 Gitee 授权页
   └─> 用户输入账密，确认授权

3. Gitee 回调服务器
   └─> GET /auth/gitee/callback?code=xxx

4. 服务器重定向回前端首页
   └─> 302 → /?token=JWT...&user=%7B...%7D

5. 前端解析 URL 参数，保存 Token
   └─> const params = new URLSearchParams(location.search)
       localStorage.setItem('token', params.get('token'))
       localStorage.setItem('user', params.get('user'))

6. 后续 API 请求
   └─> 在 Authorization header 中附加 token
       fetch('/projects', {
         headers: { Authorization: 'Bearer ' + token }
       })
```

### Token 信息

- **类型**：JWT
- **有效期**：7 天（可在 .env 配置）
- **传递方式**：`Authorization: Bearer <token>`
- **过期处理**：返回 401，需重新登录

---

## 公开接口（无需认证）

### 1. 跳转 Gitee 登录

```
GET /auth/gitee
```

**说明**：重定向至 Gitee OAuth 授权页面

**响应**：302 重定向，Location 为 Gitee 授权 URL

**前端调用**：
```javascript
window.location.href = '/auth/gitee';
// 或
window.location.href = 'http://localhost:8080/auth/gitee';
```

---

### 2. OAuth 回调处理

```
GET /auth/gitee/callback?code=xxx
```

**说明**：Gitee 授权完成后的回调端点（由 Gitee 自动调用，无需前端手动请求）。服务器完成 Token 换取后，302 重定向回前端首页并附带登录信息。

**响应**：302 重定向至前端首页

```
Location: http://localhost:5173/?token=eyJhbGci...&user=%7B%22id%22%3A1%2C...%7D
```

**前端处理**（在首页/路由入口处）：
```javascript
// 检测 URL 中是否携带 token（OAuth 回调后）
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
const user = params.get('user');

if (token) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', user);
  // 清除 URL 参数，避免刷新重复处理
  window.history.replaceState({}, '', window.location.pathname);
}
```

---

### 3. 上报前端异常

#### GET 方式
```
GET /report?project=<project>&stack=<stack>&context_lines=<lines>
```

#### POST 方式
```
POST /report
Content-Type: application/json

{
  "project": "web-app",
  "stack": "Error: xxx\n  at func (file.js:10:5)\n...",
  "context_lines": 5
}
```

**参数说明**：
| 参数 | 类型 | 必须 | 说明 |
|------|------|------|------|
| project | string | ✓ | 项目名称 |
| stack | string | ✓ | 错误堆栈（通常来自 Error.stack） |
| context_lines | number | | 提取源代码上下文的行数（默认 3） |

**响应示例**：
```json
{ "status": 200, "message": "success" }
```

**常见错误**：
```json
{ "status": 400, "message": "Missing parameter: project" }
```

**SDK 集成示例**：
```javascript
window.addEventListener('error', (event) => {
  navigator.sendBeacon('/report', JSON.stringify({
    project: 'my-app',
    stack: event.error?.stack || 'Unknown error',
  }));
});
```

---

### 4. 上传 Source Map 文件

```
POST /upload?project=<project>&timestamp=<timestamp>
Content-Type: multipart/form-data

file: (上传文件，支持多个)
```

**参数说明**：
| 参数 | 类型 | 位置 | 必须 | 说明 |
|------|------|------|------|------|
| project | string | query | ✓ | 项目名称 |
| timestamp | number | query | ✓ | 时间戳（毫秒，用于版本控制） |
| file | File[] | body | ✓ | 文件列表（multipart） |

**响应示例**：
```json
{
  "status": 200,
  "message": "success",
  "count": 2
}
```

**前端上传示例**：
```javascript
const formData = new FormData();
formData.append('file', mapFile1);
formData.append('file', mapFile2);

fetch(`/upload?project=my-app&timestamp=${Date.now()}`, {
  method: 'POST',
  body: formData
});
```

**自动清理**：服务器自动保留每个项目最近 3 次上传的文件

---

## 需认证接口（需 Bearer Token）

所有以下接口都需在 Header 中添加：
```
Authorization: Bearer <token>
```

### 1. 获取本地仓库列表

```
GET /projects
```

**说明**：直接读取数据库中已缓存的仓库列表，速度快，不请求 Gitee

**响应示例**：
```json
{
  "status": 200,
  "total": 12,
  "list": [
    {
      "id": 1,
      "user_id": 1,
      "gitee_repo_id": 123456789,
      "name": "web-error-catch",
      "full_name": "shewulong/web-error-catch",
      "description": "前端错误监控系统",
      "private": 0,
      "html_url": "https://gitee.com/shewulong/web-error-catch",
      "synced_at": 1713200000000
    }
  ]
}
```

**前端获取示例**：
```javascript
const token = localStorage.getItem('token');
const response = await fetch('/projects', {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
```

---

### 2. 从 Gitee 同步仓库列表

```
POST /repos/sync
```

**说明**：从 Gitee API 拉取最新仓库列表，保存到数据库后返回。数据始终最新，但耗时略长

**响应示例**：同 `/projects`

**字段说明**：
| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 本地数据库 ID |
| user_id | number | 关联用户 ID |
| gitee_repo_id | number | Gitee 仓库 ID |
| name | string | 仓库名称（短名） |
| full_name | string | 仓库全名（owner/repo） |
| description | string\|null | 仓库描述 |
| private | 0\|1 | 是否私有（1=私有） |
| html_url | string | Gitee 仓库网址 |
| synced_at | number | 最后同步时间戳 |

**前端使用建议**：进入页面时调用 `POST /repos/sync` 同步一次，后续翻页或筛选调用 `GET /projects` 读缓存

---

### 2. 分页查询异常日志

```
GET /report-list?project=<project>&start_time=<date>&end_time=<date>&page=<num>&page_size=<num>
```

**参数说明**：
| 参数 | 类型 | 必须 | 说明 | 默认值 |
|------|------|------|------|--------|
| project | string | | 项目名称（模糊匹配） | 无 |
| start_time | string | | ISO 8601 日期 | 无 |
| end_time | string | | ISO 8601 日期 | 无 |
| page | number | | 页码 | 1 |
| page_size | number | | 每页数量 | 20 |

**响应示例**：
```json
{
  "status": 200,
  "total": 256,
  "page": 1,
  "page_size": 20,
  "list": [
    {
      "id": 1,
      "project": "my-app",
      "stack": "Error: Cannot read property 'xxx' of undefined\n    at handleClick (app.js:42:15)",
      "parsed_stack": "Error: Cannot read property 'xxx' of undefined\n    at handleClick (src/components/Button.jsx:42:15)",
      "created_at": 1713200000000,
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "url": "https://myapp.com/dashboard",
      "source_context": "function handleClick() {\n  // ...\n  const val = obj.xxx; // 第 42 行\n}",
      "source_context_line": 3
    }
  ]
}
```

**字段说明**：
| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 错误报告 ID |
| project | string | 项目名称 |
| stack | string | 原始压缩堆栈 |
| parsed_stack | string | 通过 source-map 反混淆后的堆栈 |
| created_at | number | 时间戳 |
| user_agent | string | 浏览器 UA |
| url | string | 页面 URL |
| source_context | string | 源代码上下文（前后各几行） |
| source_context_line | number | 错误所在行在上下文中的位置 |

**前端查询示例**：
```javascript
const token = localStorage.getItem('token');
const params = new URLSearchParams({
  project: 'my-app',
  start_time: '2024-04-01',
  end_time: '2024-04-15',
  page: 1,
  page_size: 10
});
const response = await fetch(`/report-list?${params}`, {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
console.log(`共 ${data.total} 个错误，当前第 ${data.page} 页`);
```

---

### 3. 按项目统计异常数

```
GET /project-stats?start_time=<date>&end_time=<date>
```

**参数说明**：
| 参数 | 类型 | 说明 |
|------|------|------|
| start_time | string | ISO 8601 日期 |
| end_time | string | ISO 8601 日期 |

**响应示例**：
```json
{
  "status": 200,
  "list": [
    { "project": "my-app", "count": 156 },
    { "project": "web-service", "count": 89 },
    { "project": "admin-panel", "count": 42 }
  ]
}
```

**说明**：按错误数从多到少排序

**前端使用示例**：
```javascript
const response = await fetch('/project-stats', {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
// 绘制柱状图
data.list.forEach(item => {
  console.log(`${item.project}: ${item.count} 个错误`);
});
```

---

## 错误响应

### 常见 HTTP 状态码

| 状态码 | 说明 | 示例 |
|--------|------|------|
| 200 | 请求成功 | `{ "status": 200, "message": "success" }` |
| 400 | 请求参数错误 | `{ "status": 400, "message": "Missing parameter: project" }` |
| 401 | 未授权（Token 缺失或过期） | `{ "status": 401, "message": "Unauthorized" }` |
| 500 | 服务器错误 | `{ "status": 500, "message": "Internal server error" }` |

### 常见错误处理

```javascript
async function apiCall(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (data.status !== 200) {
    if (response.status === 401) {
      // Token 过期，需重新登录
      localStorage.removeItem('token');
      window.location.href = '/auth/gitee';
    } else if (response.status === 400) {
      console.error('参数错误:', data.message);
    } else {
      console.error('服务器错误:', data.message);
    }
    throw new Error(data.message);
  }
  
  return data;
}
```

---

## 完整工作示例

### 前端登录流程

```javascript
// 1. 用户点击"Gitee 登录"
function handleGiteeLogin() {
  window.location.href = '/auth/gitee';
}

// 2. 页面加载时检测 OAuth 回调（服务器已重定向回首页并附带参数）
function handleOAuthCallback() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const user = params.get('user');

  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', user);
    // 清除 URL 参数
    window.history.replaceState({}, '', window.location.pathname);
  }
}

// 3. 在仪表板中获取项目列表
async function loadProjects() {
  const token = localStorage.getItem('token');
  const response = await fetch('/projects', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  
  if (data.status === 200) {
    displayProjects(data.list);
  }
}

// 4. 展示异常列表
async function loadErrorReports(projectName) {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    project: projectName,
    page: 1,
    page_size: 20
  });
  
  const response = await fetch(`/report-list?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  
  console.log(`${projectName}: 共 ${data.total} 个错误`);
  data.list.forEach(report => {
    console.log(`  [${new Date(report.created_at).toLocaleString()}] ${report.parsed_stack?.split('\n')[0]}`);
  });
}
```

---

## 其他注意事项

1. **CORS**：生产环境需配置适当的 CORS 策略
2. **时间格式**：所有时间戳为毫秒级 Unix 时间戳；日期参数支持 ISO 8601 格式（如 `2024-04-15`）
3. **分页**：默认每页 20 条，最多可请求 100 条
4. **Rate Limit**：当前无速率限制，生产环境建议添加
5. **Token 刷新**：当前 JWT 过期后需重新登录，暂无刷新机制
