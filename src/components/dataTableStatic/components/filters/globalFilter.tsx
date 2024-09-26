import { useState } from "react";

import { useAsyncDebounce } from "react-table";
import { SearchBar } from "components/derived";
import { useTranslation } from "react-i18next";

export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  searchPlaceholder,
}) => {
  const count = preGlobalFilteredRows.length;
  const [, setValue] = useState(globalFilter);
  const { t } = useTranslation();
  const onChange = useAsyncDebounce(
    (value) => setGlobalFilter(value || undefined),
    200
  );

  return (
    <SearchBar
      type="text"
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={`${t("profile.Searchin")} ${count} ${searchPlaceholder}`}
      color="primary"
    />
  );
};
