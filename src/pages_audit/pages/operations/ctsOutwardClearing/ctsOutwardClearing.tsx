import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import { CtsOutwardClearingMetadata } from "./metaData";
import { Alert } from "components/common/alert";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { FormWrapper } from "components/dyanmicForm/formWrapper";
import { useContext } from "react";
import { SubmitFnType } from "packages/form";
import { Toolbar, Typography, AppBar, Theme, Tabs, Tab } from "@mui/material";
import { AuthContext } from "pages_audit/auth";
import { makeStyles } from "@mui/styles";
import { ChequeDetailForm } from "./chequeDetail";
import { SlipDetailForm } from "./slipDetailForm";
import { GradientButton } from "components/styledComponent/button";
import { RetrieveClearingForm } from "./retrieveClearingData";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { extractMetaData } from "components/utils";
import { MetaDataType } from "components/dyanmicForm";

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

// const DynamicForm: FC<{
//   isDataChangedRef: any;
//   closeDialog?: any;
//   item: any;
//   docID: any;
//   gridData: any;
//   alertMessage: any;
//   defaultView?: "view" | "edit" | "add";
//   existingData: any;
// }> = ({
const CtsOutwardClearing: FC<{
  zoneTranType: any;
  defaultView;
}> = ({ zoneTranType, defaultView }) => {
  const { authState } = useContext(AuthContext);
  const [zoneData, setZoneData] = useState<any>({});
  const myRef = useRef<any>(null);
  const formDataRef = useRef<any>({});
  const slipJointDetailRef = useRef<any>({});
  const headerClasses = useTypeStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState("slipdetail");
  // const [formMode, setFormMode] = useState(defaultView);
  console.log("defaultmode", defaultView);
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

  // const handleKeyPress = () => {
  //   let initVal = initValues.chequeDetails ?? [];
  //   let latestRow = initVal[0];
  //   let lastRow = initVal[1];
  //   latestRow = {
  //     ...latestRow,
  //     ...{
  //       DESCRIPTION: lastRow?.DESCRIPTION ?? "",
  //       AMOUNT: lastRow?.AMOUNT ?? "",
  //     },
  //   };

  //   initVal[0] = { ...latestRow };
  //   setInitValues((old) => ({
  //     ...old,
  //     chequeDetails: [...initVal],
  //   }));
  // };
  const mutation: any = useMutation(
    "getAccountSlipJoinDetail",
    API.getAccountSlipJoinDetail,
    {
      onSuccess: (data) => {
        // Directly update the gridData state with the mutation data if data has length
        // if (Array.isArray(data) && data.length) {
        //   setGridData(data);
        // } else {
        //   // Optionally, you can set gridData to an empty array or keep it unchanged
        //   setGridData([]);
        // }
      },
      onError: (error: any) => {
        // Handle error if needed
      },
    }
  );
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getBussinessDate"]);
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
      {/* <AppBar position="relative" color="secondary">
        <Toolbar variant="dense">
          <Typography
            className={headerClasses.title}
            color="inherit"
            variant={"h6"}
            component="div"
          >
            CTS O/W Clearing
          </Typography>
          <GradientButton
            onClick={() => {
              navigate(location.pathname + "/retrieve");
            }}
          >
            Retrieve
          </GradientButton>
        </Toolbar>
      </AppBar> */}
      <FormWrapper
        key={"CtsoutwardForm" + defaultView}
        // metaData={CtsOutwardClearingMetadata}
        metaData={
          extractMetaData(
            CtsOutwardClearingMetadata,
            defaultView
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
        displayMode={defaultView}
        formStyle={{
          background: "white",
          width: "100%",
          padding: "10px",
        }}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            {defaultView === "view" ? (
              <>
                <GradientButton
                  onClick={(event) => {
                    handleSubmit(event, "Save");
                  }}
                  disabled={isSubmitting}
                  //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  color={"primary"}
                >
                  Delete
                </GradientButton>
              </>
            ) : (
              <>
                <GradientButton
                  onClick={() => {
                    console.log("location", location);
                    navigate(location.pathname + "/retrieve");
                  }}
                >
                  Retrieve
                </GradientButton>
                {/* <GradientButton
                  onClick={() => {
                    setFormMode("view");
                  }}
                  color={"primary"}
                  disabled={isSubmitting}
                >
                  Cancel
                </GradientButton> */}
              </>
            )}
          </>
        )}
      </FormWrapper>

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
              defaultView={defaultView}
              result={result?.[0]?.data}
              mutation={mutation}
              slipJointDetailRef={slipJointDetailRef}
            />
          </>
        ) : currentTab === "chequedetail" ? (
          <>
            <ChequeDetailForm
              zoneData={zoneData}
              formDataRef={formDataRef}
              setCurrentTab={setCurrentTab}
              myRef={myRef}
              defaultView={defaultView}
              mutation={mutation}
              slipJointDetailRef={slipJointDetailRef}
            />
          </>
        ) : null}
      </div>
      {/* <Routes>
        <Route
          path="retrieve/*"
          element={
            <RetrieveClearingForm
              // onClose={() => {}}
              onClose={() => navigate(".")}
            />
          }
        />
      </Routes> */}
    </>
  );
};
export const CtsOutwardClearingForm = ({ zoneTranType }) => {
  const { state } = useLocation();
  console.log("rows, formmode", state?.formMode);
  return (
    <ClearCacheProvider>
      <CtsOutwardClearing
        zoneTranType={zoneTranType}
        defaultView={state?.formMode}
      />
    </ClearCacheProvider>
  );
};
