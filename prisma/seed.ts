import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 從環境變數讀取管理員資訊
  const adminUsername = process.env.ADMIN_username || 'superadmin'
  const adminName = process.env.ADMIN_name || '超級管理員'
  const adminPassword = process.env.ADMIN_PASSWORD || 'defaultpassword'
  
  // 加密密碼
  const hashedPassword = await bcrypt.hash(adminPassword, 12)
  
  // 建立超級管理員帳號
  const superAdmin = await prisma.admin.upsert({
    where: { username: adminUsername },
    update: {
      password: hashedPassword,
      name: adminName,
      role: "superadmin", // 設定為超級管理員
    },
    create: {
      username: adminUsername,
      password: hashedPassword,
      name: adminName,
      role: "superadmin", // 設定為超級管理員
    },
  })

  console.log('超級管理員帳號已建立/更新:', {
    username: superAdmin.username,
    name: superAdmin.name,
    id: superAdmin.id
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })