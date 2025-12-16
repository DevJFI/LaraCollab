import { useCallback } from "react";
import { currentUrlParams, reloadWithQuery, reloadWithoutQueryParams } from "@/utils/route";

export default function useTaskPrioritySorting() {
  const getCurrentPriorityDirection = () => {
    const params = currentUrlParams();
    const currentSort = params.sort || {};

    if (typeof currentSort !== "object" || !currentSort.priority) {
      return null;
    }

    return currentSort.priority === "asc" ? "asc" : "desc";
  };

  const handlePrioritySortChange = useCallback((direction) => {
    const params = currentUrlParams();
    const currentSort = params.sort || {};

    reloadWithQuery(
      {
        ...params,
        sort: {
          ...currentSort,
          priority: direction,
        },
      },
    );
  }, []);

  const clearPrioritySort = useCallback(() => {
    reloadWithoutQueryParams({ exclude: ["sort"] });
  }, []);

  return {
    currentDirection: getCurrentPriorityDirection(),
    sortHighToLow: () => handlePrioritySortChange("asc"),
    sortLowToHigh: () => handlePrioritySortChange("desc"),
    clearPrioritySort,
  };
}

