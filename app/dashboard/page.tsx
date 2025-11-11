"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { AdAccount } from "@/lib/types";
import { DashboardSkeleton, MetricCardSkeleton } from "@/app/components/SkeletonLoaders";

export const dynamic = "force-dynamic";

function DashboardContent() {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showAccountSelector, setShowAccountSelector] = useState(false);

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
        } else {
          throw new Error("Failed to fetch ad accounts");
        }
      } catch (error) {
        console.error("Error fetching ad accounts:", error);
        toast.error("Failed to load ad accounts", {
          description: "Please try refreshing the page",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdAccounts();
  }, []);

  // Fetch campaigns when account is selected
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!selectedAccountId) {
        setCampaigns([]);
        return;
      }

      setMetricsLoading(true);
      try {
        // Fetch campaigns for this account
        const campaignsResponse = await fetch(
          `/api/campaigns?adAccountId=${selectedAccountId}`
        );
        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json();
          setCampaigns(campaignsData || []);
        } else {
          throw new Error("Failed to fetch campaigns");
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaign metrics", {
          description: "Some data may be unavailable",
        });
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedAccountId]);

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccountId(accountId);
    localStorage.setItem("selectedAdAccountId", accountId);
    setShowAccountSelector(false);
    toast.success("Account switched", {
      description: adAccounts.find(a => a.account_id === accountId)?.name,
    });
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-3">
          Welcome to Poppy
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Manage your Meta advertising campaigns with ease. Select an ad account to get started.
        </p>
      </div>

      {/* Main Content */}
      {loading ? (
        <DashboardSkeleton />
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
          {/* Selected Account Info Card with Switcher */}
          {selectedAccountId && (
            <div className="card bg-gradient-to-br from-poppy-light-purple/10 to-poppy-light-purple/5 border border-poppy-light-purple/20">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Currently Managing</p>
                  <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-3">
                    {adAccounts.find((a) => a.account_id === selectedAccountId)?.name}
                  </h2>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Currency</p>
                      <p className="font-semibold text-poppy-dark-purple">
                        {adAccounts.find((a) => a.account_id === selectedAccountId)?.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        adAccounts.find((a) => a.account_id === selectedAccountId)?.account_status === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {adAccounts.find((a) => a.account_id === selectedAccountId)?.account_status === 1
                          ? "Active"
                          : "Pending"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account ID</p>
                      <p className="font-mono text-xs text-gray-600">
                        {adAccounts.find((a) => a.account_id === selectedAccountId)?.account_id.slice(0, 12)}...
                      </p>
                    </div>
                  </div>
                </div>
                {adAccounts.length > 1 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowAccountSelector(!showAccountSelector)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-poppy-dark-purple hover:bg-poppy-light-purple/20 rounded-lg transition-colors"
                      aria-label="Switch account"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Switch
                    </button>
                    {showAccountSelector && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10">
                        <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Select Account</p>
                        {adAccounts.map((account) => (
                          <button
                            key={account.account_id}
                            onClick={() => handleSelectAccount(account.account_id)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                              account.account_id === selectedAccountId ? "bg-poppy-light-purple/10" : ""
                            }`}
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">{account.name}</p>
                              <p className="text-xs text-gray-500 font-mono">{account.account_id}</p>
                            </div>
                            {account.account_id === selectedAccountId && (
                              <svg className="w-5 h-5 text-poppy-dark-purple" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ad Account Selection - Only show if no account selected */}
          {!selectedAccountId && (
            <div>
              <h2 className="text-xl font-poppins font-semibold text-gray-900 mb-4">
                Select an Ad Account
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
          )}

          {/* Key Metrics Overview */}
          {selectedAccountId && (
            <div className="space-y-4">
              <h2 className="text-2xl font-poppins font-semibold text-gray-900">
                Campaign Overview
              </h2>
              {metricsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <MetricCardSkeleton />
                  <MetricCardSkeleton />
                  <MetricCardSkeleton />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Link
                    href={`/dashboard/campaigns?accountId=${selectedAccountId}&filter=ACTIVE`}
                    className="card hover:shadow-soft transition-shadow cursor-pointer"
                  >
                    <p className="text-xs text-gray-500 mb-1">Active Campaigns</p>
                    <p className="text-3xl font-poppins font-bold text-green-600">
                      {campaigns.filter((c) => c.status === "ACTIVE").length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">View →</p>
                  </Link>
                  <Link
                    href={`/dashboard/campaigns?accountId=${selectedAccountId}&filter=PAUSED`}
                    className="card hover:shadow-soft transition-shadow cursor-pointer"
                  >
                    <p className="text-xs text-gray-500 mb-1">Paused Campaigns</p>
                    <p className="text-3xl font-poppins font-bold text-orange-600">
                      {campaigns.filter((c) => c.status === "PAUSED").length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">View →</p>
                  </Link>
                  <Link
                    href={`/dashboard/campaigns?accountId=${selectedAccountId}`}
                    className="card hover:shadow-soft transition-shadow cursor-pointer bg-poppy-light-purple/5"
                  >
                    <p className="text-xs text-gray-500 mb-1">Total Campaigns</p>
                    <p className="text-3xl font-poppins font-bold text-poppy-dark-purple">
                      {campaigns.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Manage →</p>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {selectedAccountId && (
            <div className="pt-6 border-t border-gray-100">
              <h2 className="text-2xl font-poppins font-semibold text-gray-900 mb-8">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export default function DashboardHome() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-poppy-dark-purple"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
