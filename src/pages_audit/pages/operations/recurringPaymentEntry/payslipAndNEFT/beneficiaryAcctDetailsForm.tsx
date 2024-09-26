import { AuthContext } from "pages_audit/auth";
import { forwardRef, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { AddNewBeneficiaryDetail } from "../../rtgsEntry/addNewBeneficiaryAcDetail";
import * as API from "./api";
import { BeneficiaryAcctDetailsFormMetaData } from "./metaData/beneficiaryAcctDetailsMetada";
import { useTranslation } from "react-i18next";

import {
  LoaderPaperComponent,
  extractMetaData,
  queryClient,
  InitialValuesType,
  FormWrapper,
  MetaDataType,
  usePopupContext,
  Alert,
} from "@acuteinfo/common-base";
export const BeneficiaryAcctDetailsForm = forwardRef<any, any>(
  ({ accountDetailsForBen, onSubmitHandler, defaultView }, ref: any) => {
    const { MessageBox } = usePopupContext();
    const { authState } = useContext(AuthContext);
    const [openAuditTrail, setOpenAuditTrail] = useState(false);
    const [isBenAuditTrailData, setIsBenAuditTrailData] = useState({});
    const { t } = useTranslation();

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
            errorMsg={error?.error_msg ?? t("Somethingwenttowrong")}
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
