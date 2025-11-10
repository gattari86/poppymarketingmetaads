"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Map path segments to readable labels
const pathSegmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  campaigns: "Campaigns",
  rules: "Automated Rules",
  "ad-accounts": "Ad Accounts",
  adsets: "Ad Sets",
  ads: "Ads",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Don't show breadcrumbs on home or auth pages
    if (pathname === "/" || pathname.startsWith("/auth/") || pathname.startsWith("/api/")) {
      return [];
    }

    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [
      {
        label: "Home",
        href: "/",
      },
    ];

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Get label from map or capitalize segment
      const label =
        pathSegmentLabels[segment] ||
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      // Don't add link for last segment (current page)
      const isLast = index === segments.length - 1;

      items.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return items;
  }, [pathname]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200 text-sm overflow-x-auto">
      {breadcrumbs.map((item, index) => (
        <div key={item.href || item.label} className="flex items-center gap-2 whitespace-nowrap">
          {index > 0 && (
            <span className="text-gray-400 mx-1">/</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-poppy-dark-purple hover:underline hover:text-poppy-purple font-medium transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
