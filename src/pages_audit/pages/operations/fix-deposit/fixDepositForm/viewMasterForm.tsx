import { Dialog, Paper } from "@mui/material";
import { useContext, useEffect } from "react";
import { AuthContext } from "pages_audit/auth";
import { useTranslation } from "react-i18next";
import { FDContext } from "../context/fdContext";
import { ViewMasterMetadata } from "./metaData/viewMasterMetaData";
import { useQuery } from "react-query";
import * as API from "../api";
import Draggable from "react-draggable";
import {
  LoaderPaperComponent,
  Alert,
  GradientButton,
  queryClient,
  InitialValuesType,
  FormWrapper,
  MetaDataType,
} from "@acuteinfo/common-base";

interface ViewMasterFormProps {
  handleDialogClose: any;
  requestData?: any;
}
export const ViewMasterForm: React.FC<ViewMasterFormProps> = ({
  handleDialogClose,
  requestData,
}) => {
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
      BRANCH_CD: requestData.BRANCH_CD ?? "",
      ACCT_TYPE: requestData?.ACCT_TYPE ?? "",
      ACCT_CD: requestData?.ACCT_CD ?? "",
      A_ASON_DT: authState?.workingDate ?? "",
      TDS_METHOD: requestData?.TDS_METHOD ?? "",
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
    requestData?.BRANCH_CD ?? ""
  }-${requestData?.ACCT_TYPE ?? ""}-${requestData?.ACCT_CD ?? ""} ${
    requestData?.ACCT_NM ?? ""
  }`;

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
                BRANCH_CD: requestData?.BRANCH_CD ?? "",
                ACCT_TYPE: requestData?.ACCT_TYPE ?? "",
                ACCT_CD: requestData?.ACCT_CD ?? "",
              } as InitialValuesType
            }
            onSubmitHandler={() => {}}
            formStyle={{
              background: "white",
            }}
          >
            <GradientButton onClick={() => handleDialogClose()}>
              Close
            </GradientButton>
          </FormWrapper>
        )}
      </div>
    </Dialog>
  );
};
