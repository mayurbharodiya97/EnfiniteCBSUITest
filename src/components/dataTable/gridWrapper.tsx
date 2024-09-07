import { forwardRef } from "react";
import { cloneDeep } from "lodash-es";
import { GridMetaDataType, ActionTypes } from "./types";
import {
  attachCellComponentsToMetaData,
  attachFilterComponentToMetaData,
  attachAlignmentProps,
  extractHiddenColumns,
  sortColumnsBySequence,
  SplitActions,
} from "./utils";
import { GirdController } from "./gridController";
import { GridProvider } from "./context";
import { AutoRefreshProvider } from "../utils/autoRefresh";

interface GridWrapperPropsType {
  gridCode: any;
  getGridData: any;
  metaData: GridMetaDataType;
  actions?: ActionTypes[];
  setAction: any;
  defaultFilter?: any;
  fixedFilter?: any;
  defaultSortOrder?: any;
  dataTransformer?: any;
  autoRefreshInterval?: any;
}

export const GridWrapper = forwardRef<GridWrapperPropsType, any>(
  (
    {
      gridCode,
      getGridData,
      metaData,
      actions,
      setAction,
      defaultFilter = [],
      defaultSortOrder = [],
      dataTransformer = (data) => data,
      autoRefreshInterval,
    },
    ref
  ) => {
    let finalData = transformMetaData({
      metaData,
      actions,
      setAction,
    });
    //console.log("finalData=>", finalData);

    return (
      <GridProvider gridCode={gridCode} getGridData={getGridData}>
        <AutoRefreshProvider>
          <GirdController
            //@ts-ignore
            ref={ref}
            metaData={finalData as GridMetaDataType}
            defaultFilter={defaultFilter}
            defaultSortOrder={defaultSortOrder}
            dataTransformer={dataTransformer}
            autoRefreshInterval={autoRefreshInterval}
          />
        </AutoRefreshProvider>
      </GridProvider>
    );
  }
);

const transformMetaData = ({
  metaData: freshMetaData,
  actions,
  setAction,
}): GridMetaDataType => {
  let metaData = cloneDeep(freshMetaData) as GridMetaDataType;
  //let metaData = JSON.parse(JSON.stringify(freshMetaData)) as GridMetaDataType;

  let columns = metaData.columns as any;
  let filters = metaData.filters as any;
  //make sure extract functions are called before attach and lastly sort
  filters = attachFilterComponentToMetaData(filters);
  const hiddenColumns = extractHiddenColumns(columns);
  columns = attachCellComponentsToMetaData(columns);

  columns = attachAlignmentProps(columns);
  columns = sortColumnsBySequence(columns);

  const splittedActions = SplitActions(actions ?? null);
  return {
    columns: columns,
    gridConfig: metaData.gridConfig,
    hiddenColumns: hiddenColumns,
    filters: filters,
    setAction: setAction,
    ...splittedActions,
  };
};
