import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useState } from "react";
import {
  FixDepositParaFormMetadata,
  FixDepositAccountsFormMetadata,
} from "./metaData";
import { InitialValuesType, SubmitFnType } from "packages/form";

export const DetailForm = forwardRef<any, any>(
  ({ onSubmitHandler, setDataOnFieldChange }, ref) => {
    const [isOpenFDAcct, setIsOpenFDAcct] = useState({ open: false, data: [] });
    return (
      <Fragment>
        <FormWrapper
          key={"FixDepositDetail"}
          // metaData={MobileAppReviewMetaData}
          metaData={FixDepositParaFormMetadata as MetaDataType}
          initialValues={{} as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          hideHeader={true}
          formStyle={{
            background: "white",
            // height: "56vh",
            // overflowY: "auto",
            // overflowX: "hidden",
            padding: "10px",
            border: "1px solid var(--theme-color4)",
            borderRadius: "10px",
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
          }}
          ref={ref}
          setDataOnFieldChange={(action, payload) => {
            if (action === "CUSTOMER_ID_FEFORE") {
              setIsOpenFDAcct({ open: false, data: [] });
            } else if (action === "CUSTOMER_ID") {
              if (
                Boolean(payload?.value) &&
                Array.isArray(payload?.FD_ACCTS) &&
                payload?.FD_ACCTS?.length > 0
              ) {
                setIsOpenFDAcct({ open: true, data: payload?.FD_ACCTS });
              }
            } else {
              setDataOnFieldChange(action, payload);
            }
          }}
        />
        {isOpenFDAcct?.open && (
          <FormWrapper
            key={"FDAccounts" + isOpenFDAcct}
            // metaData={MobileAppReviewMetaData}
            metaData={FixDepositAccountsFormMetadata as MetaDataType}
            initialValues={{ FDACCTS: isOpenFDAcct?.data } as InitialValuesType}
            onSubmitHandler={onSubmitHandler}
            hideHeader={true}
            formStyle={{
              background: "white",
              // height: "56vh",
              // overflowY: "auto",
              // overflowX: "hidden",
              padding: "10px",
              border: "1px solid var(--theme-color4)",
              borderRadius: "10px",
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
            }}
            ref={ref}
          />
        )}
      </Fragment>
    );
  }
);
