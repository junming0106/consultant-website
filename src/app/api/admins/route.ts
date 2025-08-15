import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateSessionToken } from '@/lib/auth'


export async function GET(request: NextRequest) {
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
    if (adminInfo.role !== 'superadmin') {
      return NextResponse.json(
        { error: '只有超級管理員可以查看管理員列表' },
        { status: 403 }
      )
    }

    // 取得所有管理員資訊（不包含密碼，但顯示密碼長度）
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        password: true, // 暫時包含密碼以顯示
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            contacts: true,
            prospects: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    // 處理密碼顯示（bcrypt 加密後無法還原，僅顯示狀態）
    const adminsWithPasswordInfo = admins.map(admin => ({
      ...admin,
      passwordLength: admin.password.length,
      passwordStatus: admin.password.startsWith('$2') ? '已加密' : '未加密',
      isEncrypted: admin.password.startsWith('$2'),
      password: undefined // 不返回加密後的密碼
    }))

    console.log('管理員列表查詢成功:', {
      count: admins.length,
      requestBy: adminInfo.id,
      requestByUsername: adminInfo.username
    })

    return NextResponse.json(adminsWithPasswordInfo)
    
  } catch (error) {
    console.error('獲取管理員列表錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}