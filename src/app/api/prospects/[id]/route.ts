import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateProspectSchema = z.object({
  status: z.enum(['prospect', 'contacted', 'converted']).optional(),
  notes: z.string().optional()
})

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const prospectId = parseInt(params.id)
    
    if (isNaN(prospectId)) {
      return NextResponse.json(
        { error: '無效的潛在客戶ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validationResult = updateProspectSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: '無效的更新資料', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { status, notes } = validationResult.data

    const updatedProspect = await prisma.prospect.update({
      where: { id: prospectId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date()
      }
    })

    console.log('潛在客戶狀態已更新:', {
      id: prospectId,
      status: status || '未變更',
      notes: notes || '無備註'
    })

    return NextResponse.json(updatedProspect)

  } catch (error: unknown) {
    console.error('更新潛在客戶錯誤:', error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: '找不到該潛在客戶' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const prospectId = parseInt(params.id)
    
    if (isNaN(prospectId)) {
      return NextResponse.json(
        { error: '無效的潛在客戶ID' },
        { status: 400 }
      )
    }

    await prisma.prospect.delete({
      where: { id: prospectId }
    })

    console.log('潛在客戶已刪除:', prospectId)

    return NextResponse.json({ success: true })

  } catch (error: unknown) {
    console.error('刪除潛在客戶錯誤:', error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: '找不到該潛在客戶' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}