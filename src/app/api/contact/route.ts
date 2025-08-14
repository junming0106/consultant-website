import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import xss from 'xss'
import { validateJwtToken } from '@/lib/auth'

// 定義輸入驗證架構
const contactSchema = z.object({
  name: z.string()
    .min(2, '姓名至少需要 2 個字元')
    .max(50, '姓名不能超過 50 個字元')
    .trim(),
  email: z.string()
    .email('電子郵件格式不正確')
    .max(100, '電子郵件不能超過 100 個字元')
    .trim(),
  phone: z.string()
    .min(8, '電話號碼至少需要 8 個字元')
    .max(20, '電話號碼不能超過 20 個字元')
    .regex(/^[\d\s\-\+\(\)]+$/, '電話號碼格式不正確')
    .trim(),
  service: z.enum(['strategy', 'operations', 'market', 'organization', 'innovation', 'finance'], {
    message: '請選擇有效的服務類型'
  }),
  company: z.string()
    .max(100, '公司名稱不能超過 100 個字元')
    .trim()
    .optional()
    .or(z.literal('')),
  budget: z.enum(['under-50k', '50k-100k', '100k-200k', 'over-200k'], {
    message: '請選擇有效的預算範圍'
  }).optional().or(z.literal('')),
  message: z.string()
    .min(10, '詳細需求至少需要 10 個字元')
    .max(2000, '詳細需求不能超過 2000 個字元')
    .trim()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 使用 Zod 驗證輸入資料
    const validationResult = contactSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map(issue => issue.message).join(', ')
      return NextResponse.json(
        { error: `輸入資料錯誤: ${errorMessages}` },
        { status: 400 }
      )
    }
    
    const validatedData = validationResult.data

    // 清理用戶輸入以防XSS攻擊
    const sanitizedData = {
      name: xss(validatedData.name),
      email: xss(validatedData.email), 
      phone: xss(validatedData.phone),
      service: validatedData.service, // 枚舉值已驗證，不需清理
      company: validatedData.company ? xss(validatedData.company) : null,
      budget: validatedData.budget || null, // 枚舉值已驗證，不需清理
      message: xss(validatedData.message),
    }

    // 使用 Prisma 儲存已驗證和清理的資料到資料庫
    const contact = await prisma.contact.create({
      data: sanitizedData
    })

    console.log('新的聯絡表單提交成功', { 
      timestamp: new Date().toISOString(),
      recordId: contact.id,
      service: contact.service
    })

    return NextResponse.json(
      { 
        success: true, 
        message: '感謝您的聯絡！我們將盡快回覆您。'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API 錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤，請稍後再試' },
      { status: 500 }
    )
  }
}

// 取得所有聯絡記錄（管理用）
export async function GET(request: NextRequest) {
  try {
    // 驗證管理員權限
    const sessionToken = request.cookies.get('admin-session')?.value
    const adminId = sessionToken ? validateJwtToken(sessionToken) : null
    
    if (!adminId) {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401 }
      )
    }

    // 從資料庫取得所有聯絡記錄，按創建時間降序排列，包含管理員資訊
    const contacts = await prisma.contact.findMany({
      include: {
        admin: {
          select: {
            id: true,
            username: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('讀取聯絡記錄錯誤:', error)
    return NextResponse.json(
      { error: '無法讀取資料' },
      { status: 500 }
    )
  }
}

