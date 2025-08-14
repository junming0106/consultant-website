import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

interface AdminInfo {
  id: number;
  username: string;
  name: string;
  createdAt: Date;
}

// 驗證 session token 並取得管理員資訊
async function validateSessionToken(token: string): Promise<AdminInfo | null> {
  if (!token.startsWith('admin_')) {
    return null
  }
  
  try {
    const parts = token.split('_')
    if (parts.length !== 5) { // admin_id_username_timestamp_randompart
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
    
    // 從資料庫取得管理員資訊
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true
      }
    })
    
    if (admin && admin.username === username) {
      return admin
    }
    
    return null
  } catch {
    return null
  }
}