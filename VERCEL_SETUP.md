# Vercel SQL 設定指南

## 步驟 1: 在 Vercel 建立 PostgreSQL 資料庫

1. 前往 [Vercel Dashboard](https://vercel.com/dashboard)
2. 選擇你的專案
3. 點擊 **Storage** 標籤
4. 點擊 **Create Database**
5. 選擇 **Postgres**
6. 輸入資料庫名稱（例如：`consultant-website-db`）
7. 選擇區域（建議選擇離你用戶最近的區域）
8. 點擊 **Create**

## 步驟 2: 取得連線字串

1. 資料庫建立完成後，點擊進入資料庫頁面
2. 前往 **Settings** 標籤
3. 在 **Connection** 區域找到 **DATABASE_URL**
4. 複製完整的連線字串（格式類似：`postgresql://username:password@host:port/database?sslmode=require`）

## 步驟 3: 更新本地環境變數

將剛才複製的連線字串貼到 `.env` 檔案中：

```bash
DATABASE_URL="你剛才複製的完整連線字串"
```

## 步驟 4: 執行 Migration

```bash
# 重新生成 Prisma Client
npx prisma generate

# 推送 schema 到資料庫
npx prisma db push

# 或使用 migration（推薦用於生產環境）
npx prisma migrate deploy
```

## 步驟 5: 執行 Seed（選擇性）

如果你有 seed 檔案，可以執行：
```bash
npx prisma db seed
```

## 步驟 6: 測試連線

```bash
npm run dev
```

然後測試登入功能確保資料庫連線正常。

---

**完成以上步驟後，你的應用程式就能正常使用 Vercel SQL 了！**