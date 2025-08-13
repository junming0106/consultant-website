import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: '已成功登出' },
      { status: 200 }
    )
    
    // 清除 admin-session cookie
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // 立即過期
    })
    
    return response
  } catch (error) {
    console.error('登出錯誤:', error)
    return NextResponse.json(
      { error: '登出失敗' },
      { status: 500 }
    )
  }
}