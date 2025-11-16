# ChatGPT Clone - AI Chat Application

一个功能完整的 ChatGPT 克隆应用，使用 Next.js 构建，支持多模型选择和消息编辑功能。

## ✨ 功能特性

- 💬 **智能对话** - 支持 Grok 4 Fast 和 SecondMind Agent 两种 AI 模型
- ✏️ **消息编辑** - 可以随时编辑已发送的消息，AI 会重新回答
- 📝 **智能标题** - 自动根据整个对话生成摘要标题
- 🎨 **现代化 UI** - 干净、现代、可访问的用户界面
- 📱 **多行输入** - 支持 Shift+Enter 换行，Enter 发送

## 🚀 在线访问

**生产环境**: [https://ember-chat.ai-builders.space/](https://ember-chat.ai-builders.space/)

## 📦 本地开发

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 环境变量

创建 `.env.local` 文件：

```env
AI_BUILDER_TOKEN=your_token_here
```

## 🔄 自动部署

本项目配置了 GitHub Actions 自动部署。每次推送到 `main` 分支时，会自动触发部署。

### 部署状态

[![Deploy Status](https://github.com/emberliu1997/cursormariogame/actions/workflows/deploy.yml/badge.svg)](https://github.com/emberliu1997/cursormariogame/actions/workflows/deploy.yml)

### 手动触发部署

1. 访问 GitHub 仓库的 **Actions** 标签页
2. 选择 **Deploy to AI Builders** 工作流
3. 点击 **Run workflow** 按钮
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow** 确认

### 设置 GitHub Secrets（首次设置）

1. 访问你的 GitHub 仓库：https://github.com/emberliu1997/cursormariogame
2. 点击 **Settings**（设置）
3. 在左侧菜单选择 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. 添加以下 secret：
   - **Name**: `AI_BUILDER_TOKEN`
   - **Value**: `sk_564e0ec7_05b965ec7494ea05a998e879a85358c4456f`
6. 点击 **Add secret**

完成设置后，每次推送代码到 `main` 分支都会自动部署！

## 🛠️ 技术栈

- **框架**: Next.js 16
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **AI API**: AI Builders API
- **部署**: AI Builders Space (Koyeb)

## 📁 项目结构

```
chatgpt-clone/
├── app/
│   ├── api/
│   │   └── chat/          # API 路由
│   ├── components/         # React 组件
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx           # 主页面
├── .github/
│   └── workflows/         # GitHub Actions 工作流
├── Dockerfile             # Docker 配置
└── package.json           # 项目依赖

```

## 📝 许可证

MIT License
