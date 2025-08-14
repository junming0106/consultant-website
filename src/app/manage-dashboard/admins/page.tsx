"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Card } from "@/components/ui";

interface Admin {
  id: number;
  username: string;
  name: string;
  password: string;
  actualPassword: string;
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
  const [showPasswords, setShowPasswords] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState<number | null>(null);
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
              onClick={() => setShowPasswords(!showPasswords)}
              variant={showPasswords ? "primary" : "secondary"}
              size="sm">
              {showPasswords ? "隱藏密碼" : "顯示密碼"}
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
                      <span className="font-medium text-gray-700">密碼:</span>
                      <span className="font-mono text-gray-900">
                        {showPasswords ? admin.actualPassword : admin.password}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        密碼長度:
                      </span>
                      <span className="text-gray-900">
                        {admin.passwordLength} 字元
                      </span>
                    </div>

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

                    {/* 刪除按鈕 - 不能刪除自己(superadmin) */}
                    {admin.username !== "superadmin" && (
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
                          : "刪除管理員"}
                      </Button>
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

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            🔒 安全提醒
          </h3>
          <p className="text-sm text-yellow-700">
            此頁面顯示系統中所有管理員的詳細資訊，包括實際密碼。請妥善保管這些資訊，避免洩露給未授權人員。
            建議定期更新管理員密碼以維護系統安全。
          </p>
        </div>
      </div>
    </div>
  );
}
