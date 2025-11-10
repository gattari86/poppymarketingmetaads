"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { AdAccount } from "@/lib/types";

export default function DashboardHome() {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdAccounts = async () => {
      try {
        const response = await fetch("/api/ad-accounts");
        if (response.ok) {
          const accounts = await response.json();
          setAdAccounts(accounts);
          if (accounts.length > 0) {
            // Try to get previously selected account from localStorage
            const savedAccountId = localStorage.getItem("selectedAdAccountId");
            if (savedAccountId && accounts.some((a: AdAccount) => a.account_id === savedAccountId)) {
              setSelectedAccountId(savedAccountId);
            } else {
              setSelectedAccountId(accounts[0].account_id);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching ad accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdAccounts();
  }, []);

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    localStorage.setItem("selectedAdAccountId", accountId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
          Welcome to Poppy
        </h1>
        <p className="text-gray-600">
          Manage your Meta advertising campaigns with ease.
        </p>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-poppy-dark-purple"></div>
        </div>
      ) : adAccounts.length === 0 ? (
        <div className="bg-poppy-light-purple/10 border border-poppy-light-purple/30 rounded-xl p-8 text-center">
          <h3 className="text-lg font-poppins font-semibold text-gray-800 mb-2">
            No Ad Accounts Found
          </h3>
          <p className="text-gray-600 mb-6">
            Make sure you have authorized the app to access your Meta Business accounts.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {/* Ad Account Selection */}
          <div>
            <h2 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
              Your Ad Accounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adAccounts.map((account) => (
                <div
                  key={account.account_id}
                  onClick={() => handleSelectAccount(account.account_id)}
                  className={`card cursor-pointer border-2 transition-all ${
                    selectedAccountId === account.account_id
                      ? "border-poppy-dark-purple bg-poppy-white"
                      : "border-transparent hover:border-poppy-light-purple"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-poppins font-semibold text-gray-900">
                        {account.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">
                        {account.account_id}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      account.account_status === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {account.account_status === 1 ? "Active" : "Pending"}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      Currency: <span className="font-semibold">{account.currency}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {selectedAccountId && (
            <div>
              <h2 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href={`/dashboard/campaigns?accountId=${selectedAccountId}`}
                  className="card text-center hover:shadow-soft transition-shadow"
                >
                  <div className="text-3xl mb-3 text-poppy-dark-purple">📊</div>
                  <h3 className="font-poppins font-semibold text-gray-900 mb-2">
                    Campaigns
                  </h3>
                  <p className="text-sm text-gray-600">
                    View and create campaigns
                  </p>
                </Link>

                <Link
                  href={`/dashboard/rules?accountId=${selectedAccountId}`}
                  className="card text-center hover:shadow-soft transition-shadow"
                >
                  <div className="text-3xl mb-3">⚙️</div>
                  <h3 className="font-poppins font-semibold text-gray-900 mb-2">
                    Automated Rules
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create automation rules
                  </p>
                </Link>

                <div className="card text-center opacity-50">
                  <div className="text-3xl mb-3">📈</div>
                  <h3 className="font-poppins font-semibold text-gray-900 mb-2">
                    Analytics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Coming soon
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
