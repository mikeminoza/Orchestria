import type { LucideIcon } from "lucide-react";

export type NavLeafItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export type NavItem = NavLeafItem & {
  items?: NavLeafItem[];
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type NavUser = {
  name: string;
  email: string;
  avatar?: string;
};
