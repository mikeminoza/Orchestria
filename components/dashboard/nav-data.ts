import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  // Settings,
} from "lucide-react";

import type { NavGroup, NavLeafItem } from "@/components/dashboard/types";

export const navMain: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Forms", url: "/dashboard/forms", icon: FileText },
    ],
  },
  // {
  //   label: "Workspace",
  //   items: [
  //     {
  //       title: "Settings",
  //       url: "/dashboard/settings",
  //       icon: Settings,
  //       items: [
  //         { title: "General", url: "/dashboard/settings/general" },
  //         { title: "Members", url: "/dashboard/settings/members" },
  //         { title: "Billing", url: "/dashboard/settings/billing" },
  //       ],
  //     },
  //   ],
  // },
];

export const navSecondary: NavLeafItem[] = [
  { title: "Support", url: "/dashboard/support", icon: LifeBuoy },
  { title: "Documentation", url: "/dashboard/docs", icon: BookOpen },
];
