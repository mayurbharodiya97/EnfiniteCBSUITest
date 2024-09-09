import { Button, Dialog } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { t } from "i18next";
import { useRef, useState } from "react";
import { TemplateDetailMetadata } from "./templateMetadata";
import { useLocation } from "react-router-dom";
import { usePopupContext } from "components/custom/popupContext";
import { SubmitFnType } from "packages/form";
import { utilFunction } from "components/utils";

export const TemplateDetail = ({
  getFormData,
  refData,
  onClose,
  open,
  rowsData,
}) => {
  const { state: rows }: any = useLocation();
  const [optionData, setOptionData] = useState([]);
  const optionRef = useRef<any>(optionData);
  optionRef.current = optionData;
  const { MessageBox } = usePopupContext();
  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    // @ts-ignore
    endSubmit(true);
      const FilterOptionData = optionRef?.current.filter((row) => {
        return row.value === data?.TEMPLATE_CODE;
      });
      getFormData({ ...data, TEMP_DISP: FilterOptionData?.[0]?.label });
  };
  return (
    <Dialog
      open={open}
      fullWidth={true}
      PaperProps={{
        style: {
          maxWidth: "1004px",
          padding: "5px",
        },
      }}
    >
      <FormWrapper
        key={"gst-template-detail"}
        metaData={TemplateDetailMetadata as MetaDataType}
        initialValues={rowsData?.[0]?.data ?? []}
        formState={{
          MessageBox: MessageBox,
          REFDATA: refData,
          optionRef: setOptionData,
        }}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <Button
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              color={"primary"}
            >
              {rows?.length ? t("Update") : t("Add")}
            </Button>

            <Button onClick={onClose} color={"primary"}>
              {t("Close")}
            </Button>
          </>
        )}
      </FormWrapper>
    </Dialog>
  );
};
