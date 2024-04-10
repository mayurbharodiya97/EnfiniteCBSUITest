import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  LinearProgress,
} from "@mui/material";
import React, { useContext, useEffect } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { forceExpireStockMetaData } from "./forceExpiredMetadata";
import { crudStockData } from "./api";

export const ForceExpireStock = ({ navigate, stockEntryGridData }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);

  let newIntialData = {
    ...rows?.[0]?.data,
    WITHDRAW_DT: rows?.[0]?.data?.WITHDRAW_DT
      ? rows?.[0]?.data?.WITHDRAW_DT
      : authState?.workingDate,
  };
  console.log("<<<rows", rows);

  const forceExpire: any = useMutation("crudStockData", crudStockData, {
    onSuccess: (data, variables) => {
      navigate(".");
      enqueueSnackbar("Force-Expired successfully", { variant: "success" });
      stockEntryGridData.mutate({
        COMP_CD: authState?.companyID,
        ACCT_CD: rows?.[0]?.data?.ACCT_CD,
        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
        A_USER_LEVEL: authState?.role,
      });
    },
  });

  useEffect(() => {
    if (rows?.[0]?.data) {
      forceExpireStockMetaData.form.label = `${
        rows?.[0]?.data?.ALLOW_FORCE_EXPIRE_FLAG !== "Y"
          ? "Stock Detail"
          : "Force-Expire Stock"
      } \u00A0\u00A0 
        ${(
          rows?.[0]?.data?.COMP_CD +
          rows?.[0]?.data?.BRANCH_CD +
          rows?.[0]?.data?.ACCT_TYPE +
          rows?.[0]?.data?.ACCT_CD
        ).replace(/\s/g, "")} -  ${rows?.[0]?.data?.ACCT_NM} `;
    }
  }, [rows?.[0]?.data]);

  const onSubmitHandler = (data: any, displayData, endSubmit) => {
    console.log("<<<savehandle", data);

    let apiReq = {
      // ...data,
      // _isNewRow: false,
      // _isDeleteRow: false,
      // _UPDATEDCOLUMNS: [
      //   "REMARKS",
      //   "FORCE_EXP_VERIFIED_BY",
      //   "EXPIRED_FLAG",
      //   "FORCE_EXP_DT",
      // ],
      // _OLDROWVALUE: {
      //   REMARKS: rows?.[0]?.data?.REMARKS,
      //   FORCE_EXP_VERIFIED_BY: "",
      //   EXPIRED_FLAG: data?.EXPIRED_FLAG,
      //   FORCE_EXP_DT: "",
      // },
    };
    forceExpire.mutate(apiReq);

    //@ts-ignore
    endSubmit(true);
  };
  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1150px",
        },
      }}
    >
      <>
        {forceExpire?.isError ? (
          <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={forceExpire?.error?.error_msg ?? "Unknow Error"}
                errorDetail={forceExpire?.error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          </div>
        ) : forceExpire.isLoading ? (
          <LinearProgress color="secondary" />
        ) : null}
        {/* ALLOW_FORCE_EXPIRE_FLAG */}
        <FormWrapper
          key={"stock-force-exp"}
          metaData={forceExpireStockMetaData}
          displayMode={
            rows?.[0]?.data?.ALLOW_FORCE_EXPIRE_FLAG !== "Y" ? "view" : null
          }
          initialValues={newIntialData ?? []}
          onSubmitHandler={onSubmitHandler}
          loading={forceExpire.isLoading}
        >
          {({ isSubmitting, handleSubmit }) => {
            console.log("isSubmitting, handleSubmit", isSubmitting);
            return (
              <>
                {rows?.[0]?.data?.ALLOW_FORCE_EXPIRE_FLAG === "Y" && (
                  <Button
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    // disabled={isSubmitting}
                    endIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                    color={"primary"}
                  >
                    Save
                  </Button>
                )}
                <Button color="primary" onClick={() => navigate(".")}>
                  close
                </Button>
              </>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
