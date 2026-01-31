import { useState, useMemo, useCallback } from "react";
import { useAppStore, type SortOption } from "../stores/appStore";
import { REGIONS, DEFAULT_REGION } from "../constants/regions";
import { getSortLabel } from "../constants/sort";
import {
  getDateRange,
  getDateFilterLabel,
  type DateFilter,
} from "../utils/dateFilter";

export type ModalType = "date" | "region" | "sort" | null;

export function useFilters() {
  const {
    selectedRegion,
    setSelectedRegion,
    selectedDateFilter,
    setSelectedDateFilter,
    selectedSort,
    setSelectedSort,
  } = useAppStore();

  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const currentRegion = useMemo(
    () => REGIONS.find((r) => r.code === selectedRegion),
    [selectedRegion]
  );

  const dateRange = useMemo(
    () => getDateRange(selectedDateFilter),
    [selectedDateFilter]
  );

  const isDateFilterActive = selectedDateFilter !== "all";
  const isRegionFilterActive = selectedRegion !== DEFAULT_REGION;
  const hasActiveFilters = isDateFilterActive || isRegionFilterActive;

  const clearFilters = useCallback(() => {
    setSelectedDateFilter("all");
    setSelectedRegion(DEFAULT_REGION);
  }, [setSelectedDateFilter, setSelectedRegion]);

  const openModal = useCallback((modal: ModalType) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleDateSelect = useCallback(
    (filter: DateFilter) => {
      setSelectedDateFilter(filter);
    },
    [setSelectedDateFilter]
  );

  const handleRegionSelect = useCallback(
    (regionCode: string) => {
      setSelectedRegion(regionCode);
    },
    [setSelectedRegion]
  );

  const handleSortSelect = useCallback(
    (sort: SortOption) => {
      setSelectedSort(sort);
    },
    [setSelectedSort]
  );

  return {
    // State
    selectedRegion,
    selectedDateFilter,
    selectedSort,
    currentRegion,
    dateRange,
    activeModal,

    // Computed
    isDateFilterActive,
    isRegionFilterActive,
    hasActiveFilters,
    dateFilterLabel: getDateFilterLabel(selectedDateFilter),
    sortLabel: getSortLabel(selectedSort),

    // Actions
    openModal,
    closeModal,
    clearFilters,
    handleDateSelect,
    handleRegionSelect,
    handleSortSelect,
  };
}
