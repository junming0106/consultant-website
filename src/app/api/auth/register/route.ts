import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// 定義註冊表單驗證 schema
const registerSchema = z.object({
  username: z.string().min(3, '帳號至少需要3個字元').max(50, '帳號不能超過50個字元'),
  password: z.string().min(6, '密碼至少需要6個字元').max(100, '密碼不能超過100個字元'),
  name: z.string().min(1, '請輸入姓名').max(100, '姓名不能超過100個字元'),
  adminPassword: z.string().min(1, '請輸入管理員密碼進行驗證'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 驗證輸入資料
    const validationResult = registerSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => issue.message).join(', ')
      return NextResponse.json(
        { error: errors },
        { status: 400 }
      )
    }
    
    const { username, password, name, adminPassword } = validationResult.data
    
    // 驗證管理員密碼 - 只有 superadmin 可以註冊新管理員
    const validAdmin = await prisma.admin.findFirst({
      where: { 
        password: adminPassword,
        username: 'superadmin' // 只有 superadmin 可以註冊新管理員
      }
    })
    
    if (!validAdmin) {
      return NextResponse.json(
        { error: '只有超級管理員可以註冊新管理員' },
        { status: 403 }
      )
    }
    
    // 檢查帳號是否已存在
    const existingAdmin = await prisma.admin.findUnique({
      where: { username }
    })
    
    if (existingAdmin) {
      return NextResponse.json(
        { error: '帳號已存在' },
        { status: 409 }
      )
    }
    
    // 建立新管理員
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password, // 在實際生產環境中應該加密密碼
        name,
      },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
      }
    })
    
    console.log('新管理員建立成功:', newAdmin)
    
    return NextResponse.json(
      { 
        success: true, 
        message: '管理員註冊成功',
        admin: newAdmin
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('註冊管理員錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}