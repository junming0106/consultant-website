import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 從 session token 取得管理員資訊
function getAdminInfoFromToken(token: string): { adminId: number; username: string } | null {
  if (!token.startsWith('admin_')) {
    return null
  }
  
  try {
    const parts = token.split('_')
    if (parts.length !== 5) {
      return null
    }
    
    const adminId = parseInt(parts[1])
    const username = parts[2]
    const timestamp = parseInt(parts[3])
    const now = Date.now()
    
    // 檢查是否在 24 小時內
    const twentyFourHours = 24 * 60 * 60 * 1000
    if ((now - timestamp) >= twentyFourHours) {
      return null
    }
    
    return { adminId, username }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // 驗證 session 和 superadmin 權限
    const sessionToken = request.cookies.get('admin-session')?.value
    const adminInfo = sessionToken ? getAdminInfoFromToken(sessionToken) : null
    
    if (!adminInfo) {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401 }
      )
    }

    // 檢查是否為 superadmin
    if (adminInfo.username !== 'superadmin') {
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

    // 處理密碼顯示（顯示實際密碼以便查看）
    const adminsWithPasswordInfo = admins.map(admin => ({
      ...admin,
      passwordLength: admin.password.length,
      actualPassword: admin.password, // 顯示實際密碼
      password: '●'.repeat(admin.password.length) // 遮罩顯示
    }))

    console.log('管理員列表查詢成功:', {
      count: admins.length,
      requestBy: adminInfo.adminId,
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