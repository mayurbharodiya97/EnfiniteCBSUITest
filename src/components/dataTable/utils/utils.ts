//import { useCallback, useRef } from "react";

export const formatSortBy = (sortBy = []) => {
  const formatted = sortBy.map((one: any, index) => ({
    [one?.id ?? ""]: one?.desc ? "desc" : "asc",
    seq: index + 1,
  }));
  return formatted;
};

export const formatFilterBy = (filterBy = []) => {
  if (!Array.isArray(filterBy)) {
    filterBy = [filterBy];
  }
  const formatted = filterBy.map((one: any, index) => ({
    accessor: one.id,
    ...one.value,
  }));
  return formatted;
};
