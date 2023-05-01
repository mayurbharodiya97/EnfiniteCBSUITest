import { useState, useRef } from "react";
import { SelectWithoutOptions } from "components/common/select/render2";
import Grid from "@material-ui/core/Grid";
import { useOptionsFetcherSimpleWithRemoveCache } from "components/common/utils";

export const OptionsFilter = ({
  filterValue,
  id,
  columnName,
  filterProps,
  gridProps,
  dispatch,
}) => {
  const [value, setValue] = useState(filterValue?.value ?? []);
  const optionLabels = useRef<any>(null);

  const [myOptions, setMyOptions] = useState([]);

  const { loadingOptions } = useOptionsFetcherSimpleWithRemoveCache(
    filterProps?.options ?? [],
    setMyOptions,
    filterProps?._optionsKey ?? "",
    false,
    {},
    false,
    undefined
  );
  const handleChange = (e, labels) => {
    setValue(e.target.value);
    optionLabels.current = labels;
  };
  const handleBlur = (e) => {
    if (Array.isArray(value) && value.length > 0) {
      dispatch({
        type: "setValue",
        payload: {
          condition: "in",
          value: value,
          label: optionLabels.current,
          id,
          columnName,
        },
      });
    } else {
      dispatch({
        type: "removeValue",
        payload: {
          id,
        },
      });
    }
  };

  return (
    <Grid item xs={12} sm={6} md={6} {...gridProps}>
      <SelectWithoutOptions
        label={columnName}
        showCheckbox={true}
        value={value}
        size="small"
        fullWidth
        touched={true}
        error={""}
        multiple={true}
        handleChange={handleChange}
        handleBlur={handleBlur}
        options={myOptions}
        loadingOptions={loadingOptions}
        selectVariant="regular"
      />
    </Grid>
  );
};
