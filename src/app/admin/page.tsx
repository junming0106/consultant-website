'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // 重導向到新的管理路徑
    router.replace('/manage-dashboard/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-lg text-gray-600 mb-4">重導向中...</div>
        <div className="w-8 h-8 border-4 border-[#3182ce] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}