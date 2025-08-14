import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 建立預設管理員帳號
  const defaultAdmin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'admin', // 在實際生產環境中應該使用加密密碼
      name: '預設管理員',
    },
  })

  console.log('預設管理員帳號已建立:', defaultAdmin)
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