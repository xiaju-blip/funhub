# ReelRWA - 全球首个基于区块链的短剧 IP 版权碎片化投资与交易平台

## 项目架构

```
reelrwa/
├── frontend/                # React 前端代码（当前目录）
├── backend/                 # NestJS 后端 API
├── deployment/              # 部署配置
│   ├── init.sql             # 数据库初始化脚本
│   ├── Dockerfile.backend  # 后端 Docker 镜像
│   ├── Dockerfile.frontend # 前端 Docker 镜像
│   └── nginx.conf          # Nginx 配置
├── docker-compose.yml      # Docker 一键部署
└── README.full.md         # 本文件
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18 + TypeScript + Vite + i18next + TailwindCSS |
| 后端 | Node.js + NestJS + TypeORM |
| 数据库 | PostgreSQL + Redis |
| 区块链 | Ethereum / BSC |
| 部署 | Docker + docker-compose |

## 快速启动

### 方式一：Docker Compose 一键启动（推荐）

**前提条件：** 已安装 Docker 和 docker-compose

```bash
# 克隆项目
git clone https://github.com/yourusername/reelrwa.git
cd reelrwa

# 一键启动
docker-compose up -d
```

启动完成后：
- 前端访问：http://localhost
- 后端 API：http://localhost/api

### 方式二：本地开发启动

**前端开发：**
```bash
# 安装依赖
npm install

# 开发模式启动
npm run dev

# 生产构建
npm run build
```

**后端开发：**
```bash
cd backend

# 安装依赖
npm install

# 复制环境变量
cp .env.example .env
# 编辑 .env 配置数据库连接等信息

# 开发模式启动
npm run start:dev

# 生产构建
npm run build
npm run start:prod
```

## 数据库初始化

项目启动时，PostgreSQL 容器会自动执行 `deployment/init.sql` 创建所有表结构。
表结构完全按照开发文档 V13.1 设计，包含：

- 用户与邀请相关表
- 广告与内容相关表
- 短剧相关表（支持多语言）
- 资产与交易相关表
- 积分与 PoE 相关表
- 积分商城相关表
- VIP 相关表
- 质押相关表（含分段计息）
- 代币相关表（含风控提现）
- 任务相关表
- 代币经济相关表

## 功能模块

### 已完成前端页面
- ✅ 登录注册（修复了登录模式无手机/钱包选项问题）
- ✅ 首页
- ✅ 短剧播放页（含 PoE 积分机制框架）
- ✅ 资产投资页
- ✅ 交易市场（C2C + AMM）
- ✅ 个人中心
- ✅ 持仓管理
- ✅ 邀请好友
- ✅ 签到
- ✅ 积分商城
- ✅ VIP 会员
- ✅ 代币管理
- ✅ 质押挖矿
- ✅ 任务中心
- ✅ 全链路中英文国际化

### 后端模块（已创建骨架）
- ✅ Auth 认证模块（邮箱/手机/钱包登录）
- ✅ User 用户模块
- ✅ Drama 短剧模块
- ✅ Assets 资产模块
- ✅ Trade 交易模块
- ✅ Points 积分模块
- ✅ Stake 质押模块
- ✅ Tasks 任务模块
- ✅ Ad 广告模块
- ✅ Invite 邀请模块

## 开发文档

完整开发文档参见：`ReelRWA_合并文档_V13.1.md`

## 核心特性

1. **全球化多语言支持** - 完整中英文切换，支持浏览器语言自动识别，数据库 JSON 多语言字段
2. **PoE 有效观看挖矿** - 基于观看时长、完播率、互动行为分配 REEL 代币
3. **C2C + AMM 混合交易** - 订单簿 + 恒定乘积自动做市商，支持价格熔断
4. **分段计息质押** - VIP 等级变化自动切分计息周期，避免碎片化
5. **多级邀请裂变** - 直接/间接奖励，阶梯大奖
6. **广告变现闭环** - 非 VIP 观看广告获得积分，平台获得广告收益
7. **完整风控体系** - 提现风控评分，分级响应，多签审核

## 环境变量

后端需要配置的环境变量见 `backend/.env.example`，主要包括：

- 数据库连接
- Redis 连接
- JWT 密钥
- 区块链 RPC
- 第三方广告平台密钥

## 贡献指南

按照开发文档 V13.1 进行功能开发，所有新功能需要：
1. 后端创建对应模块服务和控制器
2. 前端创建对应页面和组件
3. 添加多语言翻译到 `src/i18n/locales/zh` 和 `en`
4. 确保 TypeScript 类型检查通过

## 许可证

私有
