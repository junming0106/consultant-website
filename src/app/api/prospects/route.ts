import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProspectSchema = z.object({
  phone: z.string()
    .min(1, '電話號碼不能為空')
    .max(20, '電話號碼過長')
    .regex(/^[\d\-\+\(\)\s]+$/, '電話號碼格式不正確')
})

export async function GET() {
  try {
    const prospects = await prisma.prospect.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(prospects)
    
  } catch (error) {
    console.error('獲取潛在客戶列表錯誤:', error)
    return NextResponse.json(
      { error: '無法載入潛在客戶列表' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validationResult = createProspectSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: '輸入資料無效', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { phone } = validationResult.data

    // 檢查電話號碼是否已存在
    const existingProspect = await prisma.prospect.findFirst({
      where: { phone }
    })

    if (existingProspect) {
      return NextResponse.json(
        { error: '此電話號碼已存在於潛在客戶列表中' },
        { status: 409 }
      )
    }

    const prospect = await prisma.prospect.create({
      data: { phone }
    })

    console.log('新潛在客戶已建立:', {
      id: prospect.id,
      phone: prospect.phone
    })

    return NextResponse.json(prospect, { status: 201 })

  } catch (error) {
    console.error('建立潛在客戶錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}