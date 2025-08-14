import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { validateJwtToken } from '@/lib/auth'

// 定義更改密碼驗證 schema
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '請輸入目前密碼'),
  newPassword: z.string().min(6, '新密碼至少需要6個字元').max(100, '新密碼不能超過100個字元'),
})


export async function POST(request: NextRequest) {
  try {
    // 驗證 session
    const sessionToken = request.cookies.get('admin-session')?.value
    const adminId = sessionToken ? validateJwtToken(sessionToken) : null
    
    if (!adminId) {
      return NextResponse.json(
        { error: '需要登入才能更改密碼' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // 驗證輸入資料
    const validationResult = changePasswordSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => issue.message).join(', ')
      return NextResponse.json(
        { error: errors },
        { status: 400 }
      )
    }
    
    const { currentPassword, newPassword } = validationResult.data
    
    // 檢查新密碼是否與目前密碼相同
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: '新密碼不能與目前密碼相同' },
        { status: 400 }
      )
    }
    
    // 取得管理員資料並驗證目前密碼
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
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: '目前密碼錯誤' },
        { status: 401 }
      )
    }
    
    // 加密新密碼
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)
    
    // 更新密碼
    await prisma.admin.update({
      where: { id: adminId },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })
    
    console.log('管理員密碼更新成功:', {
      adminId,
      username: admin.username,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(
      { 
        success: true, 
        message: '密碼更改成功'
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('更改密碼錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}