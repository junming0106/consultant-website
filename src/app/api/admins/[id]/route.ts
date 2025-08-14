import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 從 session token 取得管理員資訊
function getAdminInfoFromToken(token: string): { adminId: number; username: string } | null {
  if (!token.startsWith('admin_')) {
    return null
  }
  
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
    
    return { adminId, username }
  } catch {
    return null
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 驗證 session 和 superadmin 權限
    const sessionToken = request.cookies.get('admin-session')?.value
    const adminInfo = sessionToken ? getAdminInfoFromToken(sessionToken) : null
    
    if (!adminInfo) {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401 }
      )
    }

    // 檢查是否為 superadmin
    if (adminInfo.username !== 'superadmin') {
      return NextResponse.json(
        { error: '只有超級管理員可以刪除管理員' },
        { status: 403 }
      )
    }

    const params = await context.params
    const adminIdToDelete = parseInt(params.id)
    
    if (isNaN(adminIdToDelete)) {
      return NextResponse.json(
        { error: '無效的管理員ID' },
        { status: 400 }
      )
    }

    // 防止刪除自己
    if (adminIdToDelete === adminInfo.adminId) {
      return NextResponse.json(
        { error: '不能刪除自己的帳號' },
        { status: 400 }
      )
    }

    // 檢查要刪除的管理員是否存在
    const adminToDelete = await prisma.admin.findUnique({
      where: { id: adminIdToDelete },
      include: {
        _count: {
          select: {
            contacts: true,
            prospects: true
          }
        }
      }
    })

    if (!adminToDelete) {
      return NextResponse.json(
        { error: '管理員不存在' },
        { status: 404 }
      )
    }

    // 在刪除管理員之前，先將該管理員處理的聯絡人和潛在客戶的 adminId 設為 null
    await prisma.$transaction([
      // 將該管理員處理的聯絡人設為未分配
      prisma.contact.updateMany({
        where: { adminId: adminIdToDelete },
        data: { adminId: null }
      }),
      // 將該管理員處理的潛在客戶設為未分配
      prisma.prospect.updateMany({
        where: { adminId: adminIdToDelete },
        data: { adminId: null }
      }),
      // 刪除管理員
      prisma.admin.delete({
        where: { id: adminIdToDelete }
      })
    ])

    console.log('管理員刪除成功:', {
      deletedAdminId: adminIdToDelete,
      deletedUsername: adminToDelete.username,
      deletedName: adminToDelete.name,
      contactsAffected: adminToDelete._count.contacts,
      prospectsAffected: adminToDelete._count.prospects,
      deletedBy: adminInfo.adminId,
      deletedByUsername: adminInfo.username,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      { 
        success: true, 
        message: '管理員刪除成功',
        deletedAdmin: {
          id: adminToDelete.id,
          username: adminToDelete.username,
          name: adminToDelete.name
        },
        affectedRecords: {
          contacts: adminToDelete._count.contacts,
          prospects: adminToDelete._count.prospects
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('刪除管理員錯誤:', error)
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    )
  }
}