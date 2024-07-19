import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { usePopupContext } from "components/custom/popupContext";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { forwardRef, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AddNewBeneficiaryDetail } from "../../rtgsEntry/addNewBeneficiaryAcDetail";
import * as API from "./api";
import { queryClient } from "cache";
import { extractMetaData } from "components/utils";
import { AppBar, Theme, Toolbar, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { BeneficiaryAcctDetailsFormMetaData } from "./metaData/beneficiaryAcctDetailsMetada";

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));

export const BeneficiaryAcctDetailsForm = forwardRef<any, any>(
  ({ accountDetailsForBen, benefSubmitHandler, defaultView }, ref: any) => {
    const { MessageBox } = usePopupContext();
    const { authState } = useContext(AuthContext);
    const headerClasses = useTypeStyles();
    const [openAuditTrail, setOpenAuditTrail] = useState(false);
    const [isBenAuditTrailData, setIsBenAuditTrailData] = useState({});

    const {
      data: NEFTFlagsData,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
    } = useQuery<any, any>(["getNEFTFlags", authState?.user?.branchCode], () =>
      API.getNEFTFlags({
        COMP_CD: authState?.companyID,
        BRANCH_CD: authState?.user?.branchCode,
      })
    );

    const onClose = () => {
      setOpenAuditTrail(false);
    };

    useEffect(() => {
      return () => {
        queryClient.removeQueries([
          "getNEFTFlags",
          authState?.user?.branchCode,
        ]);
      };
    }, []);

    return (
      <>
        {isLoading ? (
          <LoaderPaperComponent />
        ) : isError ? (
          <Alert
            severity="error"
            errorMsg={error?.error_msg ?? "Something went to wrong.."}
            errorDetail={error?.error_detail ?? ""}
            color="error"
          />
        ) : (
          <>
            <AppBar position="relative" style={{ marginBottom: "10px" }}>
              <Toolbar variant="dense" className={headerClasses.root}>
                <Typography
                  component="span"
                  variant="h5"
                  className={headerClasses.title}
                >
                  {`${
                    accountDetailsForBen?.SCREEN_NAME
                  }\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 Branch: ${
                    accountDetailsForBen?.BRANCH_CD ?? ""
                  }\u00A0\u00A0   A/c Type: ${
                    accountDetailsForBen?.ACCT_TYPE ?? ""
                  }\u00A0\u00A0   A/c No.: ${
                    accountDetailsForBen?.ACCT_CD ?? ""
                  }\u00A0\u00A0`}
                </Typography>
              </Toolbar>
            </AppBar>
            <FormWrapper
              key={"beneficiaryAcctDetailsForm" + accountDetailsForBen}
              metaData={
                extractMetaData(
                  BeneficiaryAcctDetailsFormMetaData,
                  defaultView
                ) as MetaDataType
              }
              hideHeader={true}
              initialValues={
                {
                  ...accountDetailsForBen,
                } as InitialValuesType
              }
              onSubmitHandler={benefSubmitHandler}
              ref={ref}
              formState={{
                MessageBox: MessageBox,
                NEFTFlagsData: NEFTFlagsData,
                ENTRY_TYPE: accountDetailsForBen?.ENTRY_TYPE,
              }}
              onFormButtonClickHandel={async (action) => {
                if (action.slice(action.indexOf(".") + 1) === "BENEFICIARY") {
                  setOpenAuditTrail(true);
                  setIsBenAuditTrailData({
                    ACCT_CD: accountDetailsForBen?.ACCT_CD ?? "",
                    ACCT_TYPE: accountDetailsForBen?.ACCT_TYPE ?? "",
                    BRANCH_CD: accountDetailsForBen?.BRANCH_CD ?? "",
                    ENTRY_TYPE: accountDetailsForBen?.ENTRY_TYPE ?? "",
                  });
                }
              }}
              formStyle={{
                background: "white",
              }}
            />
          </>
        )}

        {openAuditTrail && (
          <AddNewBeneficiaryDetail
            onClose={onClose}
            isBenAuditTrailData={isBenAuditTrailData}
          />
        )}
      </>
    );
  }
);
