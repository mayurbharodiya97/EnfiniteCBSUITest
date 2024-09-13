import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { Fragment, forwardRef, useContext, useState } from "react";
import { TransferAcctDetailFormMetadata } from "./metaData/trnsAcctDtlMetaData";
import { InitialValuesType } from "packages/form";
import { usePopupContext } from "components/custom/popupContext";
import { FDContext } from "../context/fdContext";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import * as API from "../api";
import { enqueueSnackbar } from "notistack";

export const TransferAcctDetailForm = forwardRef<any, any>(
  ({ onSubmitHandler }, ref: any) => {
    const { FDState, updateSourceAcctFormData } = useContext(FDContext);
    const { MessageBox, CloseMessageBox } = usePopupContext();
    const [trnsDtlRefresh, setTrnsDtlRefresh] = useState(0);
    const { t } = useTranslation();

    console.log("FDState", FDState);

    let totalFDAmt = (
      Array.isArray(FDState?.fdDetailFormData?.FDDTL)
        ? FDState?.fdDetailFormData?.FDDTL
        : []
    ).reduce(
      (accum, obj) =>
        accum + Number(obj?.CASH_AMT ?? 0) + Number(obj?.TRSF_AMT ?? 0),
      0
    );

    console.log("totalFDAmt", totalFDAmt);

    return (
      <Fragment>
        <FormWrapper
          key={
            "TransferAcctDetail" +
            FDState?.sourceAcctFormData?.TRNDTLS?.length +
            trnsDtlRefresh
          }
          metaData={TransferAcctDetailFormMetadata as MetaDataType}
          initialValues={
            {
              ...FDState?.sourceAcctFormData,
              TOTAL_FD_AMOUNT: totalFDAmt,
            } as InitialValuesType
          }
          onSubmitHandler={onSubmitHandler}
          hideHeader={true}
          onFormButtonClickHandel={async (id) => {
            if (id === "ADDNEWROW") {
              const data = await ref?.current?.getFieldData();
              // let event: any = { preventDefault: () => {} };
              // ref?.current?.handleSubmit(event);

              console.log("dataaaa", data);

              const dataArray = Array.isArray(data?.TRNDTLS)
                ? data?.TRNDTLS
                : [];

              console.log("dataArray", dataArray);

              if (dataArray?.length === 0) {
                updateSourceAcctFormData([
                  {
                    ACCT_NAME: "",
                  },
                ]);
                setTrnsDtlRefresh((prevVal) => prevVal + 1);
              } else if (
                parseFloat(data?.TOTAL_FD_AMOUNT) > 0 &&
                dataArray?.length > 0
              ) {
                for (let i = 0; i < dataArray?.length; i++) {
                  const item = dataArray[0];

                  console.log("dataArray item", item);

                  if (
                    !Boolean(item.DC_BRANCH_CD.trim()) ||
                    !Boolean(item.DC_ACCT_TYPE.trim()) ||
                    !Boolean(item.DC_ACCT_CD.trim()) ||
                    !Boolean(item.CHEQUE_NO.trim())
                  ) {
                    return await MessageBox({
                      messageTitle: t("ValidationFailed"),
                      message: "Required value missing.",
                    });
                  } else {
                    updateSourceAcctFormData([{}, ...data?.TRNDTLS]);
                    setTrnsDtlRefresh((prevVal) => prevVal + 1);
                  }
                }
              }
            }
          }}
          formStyle={{
            background: "white",
            padding: "5px",
            border: "1px solid var(--theme-color4)",
            borderRadius: "10px",
            docCD: "FDINSTRCRTYPE",
          }}
          formState={{ MessageBox: MessageBox }}
          ref={ref}
        />
      </Fragment>
    );
  }
);
