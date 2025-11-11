"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import CreateRuleModal from "@/app/components/CreateRuleModal";

export const dynamic = "force-dynamic";

function RulesContent() {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("accountId") || localStorage.getItem("selectedAdAccountId");
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!accountId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Please select an ad account first.</p>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-6 flex-col md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-poppins font-bold text-gray-900 mb-3">
            Automated Rules
          </h1>
          <p className="text-lg text-gray-600">
            Create rules to automatically manage your ad spend and performance
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary whitespace-nowrap"
        >
          + New Rule
        </button>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <CreateRuleModal
          accountId={accountId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Info Card */}
      <div className="card bg-poppy-light-purple/10 border-l-4 border-poppy-dark-purple">
        <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-3">
          How It Works
        </h3>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li className="flex gap-3">
            <span className="text-poppy-dark-purple font-bold">1.</span>
            <span>Create a rule by setting a daily spend threshold</span>
          </li>
          <li className="flex gap-3">
            <span className="text-poppy-dark-purple font-bold">2.</span>
            <span>Select which ad sets to apply the rule to</span>
          </li>
          <li className="flex gap-3">
            <span className="text-poppy-dark-purple font-bold">3.</span>
            <span>Meta will automatically pause the ad sets when daily spend exceeds your threshold</span>
          </li>
        </ul>
      </div>

      {/* Empty State */}
      <div className="bg-gradient-to-br from-poppy-light-purple/10 to-poppy-light-purple/5 border-2 border-dashed border-poppy-light-purple/40 rounded-xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-xl font-poppins font-semibold text-gray-800 mb-2">
            No Rules Created Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Automate your campaign management with smart rules. Set spend limits, pause underperforming ads, and more!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Rule
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RulesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-poppy-dark-purple"></div></div>}>
      <RulesContent />
    </Suspense>
  );
}
