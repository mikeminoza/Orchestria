"use client";

import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import { navMain, navSecondary } from "@/components/dashboard/nav-data";
import type { NavUser as NavUserType } from "@/components/dashboard/types";

const currentUser: NavUserType = {
  name: "Jordan Lee",
  email: "jordan@formbuilder.dev",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
        >
          <div className="from-primary to-primary/70 flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br">
            <span className="bg-primary-foreground size-2 rounded-full" />
          </div>
          <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold">FormBuilder</span>
            <span className="text-muted-foreground truncate text-xs">
              Internal Tools
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navMain} />
        <NavSecondary items={navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
