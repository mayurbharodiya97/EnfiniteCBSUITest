import { Alert } from "components/common/alert";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { usePopupContext } from "components/custom/popupContext";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { InitialValuesType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { forwardRef, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AddNewBeneficiaryDetail } from "../../rtgsEntry/addNewBeneficiaryAcDetail";
import * as API from "./api";
import { queryClient } from "cache";
import { extractMetaData } from "components/utils";
import { BeneficiaryAcctDetailsFormMetaData } from "./metaData/beneficiaryAcctDetailsMetada";

export const BeneficiaryAcctDetailsForm = forwardRef<any, any>(
  ({ accountDetailsForBen, onSubmitHandler, defaultView }, ref: any) => {
    const { MessageBox } = usePopupContext();
    const { authState } = useContext(AuthContext);
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
              onSubmitHandler={onSubmitHandler}
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
