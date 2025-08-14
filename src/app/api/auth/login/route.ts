import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
    
    // 驗證加密密碼
    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (isPasswordValid) {
      // 建立 JWT token
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'
      const token = jwt.sign(
        { 
          adminId: admin.id,
          username: admin.username
        },
        jwtSecret,
        { 
          expiresIn: '24h',
          issuer: 'consultant-website'
        }
      )
      
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
      response.cookies.set('admin-session', token, {
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

