import {
  InitialValuesType,
  SubmitFnType,
  FormWrapper,
  MetaDataType,
  utilFunction,
  RetrievalParametersProps,
} from "@acuteinfo/common-base";
import { FC, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useDialogStyles } from "@acuteinfo/common-base";
import { Transition } from "@acuteinfo/common-base";
import { SmsEmailRetrievalMetadata } from "./metaData";
import { format } from "date-fns";
import { useStyles } from "pages_audit/auth/style";
import { useTranslation } from "react-i18next";
const SmsEmailRetrieval: FC<{
  closeDialog?: any;
  metaData: any;
  defaultData: any;
  retrievalParaValues?: any;
}> = ({ closeDialog, metaData, defaultData, retrievalParaValues }) => {
  const actionClasses = useStyles();
  const inputButtonRef = useRef<any>(null);
  const cancleButtonRef = useRef<any>(null);
  const { t } = useTranslation();
  const onSubmitHandler: SubmitFnType = (data, displayData, endSubmit) => {
    //@ts-ignore
    endSubmit(true);
    const colomnKeyLabel = utilFunction.getMetadataLabelFromColumnName(
      SmsEmailRetrievalMetadata,
      Object.keys(data)
    );
    // delete data["MOBILE_NO"];
    // delete data["EMAIL_ID"];

    const retrievalValues = Object.entries(data)
      .sort()
      .map((key, val) => {
        const [fieldName, value] = key;
        let displayValue = value;
        displayValue = displayData[fieldName]?.toString();

        if (fieldName === "A_FROM_DT" || fieldName === "A_TO_DT") {
          displayValue = format(new Date(value ?? new Date()), "dd/MM/yyyy");
        }
        return {
          id: key?.[0],
          value: {
            condition: "equal",
            value:
              key?.[0] === "A_FROM_DT" || key?.[0] === "A_TO_DT"
                ? format(new Date(key?.[1] ?? new Date()), "dd/MM/yyyy")
                : key?.[1],
            columnName: key?.[0],
            label:
              (key?.[0] === "A_FILTER_VALUE"
                ? data["A_FLAG"] === "S"
                  ? "Mobile Number"
                  : "Email ID"
                : colomnKeyLabel[key?.[0]]) ?? "",
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
          key={"SmsEmailRetrievalMetadata"}
          metaData={SmsEmailRetrievalMetadata as MetaDataType}
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

export const SmsEmailRetrievalWrapper: FC<RetrievalParametersProps> = ({
  open,
  handleClose,
  metaData,
  defaultData,
  retrievalParaValues,
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
          },
        }}
        maxWidth="sm"
        classes={{
          scrollPaper: classes.topScrollPaper,
          paperScrollBody: classes.topPaperScrollBody,
        }}
      >
        <SmsEmailRetrieval
          metaData={metaData}
          closeDialog={handleClose}
          defaultData={defaultData}
          retrievalParaValues={retrievalParaValues}
        />
      </Dialog>
    </>
  );
};
