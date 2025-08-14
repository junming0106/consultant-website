"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card } from "@/components/ui";

interface Admin {
  id: number;
  username: string;
  name: string;
  passwordStatus: string;
  isEncrypted: boolean;
  passwordLength: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    contacts: number;
    prospects: number;
  };
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordDetails, setShowPasswordDetails] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState<number | null>(null);
  const [resettingAdminId, setResettingAdminId] = useState<number | null>(null);
  const [resetPasswordResult, setResetPasswordResult] = useState<{adminId: number, newPassword: string} | null>(null);
  const router = useRouter();

  const checkAuthAndFetchAdmins = useCallback(async () => {
    try {
      // 先驗證權限
      const authResponse = await fetch("/api/auth/verify");
      if (!authResponse.ok) {
        router.push("/manage-dashboard/login");
        return;
      }

      const authData = await authResponse.json();

      // 檢查是否為 superadmin
      if (authData.admin?.username !== "superadmin") {
        setError("只有超級管理員可以查看管理員列表");
        setLoading(false);
        return;
      }

      // 獲取管理員列表
      const adminsResponse = await fetch("/api/admins");
      if (adminsResponse.ok) {
        const data = await adminsResponse.json();
        setAdmins(data);
      } else {
        const errorData = await adminsResponse.json();
        setError(errorData.error || "無法載入管理員列表");
      }
    } catch (error) {
      console.error("載入管理員列表錯誤:", error);
      setError("網路連接錯誤");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndFetchAdmins();
  }, [checkAuthAndFetchAdmins]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleResetPassword = async (
    adminId: number,
    adminName: string,
    username: string
  ) => {
    // 確認對話框
    const confirmMessage = `確定要重置管理員「${adminName} (${username})」的密碼嗎？\n\n注意：\n- 將生成新的隨機密碼\n- 該管理員需要使用新密碼重新登入\n- 新密碼僅顯示一次，請妥善記錄`

    if (!confirm(confirmMessage)) {
      return;
    }

    setResettingAdminId(adminId);
    setError("");
    setSuccess("");
    setResetPasswordResult(null);

    try {
      const response = await fetch(`/api/admins/${adminId}/reset-password`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setResetPasswordResult({
          adminId: adminId,
          newPassword: data.newPassword
        });
        setSuccess(`管理員「${adminName}」密碼重置成功！`);

        // 重新載入管理員列表
        checkAuthAndFetchAdmins();

        // 10秒後清除密碼顯示
        setTimeout(() => {
          setResetPasswordResult(null);
          setSuccess("");
        }, 10000);
      } else {
        setError(data.error || "重置密碼失敗");
      }
    } catch (error) {
      console.error("重置密碼錯誤:", error);
      setError("網路連接錯誤");
    } finally {
      setResettingAdminId(null);
    }
  };

  const handleDeleteAdmin = async (
    adminId: number,
    adminName: string,
    username: string
  ) => {
    // 確認對話框
    const confirmMessage = `確定要刪除管理員「${adminName} (${username})」嗎？\n\n注意：\n- 此操作無法復原\n- 該管理員處理的聯絡人和潛在客戶將變為未分配狀態\n- 如果您確定要繼續，請點擊「確定」`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setDeletingAdminId(adminId);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          `管理員「${adminName}」刪除成功！${
            data.affectedRecords.contacts > 0 ||
            data.affectedRecords.prospects > 0
              ? `已將 ${data.affectedRecords.contacts} 個聯絡人和 ${data.affectedRecords.prospects} 個潛在客戶設為未分配。`
              : ""
          }`
        );

        // 重新載入管理員列表
        checkAuthAndFetchAdmins();

        // 3秒後清除成功訊息
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || "刪除管理員失敗");
      }
    } catch (error) {
      console.error("刪除管理員錯誤:", error);
      setError("網路連接錯誤");
    } finally {
      setDeletingAdminId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1a202c] mb-2">
              管理員列表
            </h1>
            <p className="text-gray-600">查看和管理所有系統管理員</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowPasswordDetails(!showPasswordDetails)}
              variant={showPasswordDetails ? "primary" : "secondary"}
              size="sm">
              {showPasswordDetails ? "隱藏密碼詳情" : "顯示密碼詳情"}
            </Button>
            <Button
              onClick={() => router.push("/manage-dashboard")}
              variant="secondary"
              size="sm">
              ← 回到管理面板
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </motion.div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => (
            <motion.div
              key={admin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1a202c]">
                        {admin.name}
                      </h3>
                      <p className="text-sm text-gray-600">@{admin.username}</p>
                    </div>
                    <span className="text-xs bg-[#3182ce] text-white px-2 py-1 rounded-full">
                      ID: {admin.id}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">密碼狀態:</span>
                      <span className={`font-mono ${admin.isEncrypted ? 'text-green-600' : 'text-red-600'}`}>
                        {admin.passwordStatus}
                      </span>
                    </div>

                    {showPasswordDetails && (
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700">
                          密碼長度:
                        </span>
                        <span className="text-gray-900">
                          {admin.passwordLength} 字元
                        </span>
                      </div>
                    )}

                    {/* 顯示重置後的新密碼 */}
                    {resetPasswordResult && resetPasswordResult.adminId === admin.id && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm font-medium text-yellow-800 mb-1">
                          🔑 新密碼 (僅顯示一次)
                        </div>
                        <div className="font-mono text-lg text-yellow-900 bg-yellow-100 p-2 rounded border select-all">
                          {resetPasswordResult.newPassword}
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">
                          請複製並安全保存此密碼，10秒後自動隱藏
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        處理聯絡人:
                      </span>
                      <span className="text-[#3182ce] font-medium">
                        {admin._count.contacts} 個
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        處理潛在客戶:
                      </span>
                      <span className="text-[#3182ce] font-medium">
                        {admin._count.prospects} 個
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="space-y-1 text-xs text-gray-500">
                      <div>建立時間: {formatDate(admin.createdAt)}</div>
                      <div>最後更新: {formatDate(admin.updatedAt)}</div>
                    </div>

                    {/* 管理按鈕 - 不能操作自己(superadmin) */}
                    {admin.username !== "superadmin" && (
                      <div className="space-y-2">
                        <Button
                          onClick={() =>
                            handleResetPassword(
                              admin.id,
                              admin.name,
                              admin.username
                            )
                          }
                          variant="secondary"
                          size="sm"
                          className="w-full text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-blue-200"
                          disabled={resettingAdminId === admin.id}>
                          {resettingAdminId === admin.id
                            ? "重置中..."
                            : "🔄 重置密碼"}
                        </Button>
                        
                        <Button
                          onClick={() =>
                            handleDeleteAdmin(
                              admin.id,
                              admin.name,
                              admin.username
                            )
                          }
                          variant="secondary"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200"
                          disabled={deletingAdminId === admin.id}>
                          {deletingAdminId === admin.id
                            ? "刪除中..."
                            : "🗑️ 刪除管理員"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {admins.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <div className="text-gray-500">尚無管理員資料</div>
          </Card>
        )}

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            🔒 密碼安全說明
          </h3>
          <p className="text-sm text-blue-700">
            系統使用 bcrypt 加密儲存密碼，無法還原為原始密碼。這是業界標準的安全做法。
            如需重設管理員密碼，請使用「註冊新管理員」功能或要求管理員自行修改密碼。
          </p>
        </div>
      </div>
    </div>
  );
}
