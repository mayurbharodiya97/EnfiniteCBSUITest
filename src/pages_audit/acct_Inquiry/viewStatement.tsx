import { Dialog } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { PassbookStatement, PassbookStatementInq } from "./metaData";
import { useQuery } from "react-query";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";

import {
  LoaderPaperComponent,
  GradientButton,
  InitialValuesType,
  SubmitFnType,
  MetaDataType,
  queryClient,
  FormWrapper,
} from "@acuteinfo/common-base";

export const ViewStatement = ({ open, onClose, rowsData, screenFlag }) => {
  const formRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const acctInqData: any = useQuery<any, any, any>(
    ["getAcctInqStatement", { rowsData, COMP_CD: authState.companyID }],
    () =>
      API.getAcctInqStatement({
        rowsData,
        COMP_CD: authState.companyID,
        workingDate: authState?.workingDate,
        screenFlag: screenFlag,
        FULL_ACCT_NO: "",
      })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries([
        "getAcctInqStatement",
        {
          rowsData,
          COMP_CD: authState.companyID,
          workingDate: authState?.workingDate,
          screenFlag: screenFlag,
        },
      ]);
    };
  }, []);

  const handleClose = () => {
    onClose();
  };
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // onClose();
    endSubmit(true);
    if (screenFlag === "ACCT_INQ") {
      const combinedData = { ...rowsData?.[0]?.data, ...data };
      const dataString = JSON.stringify(combinedData);
      sessionStorage.setItem("myData", dataString);
      const newWindow = window.open("/cbsenfinity/view-statement", "_blank");
      if (newWindow) {
        newWindow.focus();
      }
    } else {
      const dataString = JSON.stringify(data);
      sessionStorage.setItem("myData", dataString);
      window.location.reload();
    }
    handleClose();
  };

  let finalMetadata: any = null;
  if (screenFlag === "STATEMENT") {
    finalMetadata = PassbookStatement as MetaDataType;
  } else if (screenFlag === "ACCT_INQ") {
    finalMetadata = PassbookStatementInq as MetaDataType;
  }
  const renderResult = (
    <Dialog open={open} maxWidth={"sm"}>
      {screenFlag === "ACCT_INQ" && acctInqData.isLoading ? (
        <>
          <div style={{ width: "600px", height: "100px" }}>
            <LoaderPaperComponent />
          </div>
        </>
      ) : (
        <FormWrapper
          key={`ViewStatement`}
          metaData={finalMetadata}
          initialValues={acctInqData?.data?.[0] ?? ({} as InitialValuesType)}
          onSubmitHandler={onSubmitHandler}
          // loading={acctInqData.isLoading}
          formStyle={{
            background: "white",
          }}
          controlsAtBottom={true}
          onFormButtonClickHandel={(id) => {}}
          ref={formRef}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                style={{ marginRight: "5px" }}
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                color={"primary"}
                endicon={"CheckCircleOutline"}
                rotateIcon="scale(1.4)"
              >
                Ok
              </GradientButton>
              <GradientButton
                onClick={handleClose}
                color={"primary"}
                endicon="CancelOutlined"
                rotateIcon="scale(1.4) rotateY(360deg)"
              >
                Close
              </GradientButton>
            </>
          )}
        </FormWrapper>
      )}
    </Dialog>
  );
  return renderResult;
};
