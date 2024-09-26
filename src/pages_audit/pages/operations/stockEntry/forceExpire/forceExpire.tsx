import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  LinearProgress,
} from "@mui/material";
import React, { useContext, useEffect } from "react";

import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { forceExpireStockMetaData } from "./forceExpiredMetadata";
import { crudStockData } from "../api";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  utilFunction,
  Alert,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";

export const ForceExpireStock = ({ navigate, stockEntryGridData }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();

  let newInitialData = {
    ...rows?.[0]?.data,
    WITHDRAW_DT:
      rows?.[0]?.data?.ASON_DT === ""
        ? authState?.workingDate
        : rows?.[0]?.data?.ASON_DT,
    DRAWING_POWER:
      rows?.[0]?.data?.DRAWING_POWER &&
      parseFloat(rows?.[0]?.data?.DRAWING_POWER).toFixed(2),
    NET_VALUE:
      rows?.[0]?.data?.NET_VALUE &&
      parseFloat(rows?.[0]?.data?.NET_VALUE).toFixed(2),
    STOCK_VALUE:
      rows?.[0]?.data?.STOCK_VALUE &&
      parseFloat(rows?.[0]?.data?.STOCK_VALUE).toFixed(2),
  };

  const forceExpire: any = useMutation("crudStockData", crudStockData, {
    onSuccess: () => {
      navigate(".");
      enqueueSnackbar(t("ForceExpSuccessfully"), { variant: "success" });
      stockEntryGridData.mutate({
        COMP_CD: authState?.companyID,
        ACCT_CD: rows?.[0]?.data?.ACCT_CD,
        ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
        BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
        A_USER_LEVEL: authState?.role,
        A_GD_DATE: authState?.workingDate,
      });
    },
  });

  //account number and name set to inside the header
  useEffect(() => {
    if (rows?.[0]?.data) {
      forceExpireStockMetaData.form.label = `${
        rows?.[0]?.data?.ALLOW_FORCE_EXPIRE_FLAG !== "Y"
          ? t("stockDetail")
          : t("ForceExpStock")
      } \u00A0\u00A0 
        ${(
          rows?.[0]?.data?.COMP_CD +
          rows?.[0]?.data?.BRANCH_CD +
          rows?.[0]?.data?.ACCT_TYPE +
          rows?.[0]?.data?.ACCT_CD
        ).replace(/\s/g, "")} -  ${rows?.[0]?.data?.ACCT_NM} `;
    }
  }, [rows?.[0]?.data]);

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1250px",
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
          key={"stock-force-exp"}
          metaData={forceExpireStockMetaData as MetaDataType}
          displayMode={
            rows?.[0]?.data?.ALLOW_FORCE_EXPIRE_FLAG !== "Y" ? "view" : null
          }
          initialValues={newInitialData ?? {}}
          onSubmitHandler={(data: any, displayData, endSubmit) => {
            const filteredData = Object.fromEntries(
              Object.entries(data).filter(([_, value]) => value !== "")
            );
            let upd = utilFunction.transformDetailsData(
              filteredData,
              rows?.[0]?.data
            );
            let apiReq = {
              _isNewRow: false,
              _isDeleteRow: false,
              COMP_CD: authState?.companyID,
              BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
              TRAN_CD: rows?.[0]?.data?.TRAN_CD,
              WITHDRAW_DT: format(new Date(data?.WITHDRAW_DT), "dd-MMM-yyyy"),
              REMARKS: data?.REMARKS,
              DRAWING_POWER: data?.DRAWING_POWER,
              ASON_DT: rows?.[0]?.data?.ASON_DT,
              ...(data?.PARENT_TYPE === "SOD "
                ? { MARGIN: data?.MARGIN }
                : { STOCK_DESC: data?.STOCK_DESC }),
              ...upd,
            };

            forceExpire.mutate(apiReq);

            //@ts-ignore
            endSubmit(true);
          }}
          formStyle={{
            background: "white",
            height: "calc(100vh - 455px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
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
                    {t("Save")}
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
