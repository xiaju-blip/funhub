-- ReelRWA 数据库初始化脚本 PostgreSQL 适配版
-- 按照开发文档 V13.1 创建完整表结构

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- 1. 用户与邀请相关表
-- ============================================

-- 用户表（增加语言/时区、邀请码字段）
CREATE TABLE users (
 id BIGSERIAL PRIMARY KEY,
 phone VARCHAR(20),
 email VARCHAR(100),
 password_hash VARCHAR(255),
 wallet_address VARCHAR(100),
 nickname VARCHAR(50),
 avatar VARCHAR(255),
 kyc_level SMALLINT DEFAULT 0,
 vip_level SMALLINT DEFAULT 0,
 -- V13.0 新增
 invite_code VARCHAR(20) UNIQUE NOT NULL, -- 自己的邀请码
 inviter_id BIGINT DEFAULT 0, -- 邀请人 ID
 language VARCHAR(10) DEFAULT 'en',
 timezone VARCHAR(50) DEFAULT 'UTC',
 status SMALLINT DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE (phone),
 UNIQUE (email),
 UNIQUE (wallet_address)
);

CREATE INDEX idx_inviter ON users(inviter_id);
CREATE INDEX idx_invite_code ON users(invite_code);

-- 邀请记录表（V13.0 新增）
CREATE TABLE invite_records (
 id BIGSERIAL PRIMARY KEY,
 inviter_id BIGINT NOT NULL,
 invitee_id BIGINT NOT NULL,
 level SMALLINT NOT NULL, -- 1:直接 2:间接
 event_type VARCHAR(50) NOT NULL, -- register, kyc, first_invest, ad_watch
 reward_points INT DEFAULT 0,
 reward_token DECIMAL(20,8) DEFAULT 0,
 status SMALLINT DEFAULT 0, -- 0:待发放 1:已发放 2:已冻结
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inviter ON invite_records(inviter_id);
CREATE INDEX idx_invitee ON invite_records(invitee_id);

-- 观看券表（V13.0 新增）
CREATE TABLE user_vouchers (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 type SMALLINT NOT NULL, -- 1:单日无限观看券
 quantity INT NOT NULL,
 expire_time TIMESTAMP NOT NULL,
 is_used SMALLINT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_expire ON user_vouchers(user_id, expire_time);

-- 每日观看计数表（V13.0 新增，用于限流）
CREATE TABLE daily_watch_counts (
 user_id BIGINT NOT NULL,
 watch_date DATE NOT NULL,
 free_count INT DEFAULT 0,
 voucher_count INT DEFAULT 0,
 PRIMARY KEY (user_id, watch_date)
);

-- ============================================
-- 2. 广告与内容相关表
-- ============================================

-- 广告位配置表（V13.0 新增）
CREATE TABLE ad_placements (
 id BIGSERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL, -- 如 video_midroll
 sdk_provider VARCHAR(50) NOT NULL, -- admob, applovin
 placement_id VARCHAR(100) NOT NULL, -- SDK 中的 ID
 status SMALLINT DEFAULT 1,
 frequency_cap INT DEFAULT 1, -- 每分钟最大展示次数
 priority INT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 广告收益日志（V13.0 新增）
CREATE TABLE ad_revenue_logs (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT,
 placement_id BIGINT,
 impression_time TIMESTAMP,
 click_time TIMESTAMP,
 estimated_revenue DECIMAL(10,6),
 currency VARCHAR(10) DEFAULT 'USD',
 sdk_response_data JSON,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. 短剧相关表（V13.1 多语言增强）
-- ============================================

-- 短剧主表（多语言字段）
CREATE TABLE dramas (
 id BIGSERIAL PRIMARY KEY,
 title JSON NOT NULL, -- {"zh": "中文标题", "en": "English Title"}
 description JSON, -- {"zh": "中文描述...", "en": "English description..."}
 tags JSON, -- {"zh": ["标签1"], "en": ["Tag1"]}
 cover_image VARCHAR(255) NOT NULL,
 category_id BIGINT,
 total_episodes INT DEFAULT 0,
 status SMALLINT DEFAULT 1, -- 1:上线 2:完结
 vip_level SMALLINT DEFAULT 0, -- 0:免费 1:VIP1 2:VIP2 3:VIP3
 release_date DATE,
 release_time TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category ON dramas(category_id);

-- 短剧分集表（标题、字幕多语言 + DRM）
CREATE TABLE drama_episodes (
 id BIGSERIAL PRIMARY KEY,
 drama_id BIGINT NOT NULL,
 episode_num INT NOT NULL,
 title JSON NOT NULL, -- {"zh": "第1集", "en": "Episode 1"}
 video_url_encrypted VARCHAR(500) NOT NULL,
 drm_key_id VARCHAR(100),
 subtitles JSON, -- {"zh-CN": "url_zh.srt", "en-US": "url_en.vtt"}
 ad_break_points JSON, -- [{"time": 30, "placement_id": 1}]
 duration INT NOT NULL,
 sort_order INT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drama_id ON drama_episodes(drama_id);

-- 用户观看记录表（含防刷字段）
CREATE TABLE watch_records (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 drama_id BIGINT NOT NULL,
 episode_id BIGINT NOT NULL,
 watch_duration INT NOT NULL,
 is_completed SMALLINT DEFAULT 0,
 has_interaction SMALLINT DEFAULT 0,
 device_fingerprint VARCHAR(64), -- 设备指纹
 ip_address VARCHAR(45), -- IP 地址
 last_watch_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uk_user_episode ON watch_records(user_id, episode_id, device_fingerprint);
CREATE INDEX idx_user_id ON watch_records(user_id);

-- ============================================
-- 4. 资产与交易相关表
-- ============================================

-- 资产包表（IPT）
CREATE TABLE assets (
 id BIGSERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 cover VARCHAR(255),
 video VARCHAR(500),
 description TEXT,
 target_amount DECIMAL(20,8),
 raised_amount DECIMAL(20,8) DEFAULT 0,
 apy DECIMAL(5,2),
 duration_days INT,
 status SMALLINT DEFAULT 0, -- 0:待发行 1:募资中 2:进行中 3:已结束
 start_time TIMESTAMP,
 end_time TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户持仓表
CREATE TABLE positions (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 asset_id BIGINT NOT NULL,
 amount DECIMAL(20,8) NOT NULL,
 cost_price DECIMAL(20,8),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE (user_id, asset_id)
);

-- 交易订单表
CREATE TABLE orders (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 asset_id BIGINT NOT NULL,
 type SMALLINT NOT NULL, -- 1:买入 2:卖出
 price DECIMAL(20,8) NOT NULL,
 amount DECIMAL(20,8) NOT NULL,
 status SMALLINT DEFAULT 0, -- 0:挂单 1:部分成交 2:全部成交 3:已取消
 liquidity_source SMALLINT DEFAULT 1, -- 1:C2C 订单簿 2:AMM 底池
 slippage_rate DECIMAL(5,4), -- 成交滑点率
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_asset_id ON orders(asset_id);

-- ============================================
-- 5. 积分与 PoE 相关表
-- ============================================

-- 用户积分表
CREATE TABLE user_points (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 balance INT NOT NULL DEFAULT 0,
 total_earned INT NOT NULL DEFAULT 0,
 total_spent INT NOT NULL DEFAULT 0,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE (user_id)
);

-- 积分流水表
CREATE TABLE points_transactions (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 type SMALLINT NOT NULL, -- 1:观看视频 2:签到 3:广告 4:兑换 5:补签 6:任务奖励 7:活动奖励
 amount INT NOT NULL,
 balance_after INT NOT NULL,
 source_id VARCHAR(64), -- 关联 ID
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON points_transactions(user_id);
CREATE INDEX idx_created_at ON points_transactions(created_at);

-- 每日签到记录表
CREATE TABLE sign_records (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 sign_date DATE NOT NULL,
 points_earned INT NOT NULL,
 is_makeup SMALLINT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uk_user_date ON sign_records(user_id, sign_date);
CREATE INDEX idx_user_id ON sign_records(user_id);

-- 每日 PoE 挖矿记录表
CREATE TABLE poe_daily_records (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 record_date DATE NOT NULL,
 total_points INT NOT NULL,
 global_total_points BIGINT NOT NULL,
 daily_pool_amount DECIMAL(20,8) NOT NULL,
 earned_reel DECIMAL(20,8) NOT NULL,
 is_capped SMALLINT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uk_user_date ON poe_daily_records(user_id, record_date);

-- ============================================
-- 6. 积分商城相关表
-- ============================================

-- 兑换商品表
CREATE TABLE shop_items (
 id BIGSERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 type SMALLINT NOT NULL, -- 1:代币 2:VIP 体验卡 3:补签卡 4:实物 5:抽奖券 6:道具
 points INT NOT NULL,
 token_amount DECIMAL(20,8),
 vip_days INT,
 stock INT DEFAULT -1,
 daily_limit INT DEFAULT 0,
 status SMALLINT DEFAULT 1,
 sort_order INT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 兑换记录表
CREATE TABLE exchange_records (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 item_id BIGINT NOT NULL,
 points_used INT NOT NULL,
 quantity INT NOT NULL,
 status SMALLINT DEFAULT 0,
 token_sent DECIMAL(20,8),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON exchange_records(user_id);

-- ============================================
-- 7. VIP 相关表
-- ============================================

-- VIP 用户表
CREATE TABLE vip_users (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 vip_level SMALLINT NOT NULL,
 start_time TIMESTAMP NOT NULL,
 end_time TIMESTAMP NOT NULL,
 status SMALLINT DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uk_user_id ON vip_users(user_id);
CREATE INDEX idx_end_time ON vip_users(end_time);

-- VIP 订单表
CREATE TABLE vip_orders (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 vip_level SMALLINT NOT NULL,
 duration_type SMALLINT NOT NULL, -- 1:月卡 2:季卡 3:年卡 4:终身
 duration_days INT NOT NULL,
 price_fiat DECIMAL(10,2),
 price_token DECIMAL(20,8),
 payment_method SMALLINT NOT NULL, -- 1:微信 2:支付宝 3:REEL
 status SMALLINT DEFAULT 0,
 pay_time TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON vip_orders(user_id);

-- ============================================
-- 8. 质押相关表（V12.1 优化）
-- ============================================

-- 质押池配置表
CREATE TABLE stake_pools (
 id BIGSERIAL PRIMARY KEY,
 name VARCHAR(50) NOT NULL,
 lock_days INT NOT NULL,
 base_apy DECIMAL(5,2) NOT NULL,
 max_stake DECIMAL(20,8),
 min_stake DECIMAL(20,8) DEFAULT 100,
 penalty_rate DECIMAL(5,2) DEFAULT 0,
 status SMALLINT DEFAULT 1,
 sort_order INT DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户质押记录表
CREATE TABLE stake_records (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 pool_id BIGINT NOT NULL,
 amount DECIMAL(20,8) NOT NULL,
 vip_level_at_stake SMALLINT,
 lock_end_time TIMESTAMP,
 total_earned DECIMAL(20,8) DEFAULT 0,
 pending_earned DECIMAL(20,8) DEFAULT 0,
 auto_compound SMALLINT DEFAULT 0,
 status SMALLINT DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON stake_records(user_id);
CREATE INDEX idx_status ON stake_records(status);

-- 质押收益分段记录表（V12.1 新增审计字段）
CREATE TABLE stake_earnings_periods (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 stake_id BIGINT NOT NULL,
 start_time TIMESTAMP NOT NULL,
 end_time TIMESTAMP,
 applied_vip_level SMALLINT,
 applied_apy DECIMAL(5,2),
 earned_amount DECIMAL(20,8) NOT NULL,
 is_settled SMALLINT DEFAULT 0,
 event_trigger VARCHAR(20), -- 触发事件：VIP_CHANGE / DEPOSIT / WITHDRAW
 settled_at TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stake_id ON stake_earnings_periods(stake_id);
CREATE INDEX idx_settled ON stake_earnings_periods(is_settled);

-- ============================================
-- 9. 代币相关表
-- ============================================

-- 用户代币余额表
CREATE TABLE user_tokens (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 balance DECIMAL(20,8) DEFAULT 0,
 total_earned DECIMAL(20,8) DEFAULT 0,
 total_spent DECIMAL(20,8) DEFAULT 0,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 UNIQUE (user_id)
);

-- 代币交易记录表
CREATE TABLE token_transactions (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 type SMALLINT NOT NULL, -- 1:积分兑换 2:VIP 购买 3:质押收益 4:提现 5:空投
 amount DECIMAL(20,8) NOT NULL,
 balance_after DECIMAL(20,8) NOT NULL,
 status SMALLINT DEFAULT 1,
 tx_hash VARCHAR(100),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON token_transactions(user_id);

-- 提现记录表（V12.1 强风控版）
CREATE TABLE withdrawals (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 address VARCHAR(100) NOT NULL,
 amount DECIMAL(20,8) NOT NULL,
 fee DECIMAL(20,8) NOT NULL,
 actual_amount DECIMAL(20,8) NOT NULL,
 tx_hash VARCHAR(100),
 status SMALLINT DEFAULT 0, -- 0:待处理 1:处理中 2:已完成 3:失败 4:风控拦截
 kyc_level_snapshot SMALLINT NOT NULL,
 risk_score INT DEFAULT 0,
 risk_check_result JSON, -- 详细风控结果 {ip_risk, device_risk, behavior_risk}
 audit_user_id BIGINT,
 audit_remark VARCHAR(255),
 reject_reason VARCHAR(255),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON withdrawals(user_id);
CREATE INDEX idx_status ON withdrawals(status);

-- ============================================
-- 10. 任务相关表
-- ============================================

-- 任务定义表
CREATE TABLE tasks (
 id BIGSERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 type SMALLINT NOT NULL, -- 1:新手 2:每日 3:每周 4:成就 5:限时
 description VARCHAR(255),
 condition_type VARCHAR(50) NOT NULL,
 condition_value TEXT,
 reward_points INT NOT NULL,
 reward_token DECIMAL(20,8) DEFAULT 0,
 sort_order INT DEFAULT 0,
 status SMALLINT DEFAULT 1,
 start_time TIMESTAMP,
 end_time TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户任务进度表
CREATE TABLE user_tasks (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 task_id BIGINT NOT NULL,
 progress INT DEFAULT 0,
 target INT,
 status SMALLINT DEFAULT 0, -- 0:未开始 1:进行中 2:可领取 3:已完成 4:已过期
 completed_at TIMESTAMP,
 claimed_at TIMESTAMP,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uk_user_task ON user_tasks(user_id, task_id);
CREATE INDEX idx_user_id ON user_tasks(user_id);
CREATE INDEX idx_status ON user_tasks(status);

-- 任务完成记录表
CREATE TABLE task_completion_logs (
 id BIGSERIAL PRIMARY KEY,
 user_id BIGINT NOT NULL,
 task_id BIGINT NOT NULL,
 reward_points INT NOT NULL,
 reward_token DECIMAL(20,8),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON task_completion_logs(user_id);

-- ============================================
-- 11. 代币经济相关表
-- ============================================

-- 代币销毁记录表
CREATE TABLE token_burns (
 id BIGSERIAL PRIMARY KEY,
 amount DECIMAL(20,8) NOT NULL,
 source VARCHAR(50),
 tx_hash VARCHAR(100),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 代币奖励池余额表
CREATE TABLE reward_pools (
 id BIGSERIAL PRIMARY KEY,
 name VARCHAR(50) NOT NULL,
 balance DECIMAL(20,8) NOT NULL,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 初始化基础数据
-- ============================================

-- 初始化质押池
INSERT INTO stake_pools (name, lock_days, base_apy, max_stake, min_stake, penalty_rate, status) VALUES
 ('活期池', 0, 5, NULL, 100, 0, 1),
 ('30 天池', 30, 8, 5000000, 100, 50, 1),
 ('90 天池', 90, 12, 10000000, 100, 30, 1),
 ('180 天池', 180, 18, 20000000, 100, 20, 1);

-- 初始化奖励池
INSERT INTO reward_pools (name, balance) VALUES
 ('PoE Daily Pool', 10000000),
 ('Staking Reward Pool', 50000000);
