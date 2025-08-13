'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Button } from '@/components/ui'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  service: string
  company: string | null
  budget: string | null
  message: string
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth/verify')
      if (response.ok) {
        setAuthenticated(true)
        fetchContacts()
      } else {
        router.push('/manage-dashboard/login')
      }
    } catch (error) {
      console.error('認證檢查失敗:', error)
      router.push('/manage-dashboard/login')
    } finally {
      setAuthChecking(false)
    }
  }

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setContacts(data) // Prisma 已經按時間降序排列
      } else {
        setError('無法載入聯絡記錄')
      }
    } catch (error) {
      setError('網路連接錯誤')
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getServiceName = (service: string) => {
    const serviceMap: Record<string, string> = {
      'strategy': '企業策略規劃',
      'operations': '營運效率優化',
      'market': '市場拓展諮詢',
      'organization': '組織架構重組',
      'innovation': '創新轉型輔導',
      'finance': '財務規劃顧問'
    }
    return serviceMap[service] || service
  }

  const getBudgetText = (budget: string) => {
    const budgetMap: Record<string, string> = {
      'under-50k': '50萬以下',
      '50k-100k': '50萬 - 100萬',
      '100k-200k': '100萬 - 200萬',
      'over-200k': '200萬以上'
    }
    return budgetMap[budget] || budget || '未選擇'
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/manage-dashboard/login')
    } catch (error) {
      console.error('登出失敗:', error)
    }
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">驗證中...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">載入中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#1a202c] mb-2">聯絡表單管理</h1>
            <p className="text-gray-600">查看所有提交的聯絡表單</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
          >
            登出
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            總共 {contacts.length} 筆記錄
          </div>
          <button
            onClick={fetchContacts}
            className="px-4 py-2 bg-[#3182ce] text-white rounded-lg hover:bg-[#2c5aa0] transition-colors"
          >
            重新載入
          </button>
        </div>

        {contacts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">尚無聯絡表單提交記錄</div>
          </Card>
        ) : (
          <div className="space-y-6">
            {contacts.map((contact, index) => (
              <Card key={index} className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-[#1a202c]">
                        {contact.name}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatTimestamp(contact.createdAt)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">Email:</span>
                        <a 
                          href={`mailto:${contact.email}`}
                          className="text-sm text-[#3182ce] hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">電話:</span>
                        <a 
                          href={`tel:${contact.phone}`}
                          className="text-sm text-[#3182ce] hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">服務:</span>
                        <span className="text-sm text-gray-900">
                          {getServiceName(contact.service)}
                        </span>
                      </div>
                      
                      {contact.company && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">公司:</span>
                          <span className="text-sm text-gray-900">{contact.company}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">預算:</span>
                        <span className="text-sm text-gray-900">
                          {getBudgetText(contact.budget || '')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">詳細需求:</div>
                    <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {contact.message}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}