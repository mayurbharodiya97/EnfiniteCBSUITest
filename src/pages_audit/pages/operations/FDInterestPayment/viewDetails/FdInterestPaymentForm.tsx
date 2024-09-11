import { CircularProgress } from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { usePopupContext } from "components/custom/popupContext";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData, utilFunction } from "components/utils";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { FdInterestPaymentFormMetaData } from "./metaData";

const FdInterestPaymentForm = ({
  closeDialog,
  gridData,
  rows,
  defaultView,
  updateGrid,
  updateRow,
  fdDetails,
}) => {
  const { authState } = useContext(AuthContext);
  const [disableButton, setDisableButton] = useState(false);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const [formMode, setFormMode] = useState(defaultView);
  const isCurrentErrorFuncRef = useRef<any>(null);
  const iscarryForwardErrorFuncRef = useRef<any>(null);
  const { t } = useTranslation();
  let currentPath = useLocation().pathname;

  const updateAndCheck = (newData, oldData) => {
    // Update oldData with newData
    for (const key in newData) {
      if (newData.hasOwnProperty(key) && key !== "FD_NO") {
        oldData[key] = newData[key];
      }
    }
    // Call the updateGrid function with the updated oldData
    updateGrid(oldData);
  };
  const isLastRow = () => {
    const currentIndex = gridData.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(rows?.[0]?.data)
    );
    return currentIndex === gridData.length - 1;
  };

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData: any,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);
    const index = gridData.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(rows?.[0]?.data)
    );
    let currentOldData = { ...rows?.[0]?.data };
    const currentfdNo = currentOldData?.FD_NO;
    let flagCheckData =
      fdDetails.find((item) => item.FD_NO === currentfdNo) || {};

    let currentNewData = {
      ...data,
      isNewRow: flagCheckData?.PAYMENT_MODE === "" ? true : false,
    };
    let currentUpd = utilFunction.transformDetailsData(
      currentNewData,
      flagCheckData
    );
    if (actionFlag === "Save") {
      isCurrentErrorFuncRef.current = {
        data: {
          ...currentNewData,
          ...currentUpd,
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: currentOldData?.BRANCH_CD ?? "",
          ACCT_TYPE: currentOldData?.ACCT_TYPE ?? "",
          ACCT_CD: currentOldData?.ACCT_CD ?? "",
        },
        displayData,
        endSubmit,
        setFieldError,
      };
      const btnName = await MessageBox({
        message: "SaveData",
        messageTitle: "Confirmation",
        buttonNames: ["Yes", "No"],
      });
      if (btnName === "Yes") {
        updateAndCheck(currentNewData, currentOldData);
        updateRow(isCurrentErrorFuncRef.current?.data);
        CloseMessageBox();
        closeDialog();
      }
    }
    if (actionFlag === "CarryForward") {
      let carryForwardData = { ...data };
      let nextRowData = gridData[index + 1];
      carryForwardData.FD_NO = nextRowData?.FD_NO;
      let carryForwardflagCheckData =
        fdDetails.find((item) => item.FD_NO === nextRowData?.FD_NO) || {};

      carryForwardData = {
        ...carryForwardData,
        isNewRow: carryForwardflagCheckData?.PAYMENT_MODE === "" ? true : false,
      };
      let carryForwardUpd = utilFunction.transformDetailsData(
        carryForwardData,
        carryForwardflagCheckData
      );

      iscarryForwardErrorFuncRef.current = {
        data: {
          ...carryForwardData,
          ...carryForwardUpd,
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: carryForwardData?.BRANCH_CD ?? "",
          ACCT_TYPE: carryForwardData?.ACCT_TYPE ?? "",
          ACCT_CD: carryForwardData?.ACCT_CD ?? "",
        },
        displayData,
        endSubmit,
        setFieldError,
      };

      let btnName = await MessageBox({
        messageTitle: "Confirmation",
        message: `${t(`CarryForwardmsg`, {
          CURRENT_FD_NO: currentOldData.FD_NO,
          CARRYFORWARD_FD_NO: carryForwardData.FD_NO,
        })}`,
        buttonNames: ["Yes", "No"],
      });
      if (btnName === "Yes") {
        updateAndCheck(carryForwardData, nextRowData);
        updateRow(iscarryForwardErrorFuncRef.current?.data);
        closeDialog();
      }
    }
  };
  const handleButtonDisable = (disable) => {
    setDisableButton(disable);
  };

  FdInterestPaymentFormMetaData.form.label =
    utilFunction.getDynamicLabel(currentPath, authState?.menulistdata, false) +
    " " +
    rows?.[0]?.data?.FD_NO;

  return (
    <>
      <FormWrapper
        key={"FdInterestPaymentFormDetails" + formMode}
        metaData={
          extractMetaData(
            FdInterestPaymentFormMetaData,
            formMode
          ) as MetaDataType
        }
        displayMode={formMode}
        onSubmitHandler={onSubmitHandler}
        initialValues={{
          ...(rows?.[0]?.data ?? {}),
        }}
        formStyle={{
          background: "white",
          margin: "10px 0",
        }}
        formState={{
          MessageBox: MessageBox,
          handleButtonDisable: handleButtonDisable,
          docCD: "FDINSTRCRTYPE",
          fdDetails:
            fdDetails.find((item) => item.FD_NO === rows?.[0]?.data?.FD_NO) ||
            {},
          rowsData: rows,
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            {formMode === "edit" ? (
              <>
                {!isLastRow() && (
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "CarryForward");
                    }}
                    disabled={isSubmitting || disableButton}
                    color={"primary"}
                  >
                    {t("Carry Forward")}
                  </GradientButton>
                )}
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting || disableButton}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton
                  onClick={closeDialog}
                  disabled={isSubmitting || disableButton}
                  color={"primary"}
                >
                  {t("Close")}
                </GradientButton>
              </>
            ) : formMode === "new" ? (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting || disableButton}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton
                  onClick={closeDialog}
                  disabled={isSubmitting || disableButton}
                  color={"primary"}
                >
                  {t("Close")}
                </GradientButton>
              </>
            ) : (
              <>
                {!isLastRow() && (
                  <GradientButton
                    onClick={(event) => {
                      handleSubmit(event, "CarryForward");
                    }}
                    color={"primary"}
                  >
                    {t("Carry Forward")}
                  </GradientButton>
                )}
                <GradientButton
                  onClick={() => {
                    setFormMode("edit");
                  }}
                  color={"primary"}
                >
                  {t("Edit")}
                </GradientButton>
                <GradientButton onClick={closeDialog} color={"primary"}>
                  {t("Close")}
                </GradientButton>
              </>
            )}
          </>
        )}
      </FormWrapper>
    </>
  );
};

export const FdInterestPaymentDetail = ({
  closeDialog,
  gridData,
  rows,
  defaultView,
  updateGrid,
  updateRow,
  fdDetails,
}) => {
  return (
    <>
      {gridData ? (
        <FdInterestPaymentForm
          closeDialog={closeDialog}
          gridData={gridData}
          rows={rows}
          updateGrid={updateGrid}
          updateRow={updateRow}
          defaultView={defaultView}
          fdDetails={fdDetails}
        />
      ) : (
        <LoaderPaperComponent />
      )}
    </>
  );
};
