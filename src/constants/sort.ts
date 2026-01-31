import type { SortOption } from "../stores/appStore";

export interface SortOptionItem {
  value: SortOption;
  label: string;
  icon: string;
}

export const SORT_OPTIONS: SortOptionItem[] = [
  { value: "date,asc", label: "Date ↑", icon: "arrow-up" },
  { value: "date,desc", label: "Date ↓", icon: "arrow-down" },
  { value: "name,asc", label: "Name A-Z", icon: "type" },
];

export function getSortLabel(sort: SortOption): string {
  return SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";
}
