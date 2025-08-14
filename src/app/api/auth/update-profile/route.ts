import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 定義更改帳號資訊驗證 schema
const updateProfileSchema = z.object({
  username: z.string().min(3, '帳號至少需要3個字元').max(50, '帳號不能超過50個字元'),
  name: z.string().min(1, '請輸入姓名').max(100, '姓名不能超過100個字元'),
  currentPassword: z.string().min(1, '請輸入目前密碼進行驗證'),
})

// 從 session token 取得管理員 ID
function getAdminIdFromToken(token: string): number | null {
  if (!token.startsWith('admin_')) {
    return null
  }
  
  try {
    const parts = token.split('_')
    if (parts.length !== 5) {
      return null
    }
    
    const adminId = parseInt(parts[1])
    const timestamp = parseInt(parts[3])
    const now = Date.now()
    
    // 檢查是否在 24 小時內
    const twentyFourHours = 24 * 60 * 60 * 1000
    if ((now - timestamp) >= twentyFourHours) {
      return null
    }
    
    return adminId
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // 驗證 session
    const sessionToken = request.cookies.get('admin-session')?.value
    const adminId = sessionToken ? getAdminIdFromToken(sessionToken) : null
    
    if (!adminId) {
      return NextResponse.json(
        { error: '需要登入才能更改帳號資訊' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // 驗證輸入資料
    const validationResult = updateProfileSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => issue.message).join(', ')
      return NextResponse.json(
        { error: errors },
        { status: 400 }
      )
    }
    
    const { username, name, currentPassword } = validationResult.data
    
    // 取得管理員資料並驗證密碼
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    })
    
    if (!admin) {
      return NextResponse.json(
        { error: '管理員不存在' },
        { status: 404 }
      )
    }
    
    // 驗證目前密碼
    if (admin.password !== currentPassword) {
      return NextResponse.json(
        { error: '密碼錯誤，無法更改帳號資訊' },
        { status: 401 }
      )
    }
    
    // 檢查新帳號名稱是否已存在（排除自己）
    if (username !== admin.username) {
      const existingAdmin = await prisma.admin.findUnique({
        where: { username }
      })
      
      if (existingAdmin) {
        return NextResponse.json(
          { error: '此帳號名稱已被使用' },
          { status: 409 }
        )
      }
    }
    
    // 更新帳號資訊
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: {
        username,
        name,
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    console.log('管理員帳號資訊更新成功:', {
      adminId,
      oldUsername: admin.username,
      newUsername: username,
      oldName: admin.name,
      newName: name,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { 
        success: true, 
        message: '帳號資訊更新成功',
        admin: updatedAdmin
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('更改帳號資訊錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}