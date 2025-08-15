# SQLite 到 Vercel SQL (PostgreSQL) 遷移指南

## 已完成的變更

### 1. 安裝 @vercel/postgres 套件
```bash
npm install @vercel/postgres
```

### 2. 更新 Prisma Schema
- 將 `datasource db` 的 `provider` 從 `sqlite` 改為 `postgresql`
- 檔案位置: `prisma/schema.prisma`

### 3. 環境變數設定
- 更新 `.env` 檔案，使用 PostgreSQL 連線字串格式
- 新增 `.env.example` 檔案作為範本

### 4. Migration 檔案
- 建立 PostgreSQL migration 檔案: `prisma/migrations/20240814000000_init/migration.sql`
- 建立 migration lock 檔案: `prisma/migrations/migration_lock.toml`

### 5. 新增資料庫相關指令
在 `package.json` 中新增:
```json
{
  "db:migrate": "prisma migrate dev",
  "db:deploy": "prisma migrate deploy", 
  "db:studio": "prisma studio",
  "db:seed": "prisma db seed"
}
```

## 部署到 Vercel 的步驟

### 1. 在 Vercel 建立 PostgreSQL 資料庫
1. 前往 Vercel Dashboard
2. 選擇專案 > Storage tab
3. 點擊 "Create Database" > 選擇 "Postgres"
4. 建立資料庫並取得連線字串

### 2. 設定環境變數
在 Vercel 專案設定中新增:
```
DATABASE_URL=your_vercel_postgres_connection_string
```

### 3. 部署 Migration
部署時 Vercel 會自動執行:
```bash
npm run postinstall  # 執行 prisma generate
npm run build        # 建構專案
```

如需手動執行 migration:
```bash
npx prisma migrate deploy
```

### 4. 初始化預設管理員
部署後需要執行 seed 或手動新增預設管理員帳號。

## 本地開發

### 使用本地 PostgreSQL
如果要在本地使用 PostgreSQL：

1. 安裝 PostgreSQL
2. 建立資料庫: `consultant_website`
3. 更新 `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/consultant_website"
```
4. 執行 migration:
```bash
npm run db:migrate
```

### 執行開發指令
```bash
npm run dev          # 啟動開發伺服器
npm run db:studio    # 開啟 Prisma Studio
npm run db:migrate   # 建立新 migration
```

## 注意事項

1. **資料型別差異**: PostgreSQL 使用 `SERIAL` 取代 SQLite 的 `INTEGER` 自動遞增
2. **連線池**: Vercel 環境建議使用連線池化
3. **備份**: 部署前請備份現有的 SQLite 資料
4. **遷移現有資料**: 如需遷移現有資料，需要額外的資料匯出/匯入步驟

## 驗證遷移成功

1. 檢查 Prisma Client 生成: `npx prisma generate`
2. 檢查資料庫連線: `npx prisma db pull`
3. 執行應用程式並測試所有功能
4. 檢查管理員登入和表單提交功能