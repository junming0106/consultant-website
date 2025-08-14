'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Input } from '@/components/ui'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, adminPassword })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('管理員註冊成功！即將跳轉至管理頁面...')
        setTimeout(() => {
          router.push('/manage-dashboard')
        }, 2000)
      } else {
        setError(data.error || '註冊失敗')
      }
    } catch (error) {
      console.error('註冊錯誤:', error)
      setError('網路連接錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a365d] to-[#3182ce] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a202c] mb-2">
            註冊管理員
          </h1>
          <p className="text-gray-600">
            建立新的管理員帳號（需要現有管理員密碼驗證）
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <Input
            type="text"
            label="帳號"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            placeholder="輸入帳號 (至少3個字元)"
          />

          <Input
            type="password"
            label="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="輸入密碼 (至少6個字元)"
          />

          <Input
            type="text"
            label="姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            placeholder="輸入管理員姓名"
          />

          <Input
            type="password"
            label="管理員密碼"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
            disabled={isLoading}
            placeholder="輸入現有管理員密碼進行驗證"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading || !username.trim() || !password.trim() || !name.trim() || !adminPassword.trim()}
          >
            {isLoading ? '註冊中...' : '註冊'}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <div>
            <button
              onClick={() => router.push('/manage-dashboard')}
              className="text-[#3182ce] hover:text-[#2c5aa0] text-sm transition-colors"
            >
              ← 返回管理頁面
            </button>
          </div>
          <div>
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              回到首頁
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}