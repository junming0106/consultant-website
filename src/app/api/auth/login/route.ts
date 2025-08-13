import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // 從環境變數取得管理密碼
    const adminPassword = process.env.ADMIN_PASSWORD
    
    // 確保管理密碼已設定且符合最低安全要求
    if (!adminPassword || adminPassword.length < 8) {
      console.error('ADMIN_PASSWORD 未設定或過短，至少需要 8 個字元')
      return NextResponse.json(
        { error: '伺服器配置錯誤' },
        { status: 500 }
      )
    }
    
    if (password === adminPassword) {
      // 建立 session token（簡易版本）
      const sessionToken = generateSessionToken()
      
      // 設定 cookie
      const response = NextResponse.json(
        { success: true, message: '登入成功' },
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
        { error: '密碼錯誤' },
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
function generateSessionToken(): string {
  const timestamp = Date.now().toString()
  const randomPart = randomBytes(32).toString('hex')
  return `admin_${timestamp}_${randomPart}`
}