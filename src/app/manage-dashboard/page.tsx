"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Textarea } from "@/components/ui";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  company: string | null;
  budget: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  admin?: {
    id: number;
    username: string;
    name: string;
  } | null;
}

interface Prospect {
  id: number;
  phone: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  admin?: {
    id: number;
    username: string;
    name: string;
  } | null;
}

export default function AdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [activeTab, setActiveTab] = useState<"contacts" | "prospects">(
    "contacts"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authChecking, setAuthChecking] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<{
    id: number;
    username: string;
    name: string;
    role: string;
  } | null>(null);
  const router = useRouter();

  const checkAuthentication = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/verify");
      if (response.ok) {
        const data = await response.json();
        setCurrentAdmin(data.admin);
        fetchContacts();
        fetchProspects();
      } else {
        router.push("/manage-dashboard/login");
      }
    } catch (error) {
      console.error("認證檢查失敗:", error);
      router.push("/manage-dashboard/login");
    } finally {
      setAuthChecking(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        setContacts(data); // Prisma 已經按時間降序排列
      } else {
        setError("無法載入聯絡記錄");
      }
    } catch {
      setError("網路連接錯誤");
    } finally {
      setLoading(false);
    }
  };

  const fetchProspects = async () => {
    try {
      const response = await fetch("/api/prospects");
      if (response.ok) {
        const data = await response.json();
        setProspects(data);
      } else {
        console.error("無法載入潛在客戶");
      }
    } catch (err) {
      console.error("載入潛在客戶網路錯誤:", err);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getServiceName = (service: string) => {
    const serviceMap: Record<string, string> = {
      strategy: "企業策略規劃",
      operations: "營運效率優化",
      market: "市場拓展諮詢",
      organization: "組織架構重組",
      innovation: "創新轉型輔導",
      finance: "財務規劃顧問",
    };
    return serviceMap[service] || service;
  };

  const getBudgetText = (budget: string) => {
    const budgetMap: Record<string, string> = {
      "under-50k": "50萬以下",
      "50k-100k": "50萬 - 100萬",
      "100k-200k": "100萬 - 200萬",
      "over-200k": "200萬以上",
    };
    return budgetMap[budget] || budget || "未選擇";
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      new: "新客戶",
      contacted: "已聯絡",
      qualified: "已評估",
      closed: "已結案",
      prospect: "潛在客戶",
      converted: "已轉換",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      qualified: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
      prospect: "bg-purple-100 text-purple-800",
      converted: "bg-green-100 text-green-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  const updateContactStatus = async (
    id: number,
    status: string,
    notes?: string
  ) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        fetchContacts();
      } else {
        setError("更新狀態失敗");
      }
    } catch {
      setError("網路錯誤");
    }
  };

  const updateProspectStatus = async (
    id: number,
    status: string,
    notes?: string
  ) => {
    try {
      const response = await fetch(`/api/prospects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });

      if (response.ok) {
        fetchProspects();
      } else {
        console.error("更新潛在客戶狀態失敗");
      }
    } catch (err) {
      console.error("網路錯誤", err);
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm("確定要刪除此聯絡人嗎？")) return;

    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchContacts();
      } else {
        setError("刪除失敗");
      }
    } catch {
      setError("網路錯誤");
    }
  };

  const deleteProspect = async (id: number) => {
    if (!confirm("確定要刪除此潛在客戶嗎？")) return;

    try {
      const response = await fetch(`/api/prospects/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProspects();
      } else {
        console.error("刪除潛在客戶失敗");
      }
    } catch (err) {
      console.error("網路錯誤", err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/manage-dashboard/login");
    } catch (err) {
      console.error("登出失敗:", err);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">驗證中...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#1a202c] mb-2">
              客戶管理系統
            </h1>
            <p className="text-gray-600">管理正式客戶和潛在客戶</p>
            {currentAdmin && (
              <p className="text-sm text-[#3182ce] mt-1">
                歡迎，{currentAdmin.name} ({currentAdmin.username})
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {currentAdmin?.role === 'superadmin' && (
              <>
                <Button 
                  onClick={() => router.push('/manage-dashboard/admins')}
                  variant="secondary" 
                  size="sm"
                >
                  管理員列表
                </Button>
                <Button 
                  onClick={() => router.push('/manage-dashboard/register')}
                  variant="secondary" 
                  size="sm"
                >
                  註冊管理員
                </Button>
              </>
            )}
            <Button 
              onClick={() => router.push('/manage-dashboard/settings')}
              variant="secondary" 
              size="sm"
            >
              帳號設定
            </Button>
            <Button onClick={handleLogout} variant="secondary" size="sm">
              登出
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "contacts"
                  ? "border-[#3182ce] text-[#3182ce]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              正式客戶 ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab("prospects")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "prospects"
                  ? "border-[#3182ce] text-[#3182ce]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              潛在客戶 ({prospects.length})
            </button>
          </nav>
        </div>

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              fetchContacts();
              fetchProspects();
            }}
            className="px-4 py-2 bg-[#3182ce] text-white rounded-lg hover:bg-[#2c5aa0] transition-colors">
            重新載入
          </button>
        </div>

        {activeTab === "contacts" ? (
          contacts.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-gray-500">尚無正式客戶記錄</div>
            </Card>
          ) : (
            <div className="space-y-6">
              {contacts.map((contact) => (
                <Card key={contact.id} className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
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
                          <span className="text-sm font-medium text-gray-700">
                            Email:
                          </span>
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-sm text-[#3182ce] hover:underline">
                            {contact.email}
                          </a>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            電話:
                          </span>
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-sm text-[#3182ce] hover:underline">
                            {contact.phone}
                          </a>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            服務:
                          </span>
                          <span className="text-sm text-gray-900">
                            {getServiceName(contact.service)}
                          </span>
                        </div>

                        {contact.company && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">
                              公司:
                            </span>
                            <span className="text-sm text-gray-900">
                              {contact.company}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            預算:
                          </span>
                          <span className="text-sm text-gray-900">
                            {getBudgetText(contact.budget || "")}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            狀態:
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              contact.status
                            )}`}>
                            {getStatusText(contact.status)}
                          </span>
                        </div>

                        {contact.admin && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">
                              處理人員:
                            </span>
                            <span className="text-sm text-[#3182ce]">
                              {contact.admin.name} ({contact.admin.username})
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          詳細需求:
                        </div>
                        <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {contact.message}
                        </div>
                      </div>

                      {contact.notes && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-2">
                            備註:
                          </div>
                          <div className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg">
                            {contact.notes}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          更新狀態
                        </label>
                        <select
                          value={contact.status}
                          onChange={(e) =>
                            updateContactStatus(
                              contact.id,
                              e.target.value,
                              contact.notes || undefined
                            )
                          }
                          className="w-full px-3 py-2 border text-gray-900 border-gray-300 rounded-lg text-sm">
                          <option value="new">新客戶</option>
                          <option value="contacted">已聯絡</option>
                          <option value="qualified">已評估</option>
                          <option value="closed">已結案</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          備註
                        </label>
                        <Textarea
                          value={contact.notes || ""}
                          onChange={(e) => {
                            const updatedContacts = contacts.map((c) =>
                              c.id === contact.id
                                ? { ...c, notes: e.target.value }
                                : c
                            );
                            setContacts(updatedContacts);
                          }}
                          onBlur={() =>
                            updateContactStatus(
                              contact.id,
                              contact.status,
                              contact.notes || undefined
                            )
                          }
                          placeholder="添加備註..."
                          rows={3}
                          className="w-full text-sm"
                        />
                      </div>

                      <Button
                        onClick={() => deleteContact(contact.id)}
                        variant="secondary"
                        size="sm"
                        className="w-full text-red-600 hover:text-red-800">
                        刪除客戶
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : prospects.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-500">尚無潛在客戶記錄</div>
          </Card>
        ) : (
          <div className="space-y-4">
            {prospects.map((prospect) => (
              <Card key={prospect.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <a
                      href={`tel:${prospect.phone}`}
                      className="text-lg font-medium text-[#3182ce] hover:underline">
                      {prospect.phone}
                    </a>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        prospect.status
                      )}`}>
                      {getStatusText(prospect.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(prospect.createdAt)}
                    </span>
                    {prospect.admin && (
                      <span className="text-xs text-[#3182ce]">
                        處理人: {prospect.admin.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={prospect.status}
                      onChange={(e) =>
                        updateProspectStatus(
                          prospect.id,
                          e.target.value,
                          prospect.notes || undefined
                        )
                      }
                      className="px-3 py-1 border text-gray-900 border-gray-300 rounded text-sm">
                      <option value="prospect">潛在客戶</option>
                      <option value="contacted">已聯絡</option>
                      <option value="converted">已轉換</option>
                    </select>

                    <Button
                      onClick={() => deleteProspect(prospect.id)}
                      variant="secondary"
                      size="sm"
                      className="text-red-600 hover:text-red-800">
                      刪除
                    </Button>
                  </div>
                </div>

                {prospect.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-gray-700">
                      <strong>備註:</strong> {prospect.notes}
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <Textarea
                    value={prospect.notes || ""}
                    onChange={(e) => {
                      const updatedProspects = prospects.map((p) =>
                        p.id === prospect.id
                          ? { ...p, notes: e.target.value }
                          : p
                      );
                      setProspects(updatedProspects);
                    }}
                    onBlur={() =>
                      updateProspectStatus(
                        prospect.id,
                        prospect.status,
                        prospect.notes || undefined
                      )
                    }
                    placeholder="添加備註..."
                    rows={2}
                    className="w-full text-sm"
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
