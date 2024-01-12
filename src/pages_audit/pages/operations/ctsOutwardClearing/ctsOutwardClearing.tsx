import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import {
  CtsOutwardClearingMetadata,
  ViewCtsOutwardClearingMetadata,
} from "./metaData";
import { Alert } from "components/common/alert";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { useContext } from "react";
import { SubmitFnType } from "packages/form";
import { Theme, Tabs, Tab } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { makeStyles } from "@mui/styles";
import { ChequeDetailForm } from "./chequeDetail";
import { SlipDetailForm } from "./slipDetailForm";
import { GradientButton } from "components/styledComponent/button";
import { RetrieveClearingForm } from "./retrieveClearingData";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { extractMetaData } from "components/utils";
import { MetaDataType } from "components/dyanmicForm";
import { LoaderPaperComponent } from "components/common/loaderPaper";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { useSnackbar } from "notistack";

const useTypeStyles = makeStyles((theme: Theme) => ({
  root: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    background: "var(--theme-color5)",
  },
  title: {
    flex: "1 1 100%",
    color: "var(--theme-color2)",
    letterSpacing: "1px",
    fontSize: "1.5rem",
  },
  refreshiconhover: {},
}));

const CtsOutwardClearing: FC<{
  zoneTranType: any;
  defaultView?: any;
  tranCD?: any;
}> = ({ zoneTranType, defaultView, tranCD }) => {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const formDataRef = useRef<any>({});
  const myRef = useRef<any>(null);
  const slipJointDetailRef = useRef<any>({});
  const [zoneData, setZoneData] = useState<any>({});
  const [gridData, setGridData] = useState<any>();
  const [currentTab, setCurrentTab] = useState("slipdetail");
  const [isDelete, SetDelete] = useState(false);
  const [formMode, setFormMode] = useState(defaultView);
  const location = useLocation();
  const navigate = useNavigate();

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
  const deleteMutation = useMutation(API.outwardClearingConfigDML, {
    onError: (error: any) => {},
    onSuccess: (data) => {
      // isDataChangedRef.current = true;
      enqueueSnackbar("Records successfully deleted", {
        variant: "success",
      });
      // closeDialog();
      SetDelete(false);
      setFormMode("new");
      // result[0]?.refetch();
      // refetch();
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

  const handleChangeTab = (_, currentTab) => {
    setCurrentTab(currentTab);
  };

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
    data = {
      ...data,
      COMP_CD: authState?.companyID ?? "",
      BRANCH_CD: authState?.user?.branchCode ?? "",
      ENTERED_COMP_CD: authState?.companyID ?? "",
      ENTERED_BRANCH_CD: authState?.user?.branchCode ?? "",
      _isNewRow: true,
      REQUEST_CD: "",
      TRAN_TYPE: zoneTranType ?? "",
      endSubmit,
      setFieldError,
    };
    setZoneData(data);
  };

  if (CtsOutwardClearingMetadata?.fields?.[1]) {
    CtsOutwardClearingMetadata.fields[1].requestProps = zoneTranType ?? "";
  }

  return (
    <>
      {formMode === "new" ? (
        <>
          <FormWrapper
            key={"CtsoutwardForm" + formMode}
            // metaData={CtsOutwardClearingMetadata}
            metaData={
              extractMetaData(
                CtsOutwardClearingMetadata,
                formMode
              ) as MetaDataType
            }
            initialValues={{
              ...zoneData,
              TRAN_DT: new Date(result?.[0]?.data?.[0]?.DATE ?? new Date()),
              ENTERED_BY: authState?.user?.name ?? "",
            }}
            ref={myRef}
            onSubmitHandler={onSubmitHandler}
            // hideHeader={true}
            //@ts-ignore
            displayMode={formMode}
            formStyle={{
              background: "white",
              width: "100%",
              padding: "10px",
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
              initialValues={data?.[0] ?? ""}
              ref={myRef}
              onSubmitHandler={onSubmitHandler}
              // hideHeader={true}
              //@ts-ignore
              displayMode={formMode}
              formStyle={{
                background: "white",
                width: "100%",
                padding: "10px",
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

      <div style={{ padding: "08px" }}>
        <Tabs
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          value={currentTab}
          onChange={handleChangeTab}
        >
          <Tab label="Slip Detail" value="slipdetail" id="0" />
          <Tab label="Cheque Detail" value="chequedetail" id="1" />
        </Tabs>

        {currentTab === "slipdetail" ? (
          <>
            <SlipDetailForm
              formDataRef={formDataRef}
              setCurrentTab={setCurrentTab}
              myRef={myRef}
              formMode={formMode}
              result={result?.[0]?.data}
              slipJointDetailRef={slipJointDetailRef}
              setGridData={setGridData}
              gridData={gridData}
              retrievData={data?.[0]}
              loading={isLoading || isFetching}
              error={isError}
            />
          </>
        ) : currentTab === "chequedetail" ? (
          <>
            <ChequeDetailForm
              zoneData={zoneData}
              formDataRef={formDataRef}
              setCurrentTab={setCurrentTab}
              myRef={myRef}
              formMode={formMode}
              slipJointDetailRef={slipJointDetailRef}
              gridData={gridData}
              retrievData={data?.[0]}
              loading={isLoading || isFetching}
              error={isError}
            />
          </>
        ) : null}
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
