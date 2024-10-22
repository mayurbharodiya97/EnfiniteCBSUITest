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
import { QrGeneratedRetrievalMetadata } from "./metaData";
import { format } from "date-fns";
import { useStyles } from "pages_audit/auth/style";
import { useTranslation } from "react-i18next";
const QrGeneratedRetrieval: FC<{
  closeDialog?: any;
  metaData: any;
  defaultData: any;
  retrievalParaValues?: any;
}> = ({ closeDialog, metaData, defaultData, retrievalParaValues }) => {
  const actionClasses = useStyles();
  const inputButtonRef = useRef<any>(null);
  const cancleButtonRef = useRef<any>(null);
  const { t } = useTranslation();
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
      QrGeneratedRetrievalMetadata,
      Object.keys(data)
    );
    console.log(">>displayData", displayData);
    const retrievalValues = Object.entries(data)
      .sort()
      .map((key, val) => {
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
            value:
              key?.[0] === "A_FROM_DT" || key?.[0] === "A_TO_DT"
                ? format(new Date(key?.[1] ?? new Date()), "dd/MM/yyyy")
                : key?.[1],
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
          key={"QrGeneratedRetrieval"}
          metaData={QrGeneratedRetrievalMetadata as MetaDataType}
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

export const QrGeneratedRetrievalWrapper = ({
  open,
  handleDialogClose,
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
        <QrGeneratedRetrieval
          metaData={metaData}
          closeDialog={handleDialogClose}
          defaultData={defaultData}
          retrievalParaValues={retrievalParaValues}
        />
      </Dialog>
    </>
  );
};
