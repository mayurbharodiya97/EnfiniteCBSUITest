import { AppBar, Dialog } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { ChequeDtlGridMetaData } from "./chequeDetailGridMetadata";
import { useQuery } from "react-query";
import { ActionTypes } from "components/dataTable";
import { queryClient } from "cache";
import { chequeGridDTL } from "./api";
import { Alert } from "components/common/alert";

export const ChequeDtlGrid = ({ ClosedEventCall }) => {
  const closeAction: ActionTypes[] = [
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: false,
      rowDoubleClick: true,
      alwaysAvailable: true,
    },
  ];
  const { state: rows }: any = useLocation();

  const chequeDTL = useQuery<any, any>(["chequeDTL"], () =>
    chequeGridDTL({
      BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
      ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
      ACCT_CD: rows?.[0]?.data?.ACCT_CD,
      CHEQUE_FROM: rows?.[0]?.data?.CHEQUE_FROM,
      CHEQUE_TO: rows?.[0]?.data?.CHEQUE_TO,
      SR_CD: rows?.[0]?.data?.SR_CD,
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["chequeDTL"]);
    };
  }, []);

  useEffect(() => {
    if (rows?.[0]?.data) {
      ChequeDtlGridMetaData.gridConfig.gridLabel = `Cheque Detail \u00A0\u00A0 
      
      ${(
        rows?.[0]?.data?.COMP_CD +
        rows?.[0]?.data?.BRANCH_CD +
        rows?.[0]?.data?.ACCT_TYPE +
        rows?.[0]?.data?.ACCT_CD
      ).replace(/\s/g, "")}`;
    }
  }, [rows?.[0]?.data]);

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "750px",
          padding: "5px",
        },
      }}
    >
      <>
        {chequeDTL?.isError ? (
          <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={chequeDTL?.error?.error_msg ?? "Unknow Error"}
                errorDetail={chequeDTL?.error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          </div>
        ) : null}
        <GridWrapper
          key={`ChequeDtlGrid`}
          finalMetaData={ChequeDtlGridMetaData as GridMetaDataType}
          data={chequeDTL?.data ?? []}
          setData={() => {}}
          loading={chequeDTL?.isLoading}
          actions={closeAction}
          setAction={() => ClosedEventCall()}
        />
      </>
    </Dialog>
  );
};
