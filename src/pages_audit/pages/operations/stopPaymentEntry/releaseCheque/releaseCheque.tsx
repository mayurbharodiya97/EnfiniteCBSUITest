import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  LinearProgress,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { releaseChequeMetadata } from "./releaseChequeMetadata";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { crudStopPayment } from "../api";
import { format } from "date-fns";
import { t } from "i18next";
import {
  Alert,
  utilFunction,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";

export const ReleaseCheque = ({ navigate, getStopPayDetail }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);

  const releaseStpCheque: any = useMutation(
    "crudStopPayment",
    crudStopPayment,
    {
      onSuccess: (data) => {
        navigate(".");
        enqueueSnackbar(t("ChequeReleasedSuccessfully"), {
          variant: "success",
        });
        getStopPayDetail.mutate({
          COMP_CD: authState?.companyID,
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
          ACCT_CD: rows?.[0]?.data?.ACCT_CD,
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
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
          ? t("ReleaseChequeDetail")
          : t("ChequeStopDetail")
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
    let upd = utilFunction.transformDetailsData(filteredData, rows?.[0]?.data);
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
          maxWidth: "1250px",
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
          metaData={releaseChequeMetadata as MetaDataType}
          initialValues={rows?.[0]?.data ?? []}
          onSubmitHandler={onSubmitHandler}
          displayMode={rows?.[0]?.data?.ALLOW_RELEASE === "Y" ? "edit" : "view"}
          hideDisplayModeInTitle={true}
          formStyle={{
            background: "white",
            height: "calc(100vh - 463px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                {rows?.[0]?.data?.ALLOW_RELEASE === "Y" && (
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
                    {t("Release")}
                  </Button>
                )}

                <Button color="primary" onClick={() => navigate(".")}>
                  {t("Close")}
                </Button>
              </>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
