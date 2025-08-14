import { NextRequest, NextResponse } from 'next/server'
import { validateSessionToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('admin-session')?.value
    
    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
    
    // 驗證 token 格式和時效性，並取得管理員資訊
    const adminInfo = await validateSessionToken(sessionToken)
    
    if (adminInfo) {
      return NextResponse.json(
        { 
          authenticated: true,
          admin: adminInfo
        },
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

