import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AccountDetailsGridMetaData } from "./gridMetaData";
import { GridMetaDataType } from "components/dataTable/types";
import { useEffect, useState } from "react";
import { boolean } from "yup";

const GridType = ({ data }) => {
  const getMetadata = (reqdata) => {
    let metaData = {
      gridConfig: {
        dense: true,
        gridLabel: reqdata?.title ?? "",
        rowIdColumn: reqdata?.rowIdColumn ?? "ID",
        defaultColumnConfig: {
          width: 200,
          maxWidth: 300,
          minWidth: 200,
        },
        allowColumnReordering: false,
        disableSorting: false,
        hideHeader: false,
        disableGroupBy: true,
        enablePagination: Boolean(reqdata?.enablePagination),
        pageSizes: [20, 40, 50],
        defaultPageSize: 20,
        containerHeight: {
          min: "33vh",
          max: "33vh",
        },
        allowFilter: false,
        allowColumnHiding: false,
        allowRowSelection: false,
        isCusrsorFocused: true,
        hideFooter: false,
      },
    };
    let columns = reqdata?.metaData?.map((item) => {
      return {
        accessor: item?.accessor,
        columnName: item?.label,
        sequence: item?.sequence,
        alignment: item?.alignment ?? "left",
        componentType: "default",
        width: item?.width ?? 200,
        minWidth: item?.minWidth ?? 200,
        maxWidth: item?.maxWidth ?? 400,
      };
    });
    metaData["columns"] = columns;
    return metaData as any;
  };
  return (
    <>
      <GridWrapper
        key={`statementdetails`}
        finalMetaData={getMetadata(data) as GridMetaDataType}
        data={data?.data ?? []}
        setData={() => null}
        headerToolbarStyle={{
          background: "inherit",
          color: "black",
        }}
      />
    </>
  );
};

export default GridType;
