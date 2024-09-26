import { forwardRef } from "react";
import { PayslipAndDDFormMetaData } from "./metaData/payslipAndDDMetaData";
import {
  InitialValuesType,
  extractMetaData,
  FormWrapper,
  MetaDataType,
  usePopupContext,
} from "@acuteinfo/common-base";
export const PayslipAndDDForm = forwardRef<any, any>(
  ({ defaultView, accountDetailsForPayslip, onSubmitHandler }, ref: any) => {
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
          onSubmitHandler={onSubmitHandler}
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
