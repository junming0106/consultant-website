# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

這是一個企業級顧問服務平台，使用 Next.js 14 (App Router) 開發的響應式網站。專案採用 TypeScript，並整合 Prisma ORM 管理 SQLite 資料庫。

## 開發環境指令

### 本地開發
```bash
npm run dev         # 啟動開發伺服器 (帶 Turbopack)
npm run build       # 建構專案
npm run start       # 啟動生產環境伺服器
npm run lint        # 執行 ESLint 檢查
```

### 資料庫相關
```bash
npx prisma generate     # 生成 Prisma Client
npx prisma db push      # 推送 schema 變更到資料庫
npx prisma studio       # 開啟 Prisma Studio 資料庫管理介面
npx prisma migrate dev  # 建立新的資料庫遷移檔案
```

## 核心架構

### 技術棧
- **前端**: Next.js 14, TypeScript, React 19
- **樣式**: Tailwind CSS 4, CSS Modules
- **表單處理**: React Hook Form + Zod 驗證
- **動畫**: Framer Motion
- **資料庫**: SQLite + Prisma ORM
- **部署**: 設計為 Vercel 部署

### 檔案結構
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── auth/          # 驗證相關 API
│   │   └── contact/       # 聯絡表單 API
│   ├── admin/             # 管理頁面
│   ├── manage-dashboard/  # 管理儀表板
│   └── page.tsx          # 首頁
├── components/
│   ├── ui/               # 基礎 UI 元件 (Button, Input, Card 等)
│   ├── layout/           # 版面配置元件 (Header, Footer)
│   └── sections/         # 頁面區塊 (Hero, Services, Contact 等)
└── lib/
    └── prisma.ts        # Prisma Client 設定
```

### 資料庫 Schema
- **Contact 模型**: 儲存聯絡表單資料
  - 必填: name, email, phone, service, message
  - 選填: company, budget
  - 自動時間戳記: createdAt, updatedAt

## 開發重點

### 表單驗證系統
- 前端使用 React Hook Form
- 後端使用 Zod schema 驗證
- 即時驗證回饋與錯誤處理
- 防護機制: 輸入長度限制、格式驗證

### 管理系統
- 簡易 session-based 認證 (24小時有效期)
- 管理員可查看所有聯絡表單提交記錄
- Session token 格式: `admin_timestamp_hash`

### UI/UX 特色
- 響應式設計，支援桌面、平板、手機
- CSS Modules 配合 Tailwind CSS
- Framer Motion 動畫效果 (scroll-triggered)
- 無障礙設計考量

### 安全性考量
- Zod 驗證防止惡意輸入
- Prisma 防 SQL 注入
- 管理員 session 時效限制
- HTTPS 強制 (生產環境)

## 程式碼風格

### 元件設計
- 採用 "use client" 明確標示客戶端元件
- Props 使用 TypeScript interface 定義
- 錯誤處理包含使用者友善訊息
- 載入狀態與互動回饋

### API 設計
- RESTful 設計原則
- 統一錯誤回應格式
- 詳細的 console.log 用於除錯
- Zod 驗證與 Prisma ORM 整合

### 樣式架構
- CSS Modules 命名: 元件名.module.css
- Tailwind 工具類別與自定義樣式混合使用
- 響應式設計優先
- 設計系統一致性

## 部署注意事項

### 環境變數
```bash
DATABASE_URL="file:./dev.db"    # SQLite 資料庫位置
NODE_ENV="production"           # 生產環境
```

### Vercel 設定
- 自動從 main 分支部署
- 建構指令: `npm run build`
- 輸出目錄: `.next`
- 支援 SSR 與 API Routes

## 常見任務

### 新增聯絡表單欄位
1. 更新 `prisma/schema.prisma` Contact 模型
2. 執行 `npx prisma db push`
3. 更新 `/api/contact/route.ts` Zod schema
4. 修改 `ContactSection.tsx` 表單介面

### 新增 UI 元件
1. 在 `src/components/ui/` 建立新元件
2. 配合建立 `.module.css` 樣式檔案
3. 在 `src/components/ui/index.ts` 匯出
4. 遵循現有元件設計模式 (props, TypeScript, accessibility)

### 管理功能擴展
1. 新增 API 路由至 `src/app/api/`
2. 實作 session 驗證檢查
3. 擴展管理儀表板頁面
4. 確保適當的權限控制