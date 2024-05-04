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
import { forceExpireMetaData } from "./forceExpireFormMetadata";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { crudLimitEntryData } from "./api";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";

export const ForceExpire = ({ navigate, getLimitDetail }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);

  let newIntialData = {
    ...rows?.[0]?.data,
    FORCE_EXP_DT: authState?.workingDate,
  };

  const forceExpire: any = useMutation(
    "crudLimitEntryData",
    crudLimitEntryData,
    {
      onSuccess: (data, variables) => {
        navigate(".");
        enqueueSnackbar("Force-Expired successfully", { variant: "success" });
        getLimitDetail.mutate({
          COMP_CD: authState?.companyID,
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
          ACCT_CD: rows?.[0]?.data?.ACCT_CD,
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
          GD_TODAY_DT: authState?.workingDate,
        });
      },
    }
  );
  useEffect(() => {
    if (rows?.[0]?.data) {
      forceExpireMetaData.form.label = `  ${
        rows?.[0]?.data?.ALLOW_FORCE_EXP === "Y"
          ? "Force-Expire Limit"
          : "Limit Detail"
      }     \u00A0\u00A0 
      ${(
        rows?.[0]?.data?.COMP_CD +
        rows?.[0]?.data?.BRANCH_CD +
        rows?.[0]?.data?.ACCT_TYPE +
        rows?.[0]?.data?.ACCT_CD
      ).replace(/\s/g, "")}`;
    }
  }, [rows?.[0]?.data]);

  const onSubmitHandler = (data: any, displayData, endSubmit) => {
    let apiReq = {
      ...data,
      _isNewRow: false,
      _isDeleteRow: false,
      _UPDATEDCOLUMNS: [
        "REMARKS",
        "FORCE_EXP_VERIFIED_BY",
        "EXPIRED_FLAG",
        "FORCE_EXP_DT",
      ],
      _OLDROWVALUE: {
        REMARKS: rows?.[0]?.data?.REMARKS,
        FORCE_EXP_VERIFIED_BY: "",
        EXPIRED_FLAG: data?.EXPIRED_FLAG,
        FORCE_EXP_DT: "",
      },
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
        ) : (
          <LinearProgressBarSpacer />
        )}
        <FormWrapper
          key={"limit-force-exp"}
          metaData={forceExpireMetaData}
          initialValues={newIntialData ?? []}
          onSubmitHandler={onSubmitHandler}
          loading={forceExpire.isLoading}
          formStyle={{
            background: "white",
            height: "calc(100vh - 367px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            console.log("isSubmitting, handleSubmit", isSubmitting);
            return (
              <>
                {rows?.[0]?.data?.ALLOW_FORCE_EXP === "Y" && (
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
