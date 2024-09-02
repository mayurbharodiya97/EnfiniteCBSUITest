import {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import { useMutation, useQuery } from "react-query";
import * as API from "./api";
import { useSnackbar } from "notistack";
import { makeStyles } from "@mui/styles";
import {
  Theme,
  Dialog,
} from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import {
  AddNewBenfiDetailGridMetadata,
  AuditBenfiDetailFormMetadata,
} from "./metaData";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { ActionTypes, GridMetaDataType } from "components/dataTable";
import { GradientButton } from "components/styledComponent/button";
import { usePopupContext } from "components/custom/popupContext";
import { extractMetaData, utilFunction } from "components/utils";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { queryClient } from "cache";
import { t } from "i18next";
import { useTranslation } from "react-i18next";



const actions: ActionTypes[] = [
  {
    actionName: "add",
    actionLabel: t("Add"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
  {
    actionName: "view-detail",
    actionLabel: t("ViewDetails"),
    multiple: undefined,
    rowDoubleClick: true,
  },
  {
    actionName: "Close",
    actionLabel: t("Close"),
    multiple: undefined,
    rowDoubleClick: false,
    alwaysAvailable: true,
  },
];
export const AddNewBeneficiaryDetail: FC<{
  isOpen?: any;
  onClose?: any;
  isBenAuditTrailData?: any;
  isRefresh?: any
}> = ({ isOpen, onClose, isBenAuditTrailData, isRefresh }) => {
  const isErrorFuncRef = useRef<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const previousRowData = useRef(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const controllerRef = useRef<AbortController>();
  const myGridRef = useRef<any>(null);
  const [isAddOpen, setisAddOpen] = useState<any>(false);
  const [formMode, setFormMode] = useState<any>("new");
  const [gridData, setGridData] = useState<any>({});
  const { t } = useTranslation();
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getRtgsBenfDtlList"], () =>
    API.getRtgsBenfDtlList({
      COMP_CD: authState?.companyID,
      BRANCH_CD:
        isBenAuditTrailData?.BRANCH_CD ?? authState?.user?.branchCode ?? "",
      ACCT_TYPE: isBenAuditTrailData?.ACCT_TYPE ?? "",
      ACCT_CD:
        isBenAuditTrailData?.ACCT_CD.padStart(6, "0")?.padEnd(20, " ") ?? "",
      FLAG: "D",
    })
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getRtgsBenfDtlList", isOpen]);
    };
  }, []);
  const getIfscBenAcDetail: any = useMutation(API.getIfscBenDetail, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
    },

    onSuccess: (data) => {
      if (data?.[0]?.O_STATUS === "999") {
        MessageBox({
          messageTitle: "Alert",
          message: data?.[0]?.O_MESSAGE,
        });
      }
    },
  });
  const getAuditDml: any = useMutation(API.getAuditDml, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      enqueueSnackbar(errorMsg, {
        variant: "error",
      });
      CloseMessageBox();
    },

    onSuccess: (data) => {
      isRefresh()
      setisAddOpen(false);
      refetch()
      enqueueSnackbar(data, {
        variant: "success",
      });
      CloseMessageBox();
    },
  });

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "add") {
      setisAddOpen(true)
      setFormMode("new")
    } else if (data?.name === "view-detail") {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      controllerRef.current = new AbortController();
      let rowsData = data?.rows?.[0]?.data
      setGridData(rowsData)
      if (
        Boolean(rowsData) &&
        JSON.stringify(rowsData) !== JSON.stringify(previousRowData?.current)
      ) {
        previousRowData.current = rowsData;
        getIfscBenAcDetail.mutate({
          IFSC_CODE: rowsData?.TO_IFSCCODE,
          ENTRY_TYPE: isBenAuditTrailData?.ENTRY_TYPE,
        });
      }
      setFormMode("edit");
      setisAddOpen(true)

    } else if (data?.name === "Close") {
      onClose()
    }
  }, []);

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
      delete data["ACTIVE_FLAG"]
      delete data["INACTIVE"]
    } else {
      data["ACTIVE_FLAG"] = Boolean(data["ACTIVE_FLAG"]) ? "Y" : "N"
    }
    isErrorFuncRef.current = {
      data: {
        _isNewRow: formMode === "new" ? true : false,
        COMP_CD: formMode === "new" ? authState?.companyID : gridData?.COMP_CD,
        BRANCH_CD: formMode === "new" ? isBenAuditTrailData?.BRANCH_CD : gridData?.BRANCH_CD,
        TRAN_CD: formMode === "new " ? "" : gridData?.TRAN_CD,
        ACCT_TYPE: formMode === "new" ? isBenAuditTrailData?.ACCT_TYPE ?? "" : gridData?.ACCT_TYPE,
        ACCT_CD:
          formMode === "new" ? isBenAuditTrailData?.ACCT_CD.padStart(6, "0")?.padEnd(20, " ") ?? "" : gridData?.ACCT_CD,
        ...data,
        FLAG: Boolean(data["FLAG"]) ? "Y" : "N",

      },
      displayData,
      endSubmit,
      setFieldError,
    };
    const buttonName = await MessageBox({
      messageTitle: t("Confirmation"),
      message: formMode === "new" ? t("AreYouSaveThisRecord") : t("AreYouSureInactiveThisRecord"),
      buttonNames: ["No", "Yes"],
      loadingBtnName: ["Yes"],
    });
    if (buttonName === "Yes") {
      getAuditDml.mutate(isErrorFuncRef?.current?.data);
    }

  };

  AddNewBenfiDetailGridMetadata.gridConfig.gridLabel = t("ListOfBeneficiaryAcOrdering") + t("ACNo") + ".: " + authState?.companyID + isBenAuditTrailData?.BRANCH_CD + " / " + isBenAuditTrailData?.ACCT_TYPE + " / " + isBenAuditTrailData?.ACCT_CD
  return (
    <>
      <Dialog
        key="AddNewBenfiDetailDialog"
        open={true}
        maxWidth="lg"
        PaperProps={{
          style: {
            width: "100%",
          },
        }}
      >
        <GridWrapper
          key={`AddNewBenfiDetailGrid${isLoading} `}
          finalMetaData={AddNewBenfiDetailGridMetadata as GridMetaDataType}
          data={data ?? []}
          setData={() => null}
          actions={actions}
          setAction={setCurrentAction}
          loading={isLoading || isFetching}
          refetchData={() => refetch()}
          ref={myGridRef}
        />

      </Dialog >
      <>
        {isAddOpen ? (
          <Dialog
            open={true}
            PaperProps={{
              style: {
                width: "90%",
              },
            }}
            maxWidth="md"

          >
            {getIfscBenAcDetail?.isLoading ? (
              <LoaderPaperComponent />
            ) : (
              <FormWrapper
                key={`AddNewBenfiDetailForm${getIfscBenAcDetail?.isLoading} `}
                metaData={
                  extractMetaData(
                    AuditBenfiDetailFormMetadata,
                    formMode
                  ) as MetaDataType
                }
                displayMode={formMode}
                onSubmitHandler={onSubmitHandler}
                initialValues={
                  formMode === "edit"
                    ? {
                      ...getIfscBenAcDetail?.data?.[0],
                      ...gridData,
                      INACTIVE: gridData?.ACTIVE_FLAG,
                      ACTIVE_FLAG: gridData?.ACTIVE_FLAG === "Y" ? true : false
                    }
                    : {}
                }
                formStyle={{
                  background: "white",
                }}
                formState={{
                  MessageBox: MessageBox,
                }}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    {
                      formMode === "new" ?
                        <GradientButton
                          onClick={(event) => {
                            handleSubmit(event, "Save");
                          }}
                        >
                          {t("Save")}
                        </GradientButton>
                        :
                        gridData?.ACTIVE_FLAG === "Y" ?
                          <GradientButton
                            onClick={(event) => {
                              handleSubmit(event, "Save");
                            }}
                          >
                            {t("Save")}
                          </GradientButton> : null
                    }
                    <GradientButton
                      onClick={() => {
                        setisAddOpen(false);
                      }}
                    >
                      {t("Close")}
                    </GradientButton>
                  </>
                )}
              </FormWrapper>
            )}
          </Dialog>
        ) : null}
      </>
    </>
  );
};
