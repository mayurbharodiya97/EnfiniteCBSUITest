import {
  FC,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
import { useMutation } from "react-query";
import * as API from "./api";
import { ClearCacheContext } from "cache";
import { useSnackbar } from "notistack";
import {
  SlipDetailFormMetaData,
  SlipJoinDetailGridMetaData,
  ChequeDetailFormMetaData,
} from "./metaData";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useLocation, useNavigate } from "react-router-dom";
import GridWrapper from "components/dataTableStatic";
import { format } from "date-fns";
import { ActionTypes } from "components/dataTable";
import { PopupRequestWrapper } from "components/custom/popupMessage";
import { extractMetaData } from "components/utils";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { Alert } from "components/common/alert";

export const useDialogStyles = makeStyles((theme: Theme) => ({
  topScrollPaper: {
    alignItems: "center",
  },
  topPaperScrollBody: {
    verticalAlign: "top",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--white)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
}));
const actions: ActionTypes[] = [
  {
    actionName: "view-details",
    actionLabel: "Edit Detail",
    multiple: undefined,
    rowDoubleClick: true,
  },
];
export const SlipDetailForm: FC<{
  formDataRef?: any;
  myRef?: any;
  setCurrentTab?: any;
  formMode?: any;
  result?: any;
  slipJointDetailRef?: any;
  setGridData?: any;
  gridData?: any;
  retrievData?: any;
  loading?: any;
  error?: any;
}> = ({
  formDataRef,
  setCurrentTab,
  myRef,
  formMode,
  result,
  slipJointDetailRef,
  setGridData,
  gridData,
  retrievData,
  loading,
  error,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { authState } = useContext(AuthContext);
  const mySlipRef = useRef<any>(null);
  const [message, setMessage] = useState<any>();
  const [isOpenSave, setIsOpenSave] = useState<any>(false);

  const setCurrentAction = useCallback(
    (data) => {
      slipJointDetailRef.current = data?.rows?.[0]?.data?.REF_PERSON_NAME;
      setCurrentTab("chequedetail");
    },
    [slipJointDetailRef]
  );

  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    mySlipRef?.current?.handleSubmit(event, "BUTTON_CLICK");
    mySlipRef?.current?.handleSubmit(event, "AC_NAME");
    myRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };

  const onSubmitHandlerSlip: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldErrors,
    value,
    event
  ) => {
    //@ts-ignore

    endSubmit(true);
    data = {
      ...data,
      PROCESSED: "N",
      SKIP_ENTRY: "N",
      COMP_CD: authState?.companyID ?? "",
      _isNewRow: true,
    };

    if (value === "BUTTON_CLICK") {
      formDataRef.current = data;
    }
  };

  const updatedMetaData = {
    ...SlipDetailFormMetaData,
    fields: SlipDetailFormMetaData.fields[0]._fields.map((field) => {
      if (field.name === "BRANCH_CD") {
        return {
          ...field,
          defaultValue: authState?.user?.branchCode ?? "",
        };
      } else if (field.name === "COMP_CD") {
        return {
          ...field,
          defaultValue: authState?.companyID ?? "",
        };
      }

      return field;
    }),
  };

  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            let target: any = e?.target;
            if (
              (target?.name ?? "") ===
              updatedMetaData.form.name + "/AMOUNT"
            ) {
              ClickEventManage();
              setCurrentTab("chequedetail");
              ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused =
                true;
            }
          }
        }}
      >
        {formMode === "new" ? (
          <FormWrapper
            key={`SlipDetailFormMetaData-` + formMode}
            // metaData={updatedMetaData as MetaDataType}
            metaData={
              extractMetaData(updatedMetaData, formMode) as MetaDataType
            }
            onSubmitHandler={onSubmitHandlerSlip}
            initialValues={formDataRef.current ?? {}}
            // initialValues={formDataRef.current ?? {}}
            hideHeader={true}
            displayMode={formMode}
            formStyle={{
              background: "white",
            }}
            ref={mySlipRef}
            setDataOnFieldChange={(action, paylod) => {
              if (paylod?.ACCT_JOIN_DETAILS) {
                setGridData(paylod);
              }
              let accountMessage = paylod.RESTRICT_MESSAGE || paylod.MESSAGE1;
              setMessage(accountMessage);
              setIsOpenSave(true);
            }}
          />
        ) : formMode === "view" ? (
          <>
            {loading ? (
              <LoaderPaperComponent />
            ) : error ? (
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            ) : (
              <FormWrapper
                key={`SlipDetailFormMetaData-` + formMode}
                metaData={
                  extractMetaData(updatedMetaData, formMode) as MetaDataType
                }
                // metaData={updatedMetaData as MetaDataType}
                onSubmitHandler={onSubmitHandlerSlip}
                initialValues={retrievData?.SLIP_DETAIL ?? {}}
                // initialValues={formDataRef.current ?? {}}
                hideHeader={true}
                displayMode={formMode}
                formStyle={{
                  background: "white",
                }}
                ref={mySlipRef}
                setDataOnFieldChange={(action, paylod) => {
                  if (paylod?.ACCT_JOIN_DETAILS) {
                    setGridData(paylod);
                  }
                  let accountMessage =
                    paylod.RESTRICT_MESSAGE || paylod.MESSAGE1;
                  setMessage(accountMessage);
                  setIsOpenSave(true);
                }}
              />
            )}
          </>
        ) : null}
      </div>

      {gridData?.ACCT_JOIN_DETAILS && gridData?.ACCT_JOIN_DETAILS.length ? (
        <GridWrapper
          key={"SlipJoinDetailGridMetaData" + gridData}
          finalMetaData={SlipJoinDetailGridMetaData}
          data={gridData?.ACCT_JOIN_DETAILS ?? []}
          setData={() => null}
          // loading={isLoading || isFetching}
          actions={actions}
          setAction={setCurrentAction}
          // refetchData={() => refetch()}
          // ref={myGridRef}
          // defaultSortOrder={[{ id: "TRAN_CD", desc: false }]}
        />
      ) : null}

      {isOpenSave ? (
        <PopupRequestWrapper
          MessageTitle="Account Description"
          Message={message}
          onClickButton={(rows, buttonName) => setIsOpenSave(false)}
          buttonNames={["Ok"]}
          rows={[]}
          open={isOpenSave}
        />
      ) : null}
    </>
  );
};
