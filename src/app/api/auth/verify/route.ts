import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
    
    // 簡易驗證：檢查 token 格式和時效性
    const isValid = validateSessionToken(sessionToken)
    
    if (isValid) {
      return NextResponse.json(
        { authenticated: true },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('驗證錯誤:', error)
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    )
  }
}

// 驗證 session token
function validateSessionToken(token: string): boolean {
  if (!token.startsWith('admin_')) {
    return false
  }
  
  try {
    const parts = token.split('_')
    if (parts.length !== 3) {
      return false
    }
    
    const timestamp = parseInt(parts[1])
    const now = Date.now()
    
    // 檢查是否在 24 小時內
    const twentyFourHours = 24 * 60 * 60 * 1000
    return (now - timestamp) < twentyFourHours
  } catch {
    return false
  }
}