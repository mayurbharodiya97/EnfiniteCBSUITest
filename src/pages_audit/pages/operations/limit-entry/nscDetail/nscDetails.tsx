import React, { useCallback, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getLimitNSCdetail } from "../api";
import { ActionTypes } from "components/dataTable";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { AppBar, Dialog } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { nscDetailGridData } from "./nscDetailsGridMetadata";
import { Route, Routes, useNavigate } from "react-router-dom";
import { NSCFormDetail } from "./nscFormDetail/nscFormDetail";

export const NscDetails = ({ navigate, myMasterRef }) => {
  const nscAction: ActionTypes[] = [
    {
      actionName: "nscFormDetail",
      actionLabel: "ViewDetail",
      multiple: false,
      rowDoubleClick: true,
    },
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: undefined,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];
  const { authState } = useContext(AuthContext);
  const navigateForm = useNavigate();
  const nscDetail: any = useMutation("getLimitNSCdetail", getLimitNSCdetail);

  useEffect(() => {
    myMasterRef?.current?.getFieldData().then((res) => {
      if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
        const NSC_DTLRequestPara = {
          COMP_CD: authState?.companyID,
          ACCT_CD: res?.ACCT_CD,
          ACCT_TYPE: res?.ACCT_TYPE,
          BRANCH_CD: res?.BRANCH_CD,
        };
        nscDetail.mutate(NSC_DTLRequestPara);
      }
    });
  }, []);

  const setCurrentAction = useCallback(
    (data) => {
      console.log("<<<data", data);
      if (data?.name === "nscFormDetail") {
        navigateForm(data?.name, {
          state: data?.rows,
        });
      } else if (data?.name === "close") {
        navigate(".");
      } else {
        navigate(data?.name, {
          state: data?.rows,
        });
      }
    },
    [navigate]
  );

  return (
    <>
      <Dialog
        open={true}
        PaperProps={{
          style: {
            maxWidth: "1385px",
            padding: "5px",
          },
        }}
      >
        <>
          {nscDetail.isError && (
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={nscDetail?.error?.error_msg ?? "Unknow Error"}
                errorDetail={nscDetail?.error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          )}
          <GridWrapper
            key={`nsc-Details-GridData`}
            finalMetaData={nscDetailGridData as GridMetaDataType}
            data={nscDetail.data ?? []}
            setData={() => {}}
            loading={nscDetail.isLoading}
            actions={nscAction}
            setAction={setCurrentAction}
          />
          <Routes>
            <Route
              path="nscFormDetail"
              element={<NSCFormDetail navigate={navigateForm} />}
            />
          </Routes>
        </>
      </Dialog>
    </>
  );
};
