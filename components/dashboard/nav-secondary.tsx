"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavLeafItem } from "@/components/dashboard/types";
import { isNavItemActive } from "@/components/dashboard/nav-utils";
import { cn } from "@/lib/utils";

export function NavSecondary({
  items,
  className,
  ...props
}: React.ComponentProps<typeof SidebarGroup> & { items: NavLeafItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup className={cn("mt-auto", className)} {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size="sm"
                isActive={isNavItemActive(pathname, item.url)}
                tooltip={item.title}
              >
                <Link href={item.url}>
                  {item.icon ? <item.icon /> : null}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
