import {
  AppBar,
  Button,
  CircularProgress,
  Dialog,
  LinearProgress,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { lienExpireMetadata } from "./expireLienMetadata";
import { Alert } from "components/common/alert";
import { utilFunction } from "components/utils";
import { useLocation } from "react-router-dom";
import { AuthContext } from "pages_audit/auth";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "react-query";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { crudLien } from "./api";
import { format } from "date-fns";
import { usePopupContext } from "components/custom/popupContext";

export const ExpireLien = ({ navigate, getLienDetail }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);
  const { MessageBox } = usePopupContext();
  let newIntialData = {
    ...rows?.[0]?.data,
    LIEN_STATUS: rows?.[0]?.data?.LIEN_STATUS === "Active" ? "A" : "E",
  };

  const expireLienData: any = useMutation("crudLien", crudLien, {
    onSuccess: (data) => {
      console.log("<<<44", data);
      if (data?.[0]?.O_STATUS === "99" && data?.[0]?.O_MESSAGE) {
        MessageBox({
          messageTitle: "Validation Alert",
          message: data?.[0]?.O_MESSAGE,
        });
      } else {
        enqueueSnackbar("Lien Expired Successfully.", {
          variant: "success",
        });
        getLienDetail.mutate({
          COMP_CD: authState?.companyID,
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
          ACCT_CD: rows?.[0]?.data?.ACCT_CD,
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
        });
      }
      navigate(".");
    },
  });

  useEffect(() => {
    if (rows?.[0]?.data) {
      lienExpireMetadata.form.label = ` Lien Expire  \u00A0\u00A0
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
      newIntialData ?? {}
    );
    let apiReq = {
      _isNewRow: false,
      COMP_CD: authState?.companyID,
      BRANCH_CD: data?.BRANCH_CD,
      SR_CD: data?.SR_CD,
      ACCT_CD: data?.ACCT_CD,
      ACCT_TYPE: data?.ACCT_TYPE,
      LIEN_STATUS: data?.LIEN_STATUS,
      REMOVAL_DT: format(new Date(data?.REMOVAL_DT), "dd-MMM-yyyy"),
      REMARKS: data?.REMARKS,
      ...upd,
    };
    expireLienData.mutate(apiReq);

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
        {expireLienData?.isError ? (
          <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
            <AppBar position="relative" color="primary">
              <Alert
                severity="error"
                errorMsg={expireLienData?.error?.error_msg ?? "Unknow Error"}
                errorDetail={expireLienData?.error?.error_detail ?? ""}
                color="error"
              />
            </AppBar>
          </div>
        ) : expireLienData.isLoading ? (
          <LinearProgress color="secondary" />
        ) : (
          <LinearProgressBarSpacer />
        )}
        <FormWrapper
          key={"Expire-Lien"}
          metaData={lienExpireMetadata}
          initialValues={
            {
              ...rows?.[0]?.data,
              LIEN_STATUS: "E",
            } ?? {}
          }
          onSubmitHandler={onSubmitHandler}
        >
          {({ isSubmitting, handleSubmit }) => {
            return (
              <>
                <Button
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  // disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  Save
                </Button>

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
