# GitHub Actions 工作流说明

本项目包含以下自动化工作流：

## 工作流文件

### 1. 文档部署 (`deploy-docs.yml`)

**触发条件：**
- 推送到 `main` 或 `master` 分支
- 手动触发

**功能：**
- 自动构建 VitePress 文档
- 部署到 GitHub Pages
- 支持并发控制，避免冲突部署
- 使用 pnpm 缓存优化构建速度
- 包含类型检查确保代码质量

**设置要求：**
1. 在仓库设置中启用 GitHub Pages
2. 配置 Pages 源为 "GitHub Actions"
3. 确保仓库有 `pages: write` 权限

### 2. 包发布 (`publish.yml`)

**触发条件：**
- 发布新的 Release

**功能：**
- 自动构建 npm 包
- 发布到 npm 注册表
- 包含类型检查和构建验证
- 检查版本是否已存在，避免重复发布

**设置要求：**
1. 在仓库 Secrets 中添加 `NPM_TOKEN`
2. 确保 npm 账户有发布权限

### 3. 测试 (`test.yml`)

**触发条件：**
- 推送到 `main`、`master` 或 `develop` 分支
- 创建 Pull Request 到 `main` 或 `master` 分支

**功能：**
- TypeScript 类型检查
- 构建包和文档
- 确保代码质量
- 生成测试结果摘要

### 4. PR 检查 (`pr-check.yml`)

**触发条件：**
- 创建 Pull Request 到 `main` 或 `master` 分支

**功能：**
- 完整的构建验证
- 检查构建产物是否存在
- 确保 PR 质量

### 5. 依赖审查 (`dependency-review.yml`)

**触发条件：**
- 创建 Pull Request 到 `main` 或 `master` 分支

**功能：**
- 检查依赖安全漏洞
- 阻止包含高危漏洞的 PR 合并

### 6. 代码安全分析 (`codeql.yml`)

**触发条件：**
- 推送到 `main` 或 `master` 分支
- 创建 Pull Request 到 `main` 或 `master` 分支
- 每周自动运行

**功能：**
- 静态代码安全分析（JavaScript 和 TypeScript）
- 检测潜在的安全问题

## 设置步骤

### 1. 启用 GitHub Pages

1. 进入仓库设置 → Pages
2. Source 选择 "GitHub Actions"
3. 保存设置

### 2. 配置 NPM Token

1. 登录 npm 账户
2. 生成 Access Token
3. 在仓库设置 → Secrets and variables → Actions 中添加：
   - Name: `NPM_TOKEN`
   - Value: 你的 npm token

### 3. 配置仓库权限

1. 进入仓库设置 → Actions → General
2. 确保以下权限已启用：
   - "Read and write permissions"
   - "Allow GitHub Actions to create and approve pull requests"

### 4. 启用安全功能

1. 进入仓库设置 → Security → Code security and analysis
2. 启用以下功能：
   - Dependency review
   - Code scanning
   - Secret scanning

## 使用流程

### 开发流程

1. 在功能分支开发
2. 创建 Pull Request
3. 自动运行测试、依赖审查和代码安全分析
4. 代码审查通过后合并到主分支
5. 自动部署文档

### 发布流程

1. 更新版本号 (`package.json`)
2. 创建 Release
3. 自动发布到 npm
4. 文档自动更新

## 工作流特性

- **缓存优化**: 使用 pnpm 缓存加速构建
- **并发控制**: 避免冲突部署
- **安全检查**: 自动检查依赖和代码安全
- **类型检查**: 确保 TypeScript 类型安全
- **构建验证**: 发布前验证构建结果

## 注意事项

- 确保所有依赖都正确安装
- 文档构建路径为 `docs/.vitepress/dist`
- 发布前会自动运行构建和测试
- 工作流使用 pnpm 作为包管理器
- 安全分析结果可在 Security 标签页查看 