import { AppBar, Button, CircularProgress, Dialog } from "@mui/material";
import React, { useContext } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { forceExpireMetaData } from "./forceExpireFormMetadata";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { crudLimitEntryData } from "./api";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";

export const ForceExpire = ({ navigate, getLimitDetail }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);

  console.log("<<<row2222s", authState?.workingDate);

  const forceExpire: any = useMutation(
    "crudLimitEntryData",
    crudLimitEntryData,
    {
      onSuccess: (data, variables) => {
        console.log("<<<FONCE", data, variables);

        navigate(".");
        enqueueSnackbar("Force-Expired successfully", { variant: "success" });
        getLimitDetail.mutate({
          COMP_CD: authState?.companyID,
          ACCT_TYPE: rows?.[0]?.data?.ACCT_TYPE,
          ACCT_CD: rows?.[0]?.data?.ACCT_CD,
          BRANCH_CD: rows?.[0]?.data?.BRANCH_CD,
        });
      },
    }
  );

  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    console.log("<<<savehandle", data);

    let apiReq = {
      _isNewRow: false,
      _isDeleteRow: false,
      COMP_CD: authState?.companyID,
      BRANCH_CD: data?.BRANCH_CD,
      TRAN_CD: data?.TRAN_CD,
      REMARKS: data?.REMARKS,
      FORCE_EXP_DT: data?.FORCE_EXP_DT,
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
        ) : null}
        <FormWrapper
          key={"nscdetailForm"}
          metaData={forceExpireMetaData}
          initialValues={rows?.[0]?.data ?? []}
          onSubmitHandler={onSubmitHandler}
          loading={forceExpire.isLoading}
        >
          {({ isSubmitting, handleSubmit }) => {
            console.log("isSubmitting, handleSubmit", isSubmitting);
            return (
              <>
                {rows?.[0]?.data?.EXPIRED_FLAG === "A" && (
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
