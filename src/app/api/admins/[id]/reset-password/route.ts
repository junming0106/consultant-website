import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { validateSessionToken } from '@/lib/auth'

// 生成隨機密碼
function generateRandomPassword(length: number = 12): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let password = ''
  
  // 確保包含各種字符類型
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*'
  
  // 至少包含一個大寫、小寫、數字、符號
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]
  
  // 填充剩餘長度
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // 打亂字符順序
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 驗證 session 和 superadmin 權限
    const sessionToken = request.cookies.get('admin-session')?.value
    const adminInfo = sessionToken ? await validateSessionToken(sessionToken) : null
    
    if (!adminInfo) {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401 }
      )
    }

    // 檢查是否為 superadmin
    if (adminInfo.username !== 'superadmin') {
      return NextResponse.json(
        { error: '只有超級管理員可以重置其他管理員密碼' },
        { status: 403 }
      )
    }

    const params = await context.params
    const adminIdToReset = parseInt(params.id)
    
    if (isNaN(adminIdToReset)) {
      return NextResponse.json(
        { error: '無效的管理員ID' },
        { status: 400 }
      )
    }

    // 防止重置自己的密碼（應該用修改密碼功能）
    if (adminIdToReset === adminInfo.id) {
      return NextResponse.json(
        { error: '請使用「帳號設定」來修改自己的密碼' },
        { status: 400 }
      )
    }

    // 檢查要重置密碼的管理員是否存在
    const adminToReset = await prisma.admin.findUnique({
      where: { id: adminIdToReset },
      select: {
        id: true,
        username: true,
        name: true
      }
    })

    if (!adminToReset) {
      return NextResponse.json(
        { error: '管理員不存在' },
        { status: 404 }
      )
    }

    // 生成新密碼
    const newPassword = generateRandomPassword(12)
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // 更新密碼
    await prisma.admin.update({
      where: { id: adminIdToReset },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    })

    console.log('管理員密碼重置成功:', {
      resetAdminId: adminIdToReset,
      resetUsername: adminToReset.username,
      resetName: adminToReset.name,
      resetBy: adminInfo.id,
      resetByUsername: adminInfo.username,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: true, 
        message: '密碼重置成功',
        admin: {
          id: adminToReset.id,
          username: adminToReset.username,
          name: adminToReset.name
        },
        newPassword: newPassword // 僅此次顯示，不會永久儲存
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('重置管理員密碼錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}