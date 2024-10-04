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
  GradientButton,
} from "@acuteinfo/common-base";
import { CircularProgress } from "@mui/material";
export const BeneficiaryAcctDetailsForm = forwardRef<any, any>(
  (
    {
      accountDetailsForBen,
      onSubmitHandler,
      defaultView,
      handleDialogClose,
      hideHeader,
    },
    ref: any
  ) => {
    const { MessageBox } = usePopupContext();
    const { authState } = useContext(AuthContext);
    const [openAuditTrail, setOpenAuditTrail] = useState(false);
    const [isBenAuditTrailData, setIsBenAuditTrailData] = useState({});
    const { t } = useTranslation();
    const [formMode, setFormMode] = useState(defaultView);

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
              hideHeader={hideHeader ?? true}
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
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  {formMode === "edit" ? (
                    <>
                      <GradientButton
                        onClick={(event) => {
                          handleSubmit(event, "Save");
                        }}
                        disabled={isSubmitting}
                        endIcon={
                          isSubmitting ? <CircularProgress size={20} /> : null
                        }
                        color={"primary"}
                      >
                        {t("Save")}
                      </GradientButton>
                      <GradientButton
                        onClick={() => {
                          setFormMode("view");
                        }}
                        color={"primary"}
                      >
                        {t("Cancel")}
                      </GradientButton>
                    </>
                  ) : formMode === "new" ? (
                    <>
                      <GradientButton
                        onClick={(event) => {
                          handleSubmit(event, "Save");
                        }}
                        disabled={isSubmitting}
                        endIcon={
                          isSubmitting ? <CircularProgress size={20} /> : null
                        }
                        color={"primary"}
                      >
                        {t("Save")}
                      </GradientButton>

                      <GradientButton
                        onClick={handleDialogClose}
                        color={"primary"}
                      >
                        {t("Close")}
                      </GradientButton>
                    </>
                  ) : (
                    <>
                      <GradientButton
                        onClick={() => {
                          setFormMode("edit");
                        }}
                        color={"primary"}
                      >
                        {t("Edit")}
                      </GradientButton>
                      <GradientButton
                        onClick={handleDialogClose}
                        color={"primary"}
                      >
                        {t("Close")}
                      </GradientButton>
                    </>
                  )}
                </>
              )}
            </FormWrapper>
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
