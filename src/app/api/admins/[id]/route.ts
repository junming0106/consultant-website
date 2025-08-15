import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateSessionToken } from '@/lib/auth'


export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 驗證 session 和 superadmin 權限
    const sessionToken = request.cookies.get('admin-session')?.value
    const adminInfo = sessionToken ? await validateSessionToken(sessionToken) : null
    
    if (!adminInfo) {
      return NextResponse.json(
        { error: '需要管理員權限' },
        { status: 401 }
      )
    }

    // 檢查是否為 superadmin
    if (adminInfo.role !== 'superadmin') {
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
    if (adminIdToDelete === adminInfo.id) {
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

    // 在刪除管理員之前，先處理所有相關的外鍵關係
    await prisma.$transaction(async (tx) => {
      // 將該管理員處理的聯絡人設為未分配
      await tx.contact.updateMany({
        where: { adminId: adminIdToDelete },
        data: { adminId: null }
      })
      
      // 將該管理員處理的潛在客戶設為未分配
      await tx.prospect.updateMany({
        where: { adminId: adminIdToDelete },
        data: { adminId: null }
      })
      
      // 檢查並刪除任何可能的活動日誌記錄 (如果存在)
      try {
        await tx.$executeRawUnsafe(`DELETE FROM admin_activity_logs WHERE "adminId" = $1`, adminIdToDelete)
      } catch (error) {
        // 如果表不存在，忽略錯誤
        console.log('admin_activity_logs 表不存在或已清理:', error)
      }
      
      // 最後刪除管理員
      await tx.admin.delete({
        where: { id: adminIdToDelete }
      })
    })

    console.log('管理員刪除成功:', {
      deletedAdminId: adminIdToDelete,
      deletedUsername: adminToDelete.username,
      deletedName: adminToDelete.name,
      contactsAffected: adminToDelete._count.contacts,
      prospectsAffected: adminToDelete._count.prospects,
      deletedBy: adminInfo.id,
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