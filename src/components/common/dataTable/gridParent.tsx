import { FC, useMemo, useState, useRef, useEffect, useCallback } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import cloneDeep from "lodash-es/cloneDeep";
import { modifyMetaData } from "./utils";
import { constructNewRowObj } from "./utils/methods";
import { HeaderColumnCell } from "./components/headerCell2";
import { DefaultCell } from "./components/defaultCell";
import { GridTable } from "./gridTable";
import { GridColumnType } from "./types";
import { Grid, GridProps } from "@mui/material";

interface DataTableProps {
  _columns: GridColumnType[];
  arrayFieldIDName: string;
  dataTransformer?: any;
  rowValidator?: any;
  removeRowFn?: any;
  GridProps?: GridProps;
  enableGrid: boolean;
  label: string;
  maxHeight?: string;
  disableFooter?: boolean;
}

export type MyDataTableProps = UseFieldHookProps & DataTableProps;

const defaultTransformer = (data) => data;

const rowIDColumn = "__id"; //internal id through which we will manage data

/* eslint-disable  react-hooks/exhaustive-deps */
export const GridParent: FC<MyDataTableProps> = ({
  _columns,
  arrayFieldIDName,
  dataTransformer = defaultTransformer,
  rowValidator,
  removeRowFn,
  name: fieldName,
  fieldKey: fieldID,
  GridProps,
  enableGrid,
  label,
  maxHeight,
  shouldExclude,
  dependentFields,
  disableFooter,
}) => {
  const transformedMetaData = useMemo(() => {
    let newMetaData = cloneDeep(_columns);
    return modifyMetaData(newMetaData);
  }, []);
  const defaultColumn = useMemo(
    () => ({
      Header: HeaderColumnCell,
      Cell: DefaultCell,
    }),
    []
  );
  const newRowObj = useMemo(() => {
    let result = constructNewRowObj(_columns);
    result = { [arrayFieldIDName]: "", ...result };
    return result;
  }, []);
  const rowIDRef = useRef(-1000); //we've made an assumption initial rows will not be more than 1000
  const [isDefaultRowIDSet, setIsDefaultRowIDSet] = useState(false);

  const {
    value: data,
    setValueAsCB,
    setErrorAsCB,
    isSubmitting,
    fieldKey,
    excluded,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    shouldExclude: shouldExclude,
    dependentFields: dependentFields,
  });

  const setValueAsCBWrapper = useCallback(
    (data) => {
      if (typeof data === "function") {
        setValueAsCB((old) => dataTransformer(data(old)));
      } else {
        setValueAsCB(dataTransformer(data));
      }
    },
    [setValueAsCB, dataTransformer]
  );

  useEffect(() => {
    if (!isDefaultRowIDSet && Array.isArray(data) && data.length > 0) {
      let newData = data.map((one) => {
        if (one[rowIDColumn] === undefined) {
          return { ...one, [rowIDColumn]: rowIDRef.current++ };
        } else {
          return one;
        }
      });
      setValueAsCBWrapper(newData);
      setIsDefaultRowIDSet(true);
    }
  });

  if (excluded) {
    return null;
  }

  const result = (
    <GridTable
      key={fieldKey}
      columns={transformedMetaData}
      defaultColumn={defaultColumn}
      dataIdColumn={arrayFieldIDName}
      newRowObj={newRowObj}
      rowValidator={rowValidator}
      setData={setValueAsCBWrapper}
      data={Array.isArray(data) ? data : []}
      rowIDColumn={rowIDColumn}
      deleteRowFn={removeRowFn}
      label={label}
      maxHeight={maxHeight}
      setFormError={setErrorAsCB}
      disabled={isSubmitting}
      disableFooter={disableFooter}
    />
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};
