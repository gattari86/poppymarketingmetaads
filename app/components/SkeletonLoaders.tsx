/**
 * Skeleton loader components for better perceived performance
 */

export function CampaignCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div>
              <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <div className="h-6 w-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function AccountCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="pt-4 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-12"></div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header skeleton */}
      <div className="max-w-2xl">
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>

      {/* Account cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccountCardSkeleton />
        <AccountCardSkeleton />
      </div>

      {/* Metrics skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function CampaignsListSkeleton() {
  return (
    <div className="space-y-4">
      <CampaignCardSkeleton />
      <CampaignCardSkeleton />
      <CampaignCardSkeleton />
    </div>
  );
}

export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-b-2 border-poppy-dark-purple ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Spinner size="lg" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}
