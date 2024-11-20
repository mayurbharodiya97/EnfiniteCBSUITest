import { AppBar, Dialog, Paper } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChequeDtlGridMetaData } from "./chequeDetailGridMetadata";
import { useQuery } from "react-query";
import { chequeGridDTL } from "../api";
import Draggable from "react-draggable";

import {
  Alert,
  GridWrapper,
  GridMetaDataType,
  ActionTypes,
  queryClient,
} from "@acuteinfo/common-base";

type ChequebookIssuedDtlCustomProps = {
  navigate?: any;
  setChequebookIssueDtlOpen?: any;
  screenFlag?: any;
};

export const ChequeDtlGrid: React.FC<ChequebookIssuedDtlCustomProps> = ({
  navigate,
  setChequebookIssueDtlOpen,
  screenFlag,
}) => {
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

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "905px",
          padding: "5px",
        },
      }}
      PaperComponent={(props) => (
        <Draggable
          handle="#draggable-dialog-title"
          cancel={'[class*="MuiDialogContent-root"]'}
        >
          <Paper {...props} />
        </Draggable>
      )}
    >
      <div id="draggable-dialog-title">
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
          setAction={() => {
            if (screenFlag === "chequesDtlForTrn") {
              setChequebookIssueDtlOpen(false);
            } else {
              navigate(".");
            }
          }}
        />
      </div>
    </Dialog>
  );
};
