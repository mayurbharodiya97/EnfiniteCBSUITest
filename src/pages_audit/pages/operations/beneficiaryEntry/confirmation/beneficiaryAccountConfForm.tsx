import {
  FC,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import * as API from "./api";
import { useMutation, useQuery } from "react-query";
import { AuthContext } from "pages_audit/auth";
import {
  AppBar,
  CircularProgress,
  Dialog,
  DialogContent,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import { t } from "i18next";
import {
  usePopupContext,
  LoaderPaperComponent,
  ActionTypes,
  queryClient,
  ClearCacheProvider,
  FormWrapper,
  MetaDataType,
  GradientButton,
  extractMetaData,
  SubmitFnType,
} from "@acuteinfo/common-base";
import { AuditBenfiDetailFormMetadata } from "../gridMetaData";
const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));

const BeneficiaryAccountConfirmForm: FC<{
  formMode?: any;
  rowsData?: any;
  onClose?: any;
  isDataChangedRef?: any;
  handlePrev?: any;
  handleNext?: any;
  currentIndex?: number;
  totalData?: number;
  formLabel?: any;
}> = ({
  formMode,
  rowsData,
  onClose,
  isDataChangedRef,
  handlePrev,
  handleNext,
  currentIndex,
  totalData,
  formLabel,
}) => {
  const { authState } = useContext(AuthContext);
  const headerClasses = useTypeStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { MessageBox, CloseMessageBox } = usePopupContext();
  let currentPath = useLocation().pathname;

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getIfscBenDetail"], () =>
    API.getIfscBenDetail({
      IFSC_CODE: rowsData?.TO_IFSCCODE,
      ENTRY_TYPE: "",
    })
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getIfscBenDetail"]);
    };
  }, []);
  // const mutation: any = useMutation(
  //   "getInwardChequeSignFormData",
  //   API.getInwardChequeSignFormData,
  //   {
  //     onSuccess: (data) => { },
  //     onError: (error: any) => { },
  //   }
  // );

  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    // @ts-ignore
    endSubmit(true);
    if (formMode === "new") {
      delete data["ACTIVE_FLAG"];
      delete data["INACTIVE"];
    } else {
      data["ACTIVE_FLAG"] = Boolean(data["ACTIVE_FLAG"]) ? "Y" : "N";
    }
    // isErrorFuncRef.current = {
    //   data: {
    //     _isNewRow: formMode === "new" ? true : false,
    //     COMP_CD: formMode === "new" ? authState?.companyID : gridData?.COMP_CD,
    //     BRANCH_CD:
    //       formMode === "new"
    //         ? isBenGridData?.[0]?.BRANCH_CD
    //         : gridData?.BRANCH_CD,
    //     TRAN_CD: formMode === "new " ? "" : gridData?.TRAN_CD,
    //     ACCT_TYPE:
    //       formMode === "new"
    //         ? isBenGridData?.[0]?.ACCT_TYPE ?? ""
    //         : gridData?.ACCT_TYPE,
    //     ACCT_CD:
    //       formMode === "new"
    //         ? isBenGridData?.[0]?.ACCT_CD ??
    //         ""
    //         : gridData?.ACCT_CD,
    //     ...data,
    //     FLAG: Boolean(data["FLAG"]) ? "Y" : "N",
    //   },
    //   displayData,
    //   endSubmit,
    //   setFieldError,
    // };
    const buttonName = await MessageBox({
      messageTitle: t("Confirmation"),
      message:
        formMode === "new"
          ? t("AreYouSaveThisRecord")
          : t("AreYouSureInactiveThisRecord"),
      buttonNames: ["Yes", "No"],
      loadingBtnName: ["Yes"],
    });
    // if (buttonName === "Yes") {
    //   getAuditDml.mutate(isErrorFuncRef?.current?.data);
    // }
  };

  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "90%",
        },
      }}
      maxWidth="md"
    >
      {isLoading ? (
        <LoaderPaperComponent />
      ) : (
        <FormWrapper
          key={`AddNewBenfiDetailForm` + currentIndex}
          metaData={
            extractMetaData(
              AuditBenfiDetailFormMetadata,
              formMode
            ) as MetaDataType
          }
          displayMode={"view"}
          onSubmitHandler={onSubmitHandler}
          initialValues={{
            ...data?.[0],
            ...rowsData,
          }}
          formStyle={{
            background: "white",
          }}
          formState={{
            MessageBox: MessageBox,
          }}
        >
          {({ isSubmitting, handleSubmit }) => (
            <>
              <GradientButton
                onClick={() => {
                  if (currentIndex && currentIndex !== totalData) {
                    handleNext();
                  }
                }}
              >
                {t("MoveForward")}
              </GradientButton>
              <GradientButton
                onClick={(e) => {
                  if (currentIndex && currentIndex > 0) {
                    handlePrev();
                  }
                }}
              >
                {t("Previous")}
              </GradientButton>
              <GradientButton
                onClick={(event) => {
                  handleSubmit(event, "Save");
                }}
                disabled={isSubmitting}
                // endIcon={
                //   mutation?.isLoading ? <CircularProgress size={20} /> : null
                // }
                color={"primary"}
              >
                {t("Confirm")}
              </GradientButton>

              <GradientButton
                onClick={() => {
                  onClose();
                }}
                //disabled={isSubmitting}
                color={"primary"}
              >
                {t("Close")}
              </GradientButton>
            </>
          )}
        </FormWrapper>
      )}
    </Dialog>
  );
};

export const BeneficiaryAccountConfirmFormWrapper = ({
  handleDialogClose,
  isDataChangedRef,
  handlePrev,
  handleNext,
  currentIndexRef,
  totalData,
  formLabel,
}) => {
  const { state: rows } = useLocation();
  currentIndexRef.current = rows?.index;

  return (
    <ClearCacheProvider>
      <BeneficiaryAccountConfirmForm
        formMode={rows?.formMode}
        rowsData={rows?.gridData}
        onClose={handleDialogClose}
        handlePrev={handlePrev}
        handleNext={handleNext}
        currentIndex={rows.index}
        isDataChangedRef={isDataChangedRef}
        totalData={totalData}
        formLabel={formLabel}
      />
    </ClearCacheProvider>
  );
};
