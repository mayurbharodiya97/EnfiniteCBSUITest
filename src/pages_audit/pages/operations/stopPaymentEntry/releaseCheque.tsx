import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  LinearProgress,
} from "@mui/material";
import React, { useContext, useEffect } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { releaseChequeMetadata } from "./releaseChequeMetadata";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { utilFunction } from "components/utils";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { crudStopPayment } from "./api";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { format } from "date-fns";

export const ReleaseCheque = ({ navigate, getStopPayDetail }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);

  let newIntialData = {
    ...rows?.[0]?.data,
    RELEASE_DATE: authState?.workingDate,
  };

  console.log("<<<rows", rows);

  const releaseStpCheque: any = useMutation(
    "crudStopPayment",
    crudStopPayment,
    {
      onSuccess: (data) => {
        navigate(".");
        enqueueSnackbar("Cheque released Successfully.", {
          variant: "success",
        });
        getStopPayDetail.mutate({
          COMP_CD: authState?.companyID,
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
          ACCT_CD: rows?.[0]?.data?.ACCT_CD,
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
          // ENTERED_DATE: authState?.workingDate,
          GD_TODAY: authState?.workingDate,
          USER_LEVEL: authState?.role,
        });
      },
    }
  );
  useEffect(() => {
    if (rows?.[0]?.data) {
      releaseChequeMetadata.form.label = `   ${
        rows?.[0]?.data?.ALLOW_RELEASE === "Y"
          ? "Release Cheque Detail"
          : "Stop Cheque Detail"
      }  \u00A0\u00A0
      ${(
        rows?.[0]?.data?.COMP_CD +
        rows?.[0]?.data?.BRANCH_CD +
        rows?.[0]?.data?.ACCT_TYPE +
        rows?.[0]?.data?.ACCT_CD
      ).replace(/\s/g, "")} - ${rows?.[0]?.data?.ACCT_NM}`;
    }
  }, [rows?.[0]?.data]);

  const onSubmitHandler = (data: any, displayData, endSubmit) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );
    let upd = utilFunction.transformDetailsData(
      filteredData,
      newIntialData ?? rows?.[0]?.data
    );
    let apiReq = {
      _isNewRow: false,
      _isDeleteRow: false,
      BRANCH_CD: data?.BRANCH_CD,
      TRAN_CD: rows?.[0]?.data?.TRAN_CD,
      RELEASE_DATE: format(new Date(data?.RELEASE_DATE), "dd-MMM-yyyy"),
      REMARKS: data?.REMARKS,
      REASON_CD: data?.REASON_CD,
      INFAVOUR_OF: data?.INFAVOUR_OF,
      ...upd,
    };
    releaseStpCheque.mutate(apiReq);

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
          padding: "5px",
        },
      }}
    >
      <>
        {releaseStpCheque?.isError ? (
          <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={releaseStpCheque?.error?.error_msg ?? "Unknow Error"}
                errorDetail={releaseStpCheque?.error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          </div>
        ) : releaseStpCheque.isLoading ? (
          <LinearProgress color="secondary" />
        ) : (
          <LinearProgressBarSpacer />
        )}
        <FormWrapper
          key={"releaseChequeMetadata"}
          metaData={releaseChequeMetadata}
          initialValues={newIntialData ?? []}
          onSubmitHandler={onSubmitHandler}
        >
          {({ isSubmitting, handleSubmit }) => {
            console.log("isSubmitting, handleSubmit", isSubmitting);
            return (
              <>
                {newIntialData?.ALLOW_RELEASE === "Y" && (
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
                    Release
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
