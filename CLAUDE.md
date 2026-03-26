# 项目：数字命盘

## 产品简介
数字命理学测算工具，用户输入基本信息，获得专属数字命盘解读。
目标：网页端 + 手机端均可使用。

## 项目负责人
吉吉（孙喆）— 文科背景，零技术，vibe coding 方式开发。
解释时用产品语言，不堆技术术语。每次改代码前先说打算怎么做。

## 当前进度
- [x] 确定命理体系
- [x] 确定 MVP 输入字段
- [x] 搭建项目基础框架（Next.js + TypeScript + Tailwind）
- [x] 完成测算核心逻辑（lib/numerology.ts，8项算法）
- [x] 完成页面组件（InputForm、ResultPanel、CoreNumbers、LoShu、Pinnacles、PersonalYear、StarField）
- [x] 接入 Claude API（app/api/interpret/route.ts）
- [x] API Key 已配置，本地可正常运行（npm run dev → localhost:3000）
- [x] 第一轮迭代：解读规范（统一称呼/数字格式/引号/大师数/分段/highlight）
- [x] 第二轮迭代：预加载优化（8个解读并行生成）、流星Loading动画、当前周期高亮呼吸效果、底部灰度版块（合盘/About Me）
- [x] 第三轮迭代（2026-03-26）：
  - 修复 Hydration 报错（display:none → 条件式保留 DOM，suppressHydrationWarning）
  - 首页 placeholder 改为 e.g. ZhangSan/Emma Watson
  - Loading 页移除流星动效，保留星空背景
  - 删除 About Me 底部版块，保留合盘占位
  - 人生四格年龄分界公式修正（大师数取底层单数，各期首尾连续）
  - 新增挑战数 Challenge（4个，绝对差值公式）：Pinnacle interface 更新、卡片展示 ▲挑战数、Layer 4 趋势提示
  - AI prompt 更新：巅峰/流年均加入挑战/课题解读；巅峰按 Step1/2/3 结构（外在×内在张力+整体路径）
  - 当前巅峰高亮 bug 修复（用实际生日计算真实年龄，非年份差）
  - 风琴版块顺序调整：人生四格 → 近三年流年 → 命理九宫格
  - 回车提交支持（button type="submit"）
- [ ] 手机端调试（本地 WiFi 环境下无法稳定运行，待部署后验证）
- [ ] 部署上线（Vercel）— 下次优先

## 技术决定
- 框架：Next.js + TypeScript + Tailwind CSS
- AI：Claude API（claude-sonnet-4-6）实时生成解读
- 部署：Vercel

## 产品决定
- 命理体系：毕达哥拉斯数字命理学（Pythagorean Numerology）
- 用户输入：姓名拼音或英文名（统一用字母计算）+ 出生日期
- 语言：中英双语
- 付费：MVP 阶段全部免费

### 测算内容（8项）
1. 生命数 Life Path Number — 生日所有数字相加
2. 生日数 Birthday Number — 出生日
3. 天赋数 Expression Number — 姓名所有字母数值之和
4. 灵魂数 Soul Urge Number — 姓名元音字母数值之和
5. 人格数 Personality Number — 姓名辅音字母数值之和
6. 命理九宫格 Lo Shu Grid — 生日数字分布
7. 人生四格 Four Pinnacles — 四个人生阶段及巅峰数字
8. 近三年流年 Personal Year — 当前+未来两年流年数解读

### 页面结构
**第一区：核心数字 + 命盘总结**
- 展示5个核心数字（生命/生日/天赋/灵魂/人格）
- AI生成一句话命盘总结或关键词
- 点击任意数字 → 展开该数字独立详细解读

**第二区：风琴式展开**
- 人生四格 & 巅峰周期（默认收起，点击展开时间轴+解读；含挑战数）
- 近三年流年（默认收起，点击展开逐年解读）
- 命理九宫格（默认收起，点击展开图示+解读）

### 视觉风格
- 整体：神秘宇宙感，深蓝/深紫/黑色背景
- 文字：白色主文字 + 金色点缀
- 元素：星点、几何图形、渐变光晕
- 交互元素：立体金属质感
- 参考：Co-Star（高端简洁）

## 注意事项
- 每次会话结束后更新"当前进度"
