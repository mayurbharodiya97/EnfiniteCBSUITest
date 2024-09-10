import { CircularProgress, Dialog } from "@mui/material";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { usePopupContext } from "components/custom/popupContext";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GradientButton } from "components/styledComponent/button";
import { extractMetaData, utilFunction } from "components/utils";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { Transition } from "pages_audit/common";
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
  const [formKey, setFormKey] = useState(0);

  const updateAndCheck = (newData, oldData) => {
    // Update oldData with newData
    Object.keys(newData).forEach((key) => {
      if (
        typeof newData[key] !== "boolean" &&
        Boolean(newData[key]?.trim()) &&
        key !== "FD_NO"
      ) {
        oldData[key] = newData[key];
      }
      if (!(key in oldData)) {
        oldData[key] = newData[key];
      }
    });
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
    setFieldError
  ) => {
    // @ts-ignore
    endSubmit(true);
    const index = gridData.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(rows?.[0]?.data)
    );
    let currentOldData = { ...rows?.[0]?.data };

    const currentfdNo = rows?.[0]?.data?.FD_NO;
    let flagCheckData =
      fdDetails.find((item) => item.FD_NO === currentfdNo) || {};
    let currentNewData = {
      ...data,
    };

    let currentUpd = utilFunction.transformDetailsData(
      currentNewData,
      currentOldData
    );

    isCurrentErrorFuncRef.current = {
      data: {
        ...currentNewData,
        ...currentUpd,
        COMP_CD: authState?.companyID ?? "",
        BRANCH_CD: currentOldData?.BRANCH_CD ?? "",
        ACCT_TYPE: currentOldData?.ACCT_TYPE ?? "",
        ACCT_CD: currentOldData?.ACCT_CD ?? "",
        isNewRow: flagCheckData?.PAYMENT_MODE === "" ? true : false,
      },
      displayData,
      endSubmit,
      setFieldError,
    };

    if (formMode !== "view") {
      if (isCurrentErrorFuncRef.current?.data?._UPDATEDCOLUMNS.length === 0) {
        setFormMode("view");
      } else {
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
    }
    if (formMode === "view" && !isLastRow()) {
      let carryForwardNewData = { ...data };
      let carryForwardData = gridData[index + 1];
      carryForwardNewData.FD_NO = carryForwardData?.FD_NO;
      const carryfdNo = carryForwardData?.FD_NO;
      let carryForwardflagCheckData =
        fdDetails.find((item) => item.FD_NO === carryfdNo) || {};
      carryForwardNewData = {
        ...carryForwardNewData,
        isNewRow: carryForwardflagCheckData?.PAYMENT_MODE === "" ? true : false,
      };
      let carryForwardUpd = utilFunction.transformDetailsData(
        carryForwardNewData,
        carryForwardflagCheckData
      );

      iscarryForwardErrorFuncRef.current = {
        data: {
          ...carryForwardNewData,
          ...carryForwardUpd,
          COMP_CD: authState?.companyID ?? "",
          BRANCH_CD: carryForwardData?.BRANCH_CD ?? "",
          ACCT_TYPE: carryForwardData?.ACCT_TYPE ?? "",
          ACCT_CD: carryForwardData?.ACCT_CD ?? "",
          isNewRow:
            carryForwardflagCheckData.PAYMENT_MODE === "" ? true : false,
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
        if (currentNewData.PAYMENT_MODE === "NEFT") {
          carryForwardData.CR_ACCT_TYPE = "";
          carryForwardData.CR_ACCT_CD = "";
          carryForwardData.CR_BRANCH_CD = "";
          carryForwardData.CR_ACCT_NM = "";
          updateAndCheck(carryForwardNewData, carryForwardData);
          updateRow(iscarryForwardErrorFuncRef.current?.data);
          closeDialog();
        } else if (currentNewData.PAYMENT_MODE === "BANKACCT") {
          carryForwardData.ACCT_NM = "";
          carryForwardData.ADD1 = "";
          carryForwardData.CONTACT_INFO = "";
          carryForwardData.TO_IFSCCODE = "";
          carryForwardData.BANK = "";
          carryForwardData.TO_ACCT_NO = "";
          carryForwardData.TO_ACCT_TYPE = "";
          carryForwardData.TO_ACCT_NM = "";
          carryForwardData.TO_CONTACT_NO = "";
          carryForwardData.TO_ADD1 = "";
          updateAndCheck(carryForwardNewData, carryForwardData);
          updateRow(iscarryForwardErrorFuncRef.current?.data);
          closeDialog();
        }
      }
    }
  };
  const handleButtonDisable = (disable) => {
    setDisableButton(disable);
  };
  const handleCancel = () => {
    setFormMode("view");
    setFormKey((prevKey) => prevKey + 1);
  };

  FdInterestPaymentFormMetaData.form.label =
    utilFunction.getDynamicLabel(currentPath, authState?.menulistdata, false) +
    " " +
    rows?.[0]?.data?.FD_NO;

  return (
    <>
      <FormWrapper
        key={"FdInterestPaymentFormDetails" + formMode + formKey}
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
          rowData:
            fdDetails.find((item) => item.FD_NO === rows?.[0]?.data?.FD_NO) ||
            {},
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
                  disabled={isSubmitting || disableButton}
                  endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  {t("Save")}
                </GradientButton>
                <GradientButton
                  onClick={handleCancel}
                  disabled={isSubmitting || disableButton}
                  color={"primary"}
                >
                  {t("Cancel")}
                </GradientButton>
                {/* <GradientButton
                  onClick={closeDialog}
                  disabled={isSubmitting || disableButton}
                  color={"primary"}
                >
                  {t("Close")}
                </GradientButton> */}
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
                      handleSubmit(event, "Save");
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
    <Dialog
      open={true}
      // @ts-ignore
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          width: "100%",
          overflow: "auto",
        },
      }}
      maxWidth="lg"
    >
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
    </Dialog>
  );
};
