import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

// JWT 密鑰
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production'

export interface AdminInfo {
  id: number
  username: string
  name: string
  role: string
  createdAt: Date
}

// 驗證 JWT token 或舊格式 token，並取得管理員資訊
export async function validateSessionToken(token: string): Promise<AdminInfo | null> {
  // 嘗試 JWT 格式
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'consultant-website'
    }) as jwt.JwtPayload
    
    if (decoded && typeof decoded.adminId === 'number') {
      // 從資料庫取得管理員資訊
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.adminId },
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          createdAt: true
        }
      })
      
      return admin
    }
  } catch {
    // JWT 驗證失敗，嘗試舊格式
  }

  // 嘗試舊格式 token（向後相容）
  if (token.startsWith('admin_')) {
    try {
      const parts = token.split('_')
      if (parts.length !== 5) {
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
          role: true,
          createdAt: true
        }
      })
      
      if (admin && admin.username === username) {
        return admin
      }
    } catch {
      // 舊格式解析失敗
    }
  }

  return null
}

// 僅驗證 JWT token 並返回管理員 ID（不查詢資料庫）
export function validateJwtToken(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'consultant-website'
    }) as jwt.JwtPayload
    
    if (decoded && typeof decoded.adminId === 'number') {
      return decoded.adminId
    }
    
    return null
  } catch {
    // 嘗試舊格式（向後相容）
    if (token.startsWith('admin_')) {
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
    
    return null
  }
}