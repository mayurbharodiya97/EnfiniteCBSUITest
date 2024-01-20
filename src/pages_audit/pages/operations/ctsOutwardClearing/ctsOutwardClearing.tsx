import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  ChequeDetailFormMetaData,
  CtsOutwardClearingMetadata,
  ViewCtsOutwardClearingMetadata,
} from "./metaData";
import { Alert } from "components/common/alert";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { useContext } from "react";
import { SubmitFnType } from "packages/form";
import { Theme, Tabs, Tab, AppBar } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { makeStyles } from "@mui/styles";
import { ChequeDetailForm } from "./chequeDetail";
import { GradientButton } from "components/styledComponent/button";
import { RetrieveClearingForm } from "./retrieveClearingData";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { extractMetaData } from "components/utils";
import { MetaDataType } from "components/dyanmicForm";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import {
  PopupMessageAPIWrapper,
  PopupRequestWrapper,
} from "components/custom/popupMessage";
import { useSnackbar } from "notistack";

const CtsOutwardClearing: FC<{
  zoneTranType: any;
  defaultView?: any;
  tranCD?: any;
}> = ({ zoneTranType, defaultView, tranCD }) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const myRef = useRef<any>(null);
  const [gridData, setGridData] = useState<any>();
  const [formData, setFormData] = useState<any>();
  const [message, setMessage] = useState<any>();
  const [isOpenSave, setIsOpenSave] = useState(false);
  const [isDelete, SetDelete] = useState(false);
  const [isOpenProcced, setIsOpenProcced] = useState(false);
  const [formMode, setFormMode] = useState(defaultView);
  const location = useLocation();
  const navigate = useNavigate();
  const isErrorFuncRef = useRef<any>(null);
  const [initValues, setInitValues] = useState<any>({
    chequeDetails: [
      {
        ECS_SEQ_NO: "",
        // isRemoveButton: true,
      },
    ],
  });

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<
    any,
    any
  >(["getOutwardClearingConfigData", tranCD], () =>
    API.getOutwardClearingConfigData({
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      TRAN_CD: tranCD,
    })
  );

  const result = useQueries([
    {
      queryKey: ["getBussinessDate"],
      queryFn: () =>
        API.getBussinessDate({
          companyID: authState?.companyID ?? "",
          branchID: authState?.user?.branchCode ?? "",
        }),
    },
  ]);
  const mutationOutward = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      if (isErrorFuncRef.current == null) {
        enqueueSnackbar(errorMsg, {
          variant: "error",
        });
      } else {
        isErrorFuncRef.current?.endSubmit(
          false,
          errorMsg,
          error?.error_detail ?? ""
        );
      }
      // onActionCancel();
    },
    onSuccess: (data) => {
      setFormData(() => ({}));
      setInitValues(() => ({
        chequeDetails: [],
      }));
      myRef.current.data = {};
      setGridData(() => ({}));
      enqueueSnackbar(data, {
        variant: "success",
      });

      setFormMode("new");
      setIsOpenProcced(false);
      // onActionCancel();
    },
  });
  const onSubmitHandler: SubmitFnType = async (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value,
    event
  ) => {
    //@ts-ignore
    endSubmit(true);
  };
  const deleteMutation = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      // isDataChangedRef.current = true;
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });

      SetDelete(false);
      setFormMode("new");
    },
  });

  const onAcceptDelete = (rows) => {
    deleteMutation.mutate({
      DAILY_CLEARING: {
        TRAN_CD: tranCD,
        ENTERED_COMP_CD: authState.companyID,
        ENTERED_BRANCH_CD: authState.user.branchCode,
      },
      DETAILS_DATA: {
        isNewRow: [],
        isDeleteRow: [
          {
            ENTERED_COMP_CD: authState.companyID,
            ENTERED_BRANCH_CD: authState.user.branchCode,
            TRAN_CD: tranCD,
          },
        ],
        isUpdatedRow: [],
      },
      _isDeleteRow: true,
    });
  };

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBussinessDate"]);
      queryClient.removeQueries(["getOutwardClearingConfigData"]);
    };
  }, []);

  if (CtsOutwardClearingMetadata?.fields?.[1]) {
    CtsOutwardClearingMetadata.fields[1].requestProps = zoneTranType ?? "";
  }
  const updatedMetaData = {
    ...CtsOutwardClearingMetadata,
    fields: CtsOutwardClearingMetadata.fields?.map((field) => {
      if (field.name === "BRANCH_CD") {
        return {
          ...field,
          defaultValue: authState?.user?.branchCode ?? "",
        };
      }
      return field;
    }),
  };

  return (
    <>
      <div
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            let target: any = e?.target;
            if (
              (target?.name ?? "") ===
              updatedMetaData.form.name + "/AMOUNT"
            ) {
              myRef?.current?.getFieldData().then((res) => {
                setFormData(res);
              });
              ChequeDetailFormMetaData.fields[0]._fields[0].isFieldFocused =
                true;
            }
          }
        }}
      >
        {formMode === "new" ? (
          <>
            <FormWrapper
              key={"CtsoutwardForm" + formMode + mutationOutward.isSuccess}
              // metaData={CtsOutwardClearingMetadata}
              metaData={
                extractMetaData(updatedMetaData, formMode) as MetaDataType
              }
              initialValues={
                mutationOutward.isSuccess
                  ? {}
                  : {
                      ...formData,
                      TRAN_DT: new Date(
                        result?.[0]?.data?.[0]?.DATE ?? new Date()
                      ),
                      ENTERED_BY: authState?.user?.name ?? "",
                    }
              }
              // initialValues={{
              //   ...formData,
              //   TRAN_DT: new Date(result?.[0]?.data?.[0]?.DATE ?? new Date()),
              //   ENTERED_BY: authState?.user?.name ?? "",
              // }}
              ref={myRef}
              onSubmitHandler={onSubmitHandler}
              setDataOnFieldChange={(action, paylod) => {
                if (paylod?.ACCT_JOIN_DETAILS) {
                  setGridData(paylod);
                }
                let accountMessage = paylod.RESTRICT_MESSAGE || paylod.MESSAGE1;
                setMessage(accountMessage);
                setIsOpenSave(true);
              }}
              // hideHeader={true}
              //@ts-ignore
              displayMode={formMode}
              formStyle={{
                background: "white",
                width: "100%",
                padding: "05px",
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <GradientButton
                    onClick={() => {
                      navigate(location.pathname + "/retrieve");
                      setFormMode("view");
                    }}
                  >
                    Retrieve
                  </GradientButton>
                </>
              )}
            </FormWrapper>
          </>
        ) : formMode === "view" ? (
          <>
            {isLoading || isFetching ? (
              <LoaderPaperComponent />
            ) : isError ? (
              <Alert
                severity="error"
                errorMsg={error?.error_msg ?? "Error"}
                errorDetail={error?.error_detail ?? ""}
                color="error"
              />
            ) : (
              <FormWrapper
                key={"CtsoutwardForm" + formMode}
                // metaData={CtsOutwardClearingMetadata}
                metaData={
                  extractMetaData(
                    ViewCtsOutwardClearingMetadata,
                    formMode
                  ) as MetaDataType
                }
                initialValues={{
                  ...(data?.[0]?.SLIP_DETAIL || {}),
                  ...(data?.[0] || {}),
                }}
                ref={myRef}
                // onSubmitHandler={onSubmitHandler}
                // hideHeader={true}
                //@ts-ignore
                displayMode={formMode}
                formStyle={{
                  background: "white",
                  width: "100%",
                  padding: "05px",
                }}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    <>
                      <GradientButton
                        onClick={() => {
                          navigate(location.pathname + "/retrieve");
                        }}
                      >
                        Retrieve
                      </GradientButton>
                    </>
                    <>
                      <GradientButton
                        onClick={() => {
                          setFormMode("new");
                        }}
                      >
                        new
                      </GradientButton>
                    </>
                    <>
                      <GradientButton
                        onClick={() => {
                          SetDelete(true);
                        }}
                      >
                        Delete
                      </GradientButton>
                    </>
                  </>
                )}
              </FormWrapper>
            )}
          </>
        ) : null}

        <>
          <ChequeDetailForm
            formData={formData}
            setFormData={setFormData}
            myRef={myRef}
            formMode={formMode}
            gridData={gridData}
            retrievData={data?.[0]}
            loading={isLoading || isFetching}
            error={isError}
            zoneTranType={zoneTranType}
            mutationOutward={mutationOutward}
            setIsOpenProcced={setIsOpenProcced}
            isOpenProcced={isOpenProcced}
            initValues={initValues}
            setInitValues={setInitValues}
          />
        </>
      </div>
      <Routes>
        <Route
          path="retrieve/*"
          element={
            <RetrieveClearingForm
              zoneTranType={zoneTranType}
              onClose={() => navigate(".")}
              setFormMode={setFormMode}
            />
          }
        />
      </Routes>
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
      {isDelete ? (
        <PopupMessageAPIWrapper
          MessageTitle="Confirmation"
          Message="Are you sure to delete selected row?"
          onActionYes={(rows) => onAcceptDelete(rows)}
          onActionNo={() => SetDelete(false)}
          rows={{}}
          open={isDelete}
          loading={deleteMutation.isLoading}
        />
      ) : null}
    </>
  );
};
export const CtsOutwardClearingForm = ({ zoneTranType }) => {
  const { state: rows }: any = useLocation();
  return (
    <ClearCacheProvider>
      <CtsOutwardClearing
        zoneTranType={zoneTranType}
        defaultView={"new" ?? rows?.formMode}
        tranCD={rows?.rows?.[0]?.data?.TRAN_CD ?? ""}
      />
    </ClearCacheProvider>
  );
};
