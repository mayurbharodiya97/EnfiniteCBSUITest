import {
  InitialValuesType,
  SubmitFnType,
  FormWrapper,
  MetaDataType,
  utilFunction,
} from "@acuteinfo/common-base";
import { FC, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useDialogStyles } from "@acuteinfo/common-base";
import { Transition } from "@acuteinfo/common-base";
import { MerchantTranRetrievalMetadata } from "./metaData";
import { format } from "date-fns";
import { useStyles } from "pages_audit/auth/style";
import { useTranslation } from "react-i18next";
const MerchantTranRetrieval: FC<{
  closeDialog?: any;
  metaData: any;
  defaultData: any;
  retrievalParaValues?: any;
  retrievalType: String;
}> = ({
  closeDialog,
  metaData,
  defaultData,
  retrievalParaValues,
  retrievalType,
}) => {
  // const isErrorFuncRef = useRef<any>(null);
  const actionClasses = useStyles();
  const inputButtonRef = useRef<any>(null);
  const cancleButtonRef = useRef<any>(null);
  const { t } = useTranslation();
  // const classes = useDialogStyles();
  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    //@ts-ignore
    endSubmit(true);
    const colomnKeyLabel = utilFunction.getMetadataLabelFromColumnName(
      MerchantTranRetrievalMetadata,
      Object.keys(data)
    );

    const retrievalValues = Object.entries(data)
      .sort()
      .map((key, val) => {
        let valuedata =
          key?.[0] === "A_FROM_DT" || key?.[0] === "A_TO_DT"
            ? format(new Date(key?.[1] ?? new Date()), "dd/MM/yyyy")
            : key?.[1];
        const [fieldName, value] = key;

        let displayValue = value;
        displayValue = displayData[fieldName].toString();
        if (fieldName === "A_FROM_DT" || fieldName === "A_TO_DT") {
          displayValue = format(new Date(value ?? new Date()), "dd/MM/yyyy");
        }
        return {
          id: key?.[0],
          value: {
            condition: "equal",
            value: valuedata,
            columnName: key?.[0],
            label: colomnKeyLabel[key?.[0]] ?? key,
            displayValue: Boolean(displayValue) ? displayValue : key?.[1],
          },
        };
      });
    retrievalParaValues(retrievalValues, data);
  };

  return (
    <>
      <div
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            inputButtonRef?.current?.click?.();
          }
          if (e.key === "Escape") {
            cancleButtonRef?.current?.click?.();
          }
        }}
      >
        <FormWrapper
          key={"MerchantTranRetrievalMetadata" + retrievalType}
          metaData={MerchantTranRetrievalMetadata as MetaDataType}
          initialValues={defaultData as InitialValuesType}
          onSubmitHandler={onSubmitHandler}
          //@ts-ignore

          formStyle={{
            background: "white",
          }}
          controlsAtBottom={true}
          containerstyle={{ padding: "10px" }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <Button
                className={actionClasses.button}
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                color={"primary"}
                ref={inputButtonRef}
              >
                {t("Ok")}
              </Button>
              <Button
                className={actionClasses.button}
                onClick={closeDialog}
                color={"primary"}
                disabled={isSubmitting}
                ref={cancleButtonRef}
              >
                {t("Close")}
              </Button>
            </>
          )}
        </FormWrapper>
      </div>
    </>
  );
};

export const MerchantTranRetrievalWrapper = ({
  open,
  handleDialogClose,
  metaData,
  defaultData,
  retrievalParaValues,
  retrievalType,
}) => {
  const classes = useDialogStyles();

  return (
    <>
      <Dialog
        open={open}
        //@ts-ignore
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            width: "100%",
            // minHeight: "36vh",
            // height: "36vh",
          },
        }}
        maxWidth="sm"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <MerchantTranRetrieval
          metaData={metaData}
          closeDialog={handleDialogClose}
          defaultData={defaultData}
          retrievalParaValues={retrievalParaValues}
          retrievalType={retrievalType}
        />
      </Dialog>
    </>
  );
};
