import { usePopupContext } from "components/custom/popupContext";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { extractMetaData } from "components/utils";
import { InitialValuesType } from "packages/form";
import { forwardRef } from "react";
import { PayslipAndDDFormMetaData } from "./metaData/payslipAndDDMetaData";

export const PayslipAndDDForm = forwardRef<any, any>(
  (
    { defaultView, accountDetailsForPayslip, payslipSubmitHandler },
    ref: any
  ) => {
    const { MessageBox } = usePopupContext();

    return (
      <>
        <FormWrapper
          key={"payslipAndDDForm" + accountDetailsForPayslip}
          metaData={
            extractMetaData(
              PayslipAndDDFormMetaData,
              defaultView
            ) as MetaDataType
          }
          hideHeader={true}
          initialValues={{ ...accountDetailsForPayslip } as InitialValuesType}
          onSubmitHandler={payslipSubmitHandler}
          ref={ref}
          formState={{
            MessageBox: MessageBox,
            accountDetailsForPayslip: accountDetailsForPayslip,
          }}
          formStyle={{
            background: "white",
          }}
        />
      </>
    );
  }
);
