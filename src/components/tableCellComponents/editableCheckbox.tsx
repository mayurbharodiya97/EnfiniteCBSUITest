import { Checkbox } from "components/common/checkbox";
import { useState, useEffect, useMemo } from "react";
import { CellWrapper } from "./cellWrapper";
import { FormHelperText } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: any) => ({
  wrapperclass: {
    textAlign: "center",
    "& div": {
      "& fieldset": {
        verticalAlign: "middle",
        "& label": {
          marginLeft: 0,
          marginRight: 0,
        },
      },
    },
  },
}));
export const EditableCheckbox = (props) => {
  const {
    value: initialValue,
    rows,
    row: { index, original },
    column: {
      id,
      options,
      validation,
      requestProps,
      isReadOnly,
      shouldExclude,
    },
    updateGridData,
    gridProps,
    hiddenFlag,
    loading,
  } = props;
  const externalTouched = Boolean(original?._touched?.[id]);
  const externalError = original?._error?.[id] ?? "";
  const [loadingcall, setLoading] = useState(false);
  const classes = useStyles();
  const [value, setValue] = useState(initialValue);
  const reqGridProps =
    typeof options === "string" &&
    options === "GetMiscValue" &&
    typeof requestProps !== "undefined"
      ? requestProps
      : gridProps;
  //console.log(requestProps, typeof requestProps);
  const prevRows = rows
    .slice(0, index)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);

  const nextRows = rows
    .slice(index + 1)
    .map((one) => one?.original)
    .filter((one) => Boolean(one[hiddenFlag]) !== true);
  const isShouldExclude = useMemo(() => {
    if (typeof shouldExclude === "function") {
      return shouldExclude(initialValue, original, prevRows, nextRows);
    }
    return false;
  }, [initialValue, prevRows, nextRows, original]);
  const onChange = (e) => {
    //console.log("e.target.value", e.target.checked);
    setValue(e.target.checked);
    //onBlur();
  };

  const onBlur = () => {
    setLoading(true);
    validation(value, original, prevRows, nextRows).then((result) => {
      setLoading(false);
      updateGridData(index, id, value, true, result);
    });
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, externalError]);
  if (isShouldExclude) {
    return <CellWrapper showBorder {...props}></CellWrapper>;
  }
  return (
    <CellWrapper showBorder {...props}>
      <div className={classes.wrapperclass}>
        <Checkbox
          // <SelectForGrid
          checked={Boolean(value)}
          onChange={onChange}
          onBlur={onBlur}
          disabled={loadingcall || loading || isReadOnly}
          enableGrid={true}
          name={id}
          label={""}
          fieldKey={id}
        />
        {Boolean(externalTouched) && Boolean(externalError) ? (
          <FormHelperText error={true}>{externalError}</FormHelperText>
        ) : null}
      </div>
    </CellWrapper>
  );
};
