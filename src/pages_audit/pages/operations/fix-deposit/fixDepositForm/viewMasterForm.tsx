import { Dialog, Paper } from "@mui/material";
import { useContext, useEffect } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { InitialValuesType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { FDContext } from "../context/fdContext";
import { ViewMasterMetadata } from "./metaData/viewMasterMetaData";
import { queryClient } from "cache";
import { useQuery } from "react-query";
import * as API from "../api";
import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import Draggable from "react-draggable";
import { useLocation } from "react-router-dom";

export const ViewMasterForm = ({ closeDialog }) => {
  const { authState } = useContext(AuthContext);
  const { FDState } = useContext(FDContext);
  const { t } = useTranslation();

  //Api for get View detail form data
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getFDViewMasterDtl", authState?.user?.branchCode], () =>
    API.getFDViewMasterDtl({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
      ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
      ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
      A_ASON_DT: authState?.workingDate ?? "",
      TDS_METHOD: FDState?.fdParaDetailData?.TDS_METHOD ?? "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getFDViewMasterDtl",
        authState?.user?.branchCode,
      ]);
    };
  }, []);

  //Form Header title
  ViewMasterMetadata.form.label = `View Master of A/c No.: ${
    FDState?.retrieveFormData?.BRANCH_CD?.trim() ?? ""
  }-${FDState?.retrieveFormData?.ACCT_TYPE?.trim() ?? ""}-${
    FDState?.retrieveFormData?.ACCT_CD?.trim() ?? ""
  } ${FDState?.retrieveFormData?.ACCT_NM?.trim() ?? ""}`;

  return (
    <Dialog
      open={true}
      fullWidth={true}
      PaperProps={{
        style: {
          width: "100%",
        },
      }}
      maxWidth="lg"
      PaperComponent={(props) => (
        <Draggable
          handle="#draggable-dialog-title"
          cancel={'[class*="MuiDialogContent-root"]'}
        >
          <Paper {...props} />
        </Draggable>
      )}
    >
      <div id="draggable-dialog-title">
        {error && (
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
            errorDetail={error?.error_detail}
            color="error"
          />
        )}

        {isLoading ? (
          <LoaderPaperComponent />
        ) : (
          <FormWrapper
            key={"ViewMasterForm"}
            metaData={ViewMasterMetadata as MetaDataType}
            initialValues={
              {
                ...data?.[0],
                FORM_60:
                  data?.[0]?.FORM_60 === "Y"
                    ? "FORM 60 Submitted"
                    : data?.[0]?.FORM_60 === "F"
                    ? "FORM 61 Submitted"
                    : data?.[0]?.FORM_60 === "N"
                    ? "N"
                    : "",
                BRANCH_CD: FDState?.retrieveFormData?.BRANCH_CD ?? "",
                ACCT_TYPE: FDState?.retrieveFormData?.ACCT_TYPE ?? "",
                ACCT_CD: FDState?.retrieveFormData?.ACCT_CD ?? "",
              } as InitialValuesType
            }
            formStyle={{
              background: "white",
            }}
          >
            <GradientButton onClick={() => closeDialog()}>Close</GradientButton>
          </FormWrapper>
        )}
      </div>
    </Dialog>
  );
};
