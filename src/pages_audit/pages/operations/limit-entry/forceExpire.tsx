import { Button, CircularProgress, Dialog } from "@mui/material";
import React, { useContext } from "react";

import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { useLocation } from "react-router-dom";
import { forceExpireMetaData } from "./forceExpireFormMetadata";
import { AuthContext } from "pages_audit/auth";

export const ForceExpire = ({ navigate, forceExpire }) => {
  const { state: rows }: any = useLocation();
  const { authState } = useContext(AuthContext);

  console.log("<<<row2222s", rows);

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
      TRAN_CD: data?.TRAN_CD,
      BRANCH_CD: data?.BRANCH_CD,
      REMARKS: data?.REMARKS,
      // FORCE_EXP_DT: data?.FORCE_EXP_DT,
      FORCE_EXP_DT: "28/FEB/2024",
      _UPDATEDCOLUMNS: [
        "REMARKS",
        "FORCE_EXP_VERIFIED_BY",
        "EXPIRED_FLAG",
        "FORCE_EXP_DT",
      ],
      _OLDROWVALUE: {
        REMARKS: "AAAAAAAAAA",
        FORCE_EXP_VERIFIED_BY: "",
        // EXPIRED_FLAG: data?.EXPIRED_FLAG,
        EXPIRED_FLAG: "A",
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
