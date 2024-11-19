import {
  AppBar,
  CircularProgress,
  Dialog,
  LinearProgress,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { forceExpireMetaData } from "./forceExpireFormMetadata";
import { AuthContext } from "pages_audit/auth";
import { crudLimitEntryData } from "../api";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import {
  utilFunction,
  Alert,
  FormWrapper,
  MetaDataType,
  GradientButton,
} from "@acuteinfo/common-base";
import { LinearProgressBarSpacer } from "components/common/custom/linerProgressBarSpacer";

type LimitDtlCustomProps = {
  setLimitDtlOpen?: any;
  navigate?: any;
  getLimitDetail?: any;
  screenFlag?: any;
};
export const ForceExpire: React.FC<LimitDtlCustomProps> = ({
  navigate,
  getLimitDetail,
  setLimitDtlOpen,
  screenFlag,
}) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleCloseDialog = () => {
    screenFlag === "limitForTrn" ? setLimitDtlOpen(false) : navigate(".");
  };

  const forceExpire: any = useMutation(
    "crudLimitEntryData",
    crudLimitEntryData,
    {
      onSuccess: () => {
        navigate(".");
        enqueueSnackbar(t("ForceExpSuccessfully"), { variant: "success" });
        getLimitDetail.mutate({
          COMP_CD: authState?.companyID,
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
          ACCT_CD: rows?.[0]?.data?.ACCT_CD,
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
          GD_TODAY_DT: authState?.workingDate,
          USER_LEVEL: authState?.role,
        });
      },
    }
  );
  useEffect(() => {
    if (rows?.[0]?.data) {
      forceExpireMetaData.form.label = `  ${
        rows?.[0]?.data?.ALLOW_FORCE_EXP === "Y"
          ? t("ForceExpireLimit")
          : t("LimitDetail")
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
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );
    let upd = utilFunction.transformDetailsData(filteredData, rows?.[0]?.data);

    let apiReq = {
      ...data,
      _isNewRow: false,
      _isDeleteRow: false,
      ...upd,
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
          metaData={forceExpireMetaData as MetaDataType}
          initialValues={rows?.[0]?.data ?? {}}
          onSubmitHandler={onSubmitHandler}
          displayMode={
            rows?.[0]?.data?.ALLOW_FORCE_EXP === "Y" ? "edit" : "view"
          }
          hideDisplayModeInTitle={true}
          formStyle={{
            background: "white",
            height: "calc(100vh - 472px)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                {rows?.[0]?.data?.ALLOW_FORCE_EXP === "Y" && (
                  <GradientButton
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
                  </GradientButton>
                )}
                <GradientButton color="primary" onClick={handleCloseDialog}>
                  {t("Close")}
                </GradientButton>
              </>
            );
          }}
        </FormWrapper>
      </>
    </Dialog>
  );
};
