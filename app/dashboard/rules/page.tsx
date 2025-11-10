"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import CreateRuleModal from "@/app/components/CreateRuleModal";

export default function RulesPage() {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            Automated Rules
          </h1>
          <p className="text-gray-600">
            Create rules to automatically pause ad sets based on spending thresholds
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          + Create Rule
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
      <div className="bg-poppy-light-purple/10 border border-poppy-light-purple/30 rounded-xl p-8 text-center">
        <h3 className="text-lg font-poppins font-semibold text-gray-800 mb-2">
          No Rules Created Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first automated rule to save time and control your ad spend.
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          Create Your First Rule
        </button>
      </div>
    </div>
  );
}
