'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Input, Card } from '@/components/ui'

interface Admin {
  id: number;
  username: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function SettingsPage() {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  
  // 帳號資訊表單狀態
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [profilePassword, setProfilePassword] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  
  // 密碼更改表單狀態
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  
  const router = useRouter()

  const checkAuthentication = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/verify')
      if (response.ok) {
        const data = await response.json()
        setCurrentAdmin(data.admin)
        setUsername(data.admin.username)
        setName(data.admin.name)
      } else {
        router.push('/manage-dashboard/login')
      }
    } catch (error) {
      console.error('認證檢查失敗:', error)
      router.push('/manage-dashboard/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuthentication()
  }, [checkAuthentication])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          name,
          currentPassword: profilePassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setProfileSuccess('帳號資訊更新成功！')
        setCurrentAdmin(data.admin)
        setProfilePassword('')
        // 3秒後清除成功訊息
        setTimeout(() => setProfileSuccess(''), 3000)
      } else {
        setProfileError(data.error || '更新失敗')
      }
    } catch (error) {
      console.error('更新帳號資訊錯誤:', error)
      setProfileError('網路連接錯誤')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess('')

    // 檢查新密碼與確認密碼是否一致
    if (newPassword !== confirmPassword) {
      setPasswordError('新密碼與確認密碼不一致')
      setPasswordLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess('密碼更改成功！')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        // 3秒後清除成功訊息
        setTimeout(() => setPasswordSuccess(''), 3000)
      } else {
        setPasswordError(data.error || '密碼更改失敗')
      }
    } catch (error) {
      console.error('更改密碼錯誤:', error)
      setPasswordError('網路連接錯誤')
    } finally {
      setPasswordLoading(false)
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1a202c] mb-2">
              帳號設定
            </h1>
            {currentAdmin && (
              <p className="text-gray-600">
                管理 {currentAdmin.name} ({currentAdmin.username}) 的帳號設定
              </p>
            )}
          </div>
          <Button
            onClick={() => router.push('/manage-dashboard')}
            variant="secondary"
            size="sm"
          >
            ← 回到管理面板
          </Button>
        </div>

        {/* 分頁選單 */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? "border-[#3182ce] text-[#3182ce]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              帳號資訊
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'password'
                  ? "border-[#3182ce] text-[#3182ce]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              變更密碼
            </button>
          </nav>
        </div>

        {/* 帳號資訊分頁 */}
        {activeTab === 'profile' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[#1a202c] mb-6">
              更新帳號資訊
            </h2>

            {profileError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {profileError}
              </motion.div>
            )}

            {profileSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
              >
                {profileSuccess}
              </motion.div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <Input
                type="text"
                label="帳號名稱"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={profileLoading}
                placeholder="輸入新的帳號名稱"
              />

              <Input
                type="text"
                label="顯示姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={profileLoading}
                placeholder="輸入顯示姓名"
              />

              <Input
                type="password"
                label="確認密碼"
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                required
                disabled={profileLoading}
                placeholder="輸入目前密碼以確認變更"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={profileLoading || !username.trim() || !name.trim() || !profilePassword.trim()}
              >
                {profileLoading ? '更新中...' : '更新帳號資訊'}
              </Button>
            </form>
          </Card>
        )}

        {/* 變更密碼分頁 */}
        {activeTab === 'password' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[#1a202c] mb-6">
              變更密碼
            </h2>

            {passwordError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                {passwordError}
              </motion.div>
            )}

            {passwordSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
              >
                {passwordSuccess}
              </motion.div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <Input
                type="password"
                label="目前密碼"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={passwordLoading}
                placeholder="輸入目前密碼"
              />

              <Input
                type="password"
                label="新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={passwordLoading}
                placeholder="輸入新密碼 (至少6個字元)"
              />

              <Input
                type="password"
                label="確認新密碼"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={passwordLoading}
                placeholder="再次輸入新密碼"
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={passwordLoading || !currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()}
              >
                {passwordLoading ? '變更中...' : '變更密碼'}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}