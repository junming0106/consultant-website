import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateContactSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed']),
  notes: z.string().optional()
})

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const contactId = parseInt(params.id)
    
    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: '無效的聯絡人ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validationResult = updateContactSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: '無效的更新資料', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { status, notes } = validationResult.data

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        status,
        notes,
        updatedAt: new Date()
      }
    })

    console.log('聯絡人狀態已更新:', {
      id: contactId,
      status,
      notes: notes || '無備註'
    })

    return NextResponse.json(updatedContact)

  } catch (error: unknown) {
    console.error('更新聯絡人錯誤:', error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: '找不到該聯絡人' },
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
    const contactId = parseInt(params.id)
    
    if (isNaN(contactId)) {
      return NextResponse.json(
        { error: '無效的聯絡人ID' },
        { status: 400 }
      )
    }

    await prisma.contact.delete({
      where: { id: contactId }
    })

    console.log('聯絡人已刪除:', contactId)

    return NextResponse.json({ success: true })

  } catch (error: unknown) {
    console.error('刪除聯絡人錯誤:', error)
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: '找不到該聯絡人' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}