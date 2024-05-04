import {
  AppBar,
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PopupMessageAPIWrapper } from "components/custom/popupMessage";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { usePopupContext } from "components/custom/popupContext";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GridMetaDataType } from "components/dataTableStatic";
import { LienGridMetaData } from "./lienEntryGridMetaData";
import { LienEntryMetadata } from "./lienEntryMetadata";
import { ActionTypes } from "components/dataTable";
import { Alert } from "components/common/alert";
import { AuthContext } from "pages_audit/auth";
import { SubmitFnType } from "packages/form";
import { enqueueSnackbar } from "notistack";
import { ExpireLien } from "./expireLien";
import { useMutation } from "react-query";
import { ClearCacheProvider, queryClient } from "cache";
import * as API from "./api";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { format } from "date-fns";

const LienEntryCustom = () => {
  const actions: ActionTypes[] = [
    {
      actionName: "expire-lien",
      actionLabel: "Expire Lien",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const [gridDetailData, setGridDetailData] = useState<any>([]);
  const [closeAlert, setCloseAlert] = useState<any>(true);
  const [isVisible, setIsVisible] = useState<any>(false);
  const [isOpenSave, setIsOpenSave] = useState(false);
  const { authState } = useContext(AuthContext);
  const [value, setValue] = useState("tab1");
  const { MessageBox } = usePopupContext();
  const insertDataRef = useRef<any>(null);
  const myMasterRef = useRef<any>(null);
  const navigate = useNavigate();

  const getLienDetail: any = useMutation("lienGridDetail", API.lienGridDetail, {
    onSuccess: (data) => {
      setGridDetailData(data);
    },
    onError: (error: any) => {
      setCloseAlert(true);
    },
  });

  const crudLienData: any = useMutation("crudLien", API.crudLien, {
    onSuccess: (data, variables) => {
      if (data?.O_STATUS !== "0") {
        setIsOpenSave(false);
        MessageBox({
          messageTitle: "Validation Alert",
          message: data?.[0]?.O_MESSAGE,
        });
      } else {
        setIsOpenSave(false);
        setIsVisible(false);
        myMasterRef?.current?.handleFormReset({ preventDefault: () => {} });
        enqueueSnackbar("Data insert successfully", { variant: "success" });
      }
    },
    onError: (error: any) => {
      setIsOpenSave(false);
      setCloseAlert(true);
    },
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["lienGridDetail"]);
      queryClient.removeQueries(["crudLien"]);
      queryClient.removeQueries(["validateInsert"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = (data: any, displayData, endSubmit) => {
    let apiReq = {
      REMOVAL_DT: data?.REMOVAL_DT
        ? format(new Date(data?.REMOVAL_DT), "dd-MMM-yyyy")
        : "",
      EFECTIVE_DT: format(new Date(data?.EFECTIVE_DT), "dd-MMM-yyyy"),
      SCREEN_REF: "ETRN/652",
    };
    insertDataRef.current = { ...data, ...apiReq };
    setIsOpenSave(true);
    //@ts-ignore
    endSubmit(true);
  };

  const setCurrentAction = useCallback(
    async (data) => {
      if (data?.rows?.[0]?.data?.CONFIRMED === "Pending") {
        MessageBox({
          messageTitle: "Alert Message",
          message: "Lien Entry Not Confirmed",
        });
      } else if (data?.rows?.[0]?.data?.LIEN_STATUS === "Expired") {
        MessageBox({
          messageTitle: "Alert Message",
          message: "Lien Entry Expired you can't modified.",
        });
      } else if (data?.rows?.[0]?.data?.LIEN_STATUS === "Active") {
        let res = await MessageBox({
          messageTitle: "Confirmation",
          message: "Are you sure to Expire Lien ?",
          buttonNames: ["Yes", "No"],
        });
        if (res === "Yes") {
          navigate(data?.name, {
            state: data?.rows,
          });
        }
      }
    },
    [navigate]
  );

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          sx={{ ml: "25px" }}
          onChange={(event, newValue) => {
            setValue(newValue);
            setGridDetailData([]);
            setCloseAlert(false);
            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  LienGridMetaData.gridConfig.gridLabel = `Lien Detail \u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " ")
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                  const RequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
                  };
                  getLienDetail.mutate(RequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label="Lien Entry" />
          {isVisible && <Tab value="tab2" label="Lien Detail" />}
        </Tabs>
      </Box>

      <Container>
        <Grid
          sx={{
            backgroundColor: "var(--theme-color2)",
            padding: "0px",
            borderRadius: "10px",
            boxShadow:
              "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px;",
          }}
        >
          {(getLienDetail?.isError && closeAlert) ||
          (crudLienData?.isError && closeAlert) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    getLienDetail?.error?.error_msg ??
                    crudLienData?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    getLienDetail?.error?.error_detail ??
                    crudLienData?.error?.error_detail ??
                    ""
                  }
                  color="error"
                />
              </AppBar>
            </div>
          ) : (
            <LinearProgressBarSpacer />
          )}

          <div style={{ display: value === "tab1" ? "inherit" : "none" }}>
            <FormWrapper
              key={"lien-Entry"}
              metaData={LienEntryMetadata ?? {}}
              initialValues={{}}
              onSubmitHandler={onSubmitHandler}
              ref={myMasterRef}
              formState={{ MessageBox: MessageBox }}
              setDataOnFieldChange={(action, payload) => {
                if (action === "IS_VISIBLE") {
                  setIsVisible(payload.IS_VISIBLE);
                }
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <Button
                    onClick={(event) => {
                      handleSubmit(event, "Save");
                    }}
                    // disabled={isSubmitting}
                    //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                    color={"primary"}
                  >
                    Save
                  </Button>
                </>
              )}
            </FormWrapper>
          </div>

          <div style={{ display: value === "tab2" ? "inherit" : "none" }}>
            <GridWrapper
              key={`LienGrid-MetaData`}
              finalMetaData={LienGridMetaData as GridMetaDataType}
              data={gridDetailData ?? []}
              setData={() => {}}
              loading={getLienDetail.isLoading}
              actions={actions}
              setAction={setCurrentAction}
              // refetchData={() => {}}
              // ref={myGridQuickRef}
            />
            <Routes>
              <Route
                path="expire-lien/*"
                element={
                  <ExpireLien
                    navigate={navigate}
                    getLienDetail={getLienDetail}
                  />
                }
              />
            </Routes>
          </div>
        </Grid>
      </Container>

      {isOpenSave && (
        <PopupMessageAPIWrapper
          MessageTitle={"Confirmation"}
          Message={"Are you sure you want to insert?"}
          onActionYes={() =>
            crudLienData.mutate({ ...insertDataRef.current, _isNewRow: true })
          }
          onActionNo={() => setIsOpenSave(false)}
          rows={[]}
          open={isOpenSave}
          loading={crudLienData.isLoading}
        />
      )}
    </>
  );
};

export const LienEntry = () => {
  return (
    <ClearCacheProvider>
      <LienEntryCustom />
    </ClearCacheProvider>
  );
};
