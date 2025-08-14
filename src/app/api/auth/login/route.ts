import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json(
        { error: '請輸入帳號和密碼' },
        { status: 400 }
      )
    }
    
    // 從資料庫查詢管理員
    const admin = await prisma.admin.findUnique({
      where: { username }
    })
    
    if (!admin) {
      return NextResponse.json(
        { error: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }
    
    // 驗證密碼（在實際生產環境中應該使用加密密碼比對）
    if (password === admin.password) {
      // 建立 session token，包含管理員 ID
      const sessionToken = generateSessionToken(admin.id, admin.username)
      
      // 設定 cookie
      const response = NextResponse.json(
        { 
          success: true, 
          message: '登入成功',
          admin: {
            id: admin.id,
            username: admin.username,
            name: admin.name
          }
        },
        { status: 200 }
      )
      
      // 設定 HTTP-only cookie，有效期 24 小時
      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 小時
      })
      
      return response
    } else {
      return NextResponse.json(
        { error: '帳號或密碼錯誤' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('登入錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}

// 加密安全的 session token 生成器
function generateSessionToken(adminId: number, username: string): string {
  const timestamp = Date.now().toString()
  const randomPart = randomBytes(32).toString('hex')
  return `admin_${adminId}_${username}_${timestamp}_${randomPart}`
}