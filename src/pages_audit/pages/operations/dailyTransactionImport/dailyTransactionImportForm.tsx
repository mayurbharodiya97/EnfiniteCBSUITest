import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import FormWrapper from "components/dyanmicForm";
import { usePopupContext } from "components/custom/popupContext";
import { GridMetaDataType } from "components/dataTableStatic";
import {
  DailyTransactionImportGridMetaData,
  DailyTransactionImportMetadata,
} from "./dailyTransactionImportMetadata";
import { ActionTypes } from "components/dataTable";
import { AuthContext } from "pages_audit/auth";
import { ClearCacheProvider } from "cache";
import * as API from "./api";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useMutation } from "react-query";
import { enqueueSnackbar } from "notistack";
import { SubmitFnType } from "packages/form";
import { GradientButton } from "components/styledComponent/button";
import { CircularProgress, Dialog } from "@mui/material";
import { FileUploadControl } from "components/fileUpload";

const actions: ActionTypes[] = [
  {
    actionName: "errors",
    actionLabel: t("errors"),
    multiple: false,
    alwaysAvailable: true,
  },
];
const DailyTransactionImport = () => {
  const { authState } = useContext(AuthContext);
  const formRef = useRef<any>(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { t } = useTranslation();
  const [gridData, setGridData] = useState<any>([]);
  const hasUpdated = useRef(false);
  const [isSelectFileOpen, setIsSelectFileOpen] = useState(false);
  const gridRef = useRef<any>(null);
  const [actionMenu, setActionMenu] = useState(actions);
  const [filteredGridData, setFilteredGridData] = useState<any>([]);
  const [paraType, setParaType] = useState("E");
  const [reqPara, setReqPara] = useState({});

  const setCurrentAction = useCallback(async (data) => {
    if (data.name === "errors") {
      setActionMenu((values: any) => {
        return values.map((item) => {
          if (item.actionName === "errors") {
            return { ...item, actionName: "all", actionLabel: t("All") };
          } else {
            return item;
          }
        });
      });
      setParaType("A");
    } else if (data.name === "all") {
      setActionMenu((values: any) => {
        return values.map((item) => {
          if (item.actionName === "all") {
            return {
              ...item,
              actionName: "errors",
              actionLabel: t("errors"),
            };
          } else {
            return item;
          }
        });
      });
      setParaType("E");
    }
  }, []);
  useEffect(() => {
    if (Array.isArray(gridData)) {
      if (paraType === "E") {
        setFilteredGridData(gridData.filter((item) => item.STATUS === "Y"));
      } else if (paraType === "A") {
        setFilteredGridData(gridData);
      }
    }
  }, [gridData, paraType]);

  const getDailyTransactionUploadData: any = useMutation(
    API.getDailyTransactionImportData,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: async (data, variables) => {
        enqueueSnackbar(t("DataSaveSuccessfully"), {
          variant: "success",
        });
        formRef?.current?.handleFormReset({ preventDefault: () => {} });
        setGridData([]);
      },
    }
  );
  const deleteImportedData: any = useMutation(API.deleteImportedData, {
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
    onSuccess: async (data, variables) => {
      setIsSelectFileOpen(true);
      CloseMessageBox();
    },
  });
  const getValidateToSelectFile: any = useMutation(
    API.getValidateToSelectFile,
    {
      onError: (error: any) => {
        let errorMsg = "Unknown Error occured";
        if (typeof error === "object") {
          errorMsg = error?.error_msg ?? errorMsg;
        }
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      },
      onSuccess: async (data, variables) => {
        setReqPara(variables);
        // for (let i = 0; i < data?.length; i++) {
        if (data[0]?.O_STATUS === "9") {
          MessageBox({
            messageTitle: t("Alert"),
            message: data[0]?.O_MESSAGE,
          });
        } else if (data[0]?.O_STATUS === "99") {
          const buttonName = await MessageBox({
            messageTitle: t("Confirmation"),
            message: data[0]?.O_MESSAGE,
            // buttonNames: ["No", "Yes"],
            buttonNames: ["Merge", "Replace"],
            loadingBtnName: ["Replace"],
          });
          if (buttonName === "Replace") {
            deleteImportedData.mutate({
              A_COMP_CD: authState?.companyID,
              WORKING_DATE: variables?.WORKING_DATE,
              A_TABLE_NM: variables?.A_TABLE_NM,
              A_BRANCH_CD: variables?.A_BRANCH_CD,
              A_ACCT_TYPE: variables?.A_ACCT_TYPE,
              A_ACCT_CD: variables?.A_ACCT_CD,
            });
          } else if (buttonName === "Merge") {
            setIsSelectFileOpen(true);
          }
        } else if (data[0]?.O_STATUS === "999") {
          MessageBox({
            messageTitle: t("ValidationFailed"),
            message: data[0]?.O_MESSAGE,
          });
        } else if (data[0]?.O_STATUS === "0") {
          setIsSelectFileOpen(true);
        }
        // }
      },
    }
  );
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    data["OPP_ENT"] = Boolean(data["OPP_ENT"]) ? "Y" : "N";
    data["IGNR_INSUF"] = Boolean(data["IGNR_INSUF"]) ? "Y" : "N";
    if (actionFlag === "SELECT") {
      getValidateToSelectFile.mutate({
        A_BRANCH_CD: data?.FROM_BRANCH_CD,
        A_ACCT_TYPE: data?.FROM_ACCT_TYPE,
        A_ACCT_CD: data?.FROM_ACCT_CD,
        A_CHEQUE_NO: data?.CHEQUE_NO,
        A_TYPE_CD: data?.TYPE_CD,
        A_TRAN_CD: data?.TRAN_CD,
        A_TABLE_NM: data?.TABLE_NM,
        A_SCREEN_REF: "MST/454",
        A_LOG_COMP: authState?.companyID,
        A_LOG_BRANCH: authState?.user?.branchCode,
        WORKING_DATE: authState.workingDate,
        USERNAME: authState?.user?.name,
        USERROLE: authState?.role,
        ...data,
      });
    } else {
      if (
        gridRef.current?.cleanData?.().length &&
        gridRef.current?.cleanData?.().length > 0
      ) {
        getDailyTransactionUploadData.mutate({
          COMP_CD: authState.companyID,
          BRANCH_CD: authState?.user?.branchCode,
          ACCT_TYPE: data?.FROM_ACCT_TYPE,
          ACCT_CD: data?.FROM_ACCT_CD,
          FLAG: "P",
          IGNR_INSUF: data?.IGNR_INSUF,
          CHEQUE_NO: data?.CHEQUE_NO,
          OPP_ENT: data?.OPP_ENT,
          REMARKS: data?.REMARKS,
          TABLE_NM: data?.TABLE_NM,
        });
      }
    }
    endSubmit(true);
  };

  if (
    DailyTransactionImportGridMetaData &&
    gridData.length > 0 &&
    !hasUpdated.current
  ) {
    DailyTransactionImportGridMetaData.gridConfig.gridLabel =
      DailyTransactionImportGridMetaData.gridConfig.gridLabel +
      " " +
      gridData[0]?.DEBIT_AC;
    hasUpdated.current = true; // Set flag to true to prevent further updates
  }

  return (
    <>
      <FormWrapper
        key={"DailyTransactionImportForm"}
        metaData={DailyTransactionImportMetadata}
        initialValues={{}}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          height: "auto",
        }}
        formState={{
          MessageBox: MessageBox,
        }}
        ref={formRef}
        onFormButtonClickHandel={() => {
          let event: any = { preventDefault: () => {} };
          formRef?.current?.handleSubmit(event, "SELECT");
        }}
        setDataOnFieldChange={(action, payload) => {
          if (action === "GRID_DETAIL") {
            setGridData(payload);
          }
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              onClick={(event) => {
                handleSubmit(event, "Save");
              }}
              disabled={isSubmitting}
              endIcon={
                getDailyTransactionUploadData.isLoading ? (
                  <CircularProgress size={20} />
                ) : null
              }
              color={"primary"}
            >
              {t("UploadData")}
            </GradientButton>
          </>
        )}
      </FormWrapper>

      <>
        <GridWrapper
          key={
            `DailyTransactionImportGrid` +
            gridData +
            hasUpdated.current +
            paraType
          }
          finalMetaData={DailyTransactionImportGridMetaData as GridMetaDataType}
          data={filteredGridData ?? []}
          setData={setGridData}
          actions={actionMenu}
          setAction={setCurrentAction}
          ref={gridRef}
        />
      </>

      {isSelectFileOpen && (
        <>
          <Dialog fullWidth maxWidth="md" open={isSelectFileOpen}>
            <FileUploadControl
              key={"DailyTransactionFileUploadData"}
              onClose={() => {
                setIsSelectFileOpen(false);
              }}
              editableFileName={false}
              defaultFileData={[]}
              onUpload={async (
                formDataObj,
                proccessFunc,
                ResultFunc,
                base64Object,
                result
              ) => {
                const request = {
                  ...base64Object[0],
                  ...reqPara,
                };
                console.log(
                  "base64Object",
                  request,
                  formDataObj,
                  proccessFunc,
                  ResultFunc,
                  result
                );
              }}
              gridProps={{}}
              maxAllowedSize={1024 * 1204 * 10} //10Mb file
              allowedExtensions={["xlsx", "pdf", "csv", "txt", "xls", "TXT"]}
              onUpdateFileData={(files) => {}}
            />
          </Dialog>
        </>
      )}
    </>
  );
};

export const DailyTransactionImportForm = () => {
  return (
    <ClearCacheProvider>
      <DailyTransactionImport />
    </ClearCacheProvider>
  );
};
