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
  "privacy-policy": "Privacy Policy",
  terms: "Terms of Service",
  "data-deletion": "Data Deletion",
  support: "Support",
};

export default function Breadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Don't show breadcrumbs on home or auth pages
    if (pathname === "/" || pathname.startsWith("/auth/") || pathname.startsWith("/api/")) {
      return [];
    }

    const segments = pathname.split("/").filter(Boolean);

    // Create breadcrumb items based on page type
    let items: BreadcrumbItem[] = [];

    // Check if it's a dashboard page or support page
    const isDashboardPage = segments[0] === "dashboard";
    const isSupportPage = [
      "privacy-policy",
      "terms",
      "data-deletion",
      "support",
    ].includes(segments[0]);

    // Add Home link (always points to landing page)
    items.push({
      label: "Home",
      href: "/",
    });

    // For dashboard pages
    if (isDashboardPage) {
      items.push({
        label: "Dashboard",
        href: "/dashboard",
      });

      // Add nested pages (campaigns, rules, etc.)
      if (segments.length > 1) {
        let currentPath = "/dashboard";
        for (let i = 1; i < segments.length; i++) {
          currentPath += `/${segments[i]}`;
          const label =
            pathSegmentLabels[segments[i]] ||
            segments[i]
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");

          const isLast = i === segments.length - 1;
          items.push({
            label,
            href: isLast ? undefined : currentPath,
          });
        }
      }
    }
    // For support pages
    else if (isSupportPage) {
      const label =
        pathSegmentLabels[segments[0]] ||
        segments[0]
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      items.push({
        label,
      });
    }
    // For other pages
    else {
      let currentPath = "";
      segments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        const label =
          pathSegmentLabels[segment] ||
          segment
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        const isLast = index === segments.length - 1;
        items.push({
          label,
          href: isLast ? undefined : currentPath,
        });
      });
    }

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
