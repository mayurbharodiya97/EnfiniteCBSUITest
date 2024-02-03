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
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { StockGridMetaData } from "./stockGridMetadata";
import { StockEntryMetaData } from "./stockEntryMetadata";
import { useMutation } from "react-query";
import { crudDocument, securityFieldDTL, stockGridData } from "./api";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { StockEditViewWrapper } from "./stockEditViewWrapper";
import { PopupRequestWrapper } from "components/custom/popupMessage";
import { queryClient } from "cache";
import { CreateDetailsRequestData } from "components/utils";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { Alert } from "components/common/alert";

export const StockEntry = () => {
  const detailActions: ActionTypes[] = [
    {
      actionName: "view-details",
      actionLabel: "Edit Detail",
      multiple: false,
      rowDoubleClick: true,
    },
  ];

  const [value, setValue] = useState("tab1");
  const myMasterRef = useRef<any>(null);
  const initialValuesRef = useRef<any>(null);
  const navigate = useNavigate();
  const [gridDetailData, setGridDetailData] = useState<any>();
  const [visibleTab, setVisibleTab] = useState<any>(false);
  const { authState } = useContext(AuthContext);
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  let [messageArray, setmessageArray] = useState<any>([]);

  const [newFormMTdata, setNewFormMTdata] = useState<any>(StockEntryMetaData);

  const securityStoclDTL: any = useMutation(
    "securityLimitData",
    securityFieldDTL,
    {
      onSuccess: (data) => {
        let newData;
        if (data.length > 0) {
          let newMetadata: any = [...StockEntryMetaData.fields, ...data];
          newData = { ...newFormMTdata, fields: newMetadata };
        } else {
          newData = { ...StockEntryMetaData };
        }
        setNewFormMTdata(newData);
      },
      onError: (error: any) => {},
    }
  );

  const stockEntryGridData: any = useMutation("stockGridData", stockGridData, {
    onSuccess: (data) => {
      setGridDetailData(data);
    },
    onError: (error: any) => {},
  });

  const crudDocuments: any = useMutation("uploadDocument", crudDocument, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["stockGridData"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);
  };

  const setCurrentAction = useCallback(
    (data) => {
      navigate(data?.name, {
        state: data?.rows,
      });
    },
    [navigate]
  );

  const ClosedEventCall = useCallback(() => {
    navigate(".");
  }, [navigate]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);

            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                initialValuesRef.current = res;
                // if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                // StockGridMetaData.gridConfig.gridLabel = `Stock-Entry Detail \u00A0\u00A0 ${(
                //   authState?.companyID +
                //   res?.BRANCH_CD +
                //   res?.ACCT_TYPE +
                //   res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " ")
                // ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                const DTLRequestPara = {
                  // COMP_CD: authState?.companyID,
                  // ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
                  // ACCT_TYPE: res?.ACCT_TYPE,
                  // BRANCH_CD: res?.BRANCH_CD,
                  COMP_CD: authState?.companyID,
                  ACCT_CD: "000073              ",
                  ACCT_TYPE: "301 ",
                  BRANCH_CD: "099 ",
                };
                stockEntryGridData.mutate(DTLRequestPara);
                // }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label="Stock Entry" />
          {/* {visibleTab &&
          } */}
          <Tab value="tab2" label="Stock Detail" />
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
          {securityStoclDTL?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    securityStoclDTL?.error?.error_msg ?? "Unknow Error"
                  }
                  errorDetail={securityStoclDTL?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : null}
          {value === "tab1" ? (
            <>
              {securityStoclDTL.isLoading || securityStoclDTL.isFetching ? (
                <LinearProgress color="secondary" />
              ) : (
                <LinearProgressBarSpacer />
              )}
              <FormWrapper
                key={"stockEntry" + setNewFormMTdata}
                metaData={newFormMTdata ?? []}
                initialValues={initialValuesRef.current ?? []}
                onSubmitHandler={onSubmitHandler}
                hideHeader={false}
                ref={myMasterRef}
                setDataOnFieldChange={(action, payload) => {
                  if (action === "MESSAGES") {
                    if (payload?.MESSAGES) {
                      const messageArray = payload?.MESSAGES.split(", ").map(
                        (msg, i) => <p key={i}>{`(${i + 1})  ${msg}`}</p>
                      );
                      setmessageArray([messageArray]);
                      setIsOpenSave(true);
                      setVisibleTab(payload?.VISIBLE_TAB);
                    }
                  } else if (action === "VISIBLE_TAB") {
                    setVisibleTab(payload?.VISIBLE_TAB);
                  }
                  if (action === "SECURITY_CODE") {
                    securityStoclDTL.mutate({
                      COMP_CD: authState?.companyID,
                      SECURITY_CD: payload,
                      BRANCH_CD: authState?.user?.branchCode,
                    });
                  }
                }}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    <Button
                      onClick={(event) => {
                        handleSubmit(event, "Save");
                      }}
                      disabled={isSubmitting}
                      //endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                      color={"primary"}
                    >
                      Save
                    </Button>
                  </>
                )}
              </FormWrapper>
            </>
          ) : value === "tab2" ? (
            <>
              <GridWrapper
                key={`stockGridData` + stockEntryGridData.isSuccess}
                finalMetaData={StockGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                loading={stockEntryGridData.isLoading}
                actions={detailActions}
                // controlsAtBottom={true}
                setAction={setCurrentAction}
                onClickActionEvent={(index, id, data) => {
                  console.log("<<<action", index, id, data);
                  let result: any = [data];
                  // let finalResult = result.filter(
                  //   (one) => !Boolean(one?._hidden)
                  // );
                  let newData = result.map((item) => {
                    const newItem = {
                      ...item,
                      _hidden: true,
                    };
                    return newItem;
                  });
                  newData = CreateDetailsRequestData(newData);
                  console.log("<<<CreateDetailsRequestData", newData);
                  let ApiReq = {
                    DETAILS_DATA: newData,
                  };
                  crudDocuments.mutate(ApiReq);
                }}
                // headerToolbarStyle={{
                //   background: "var(--theme-color2)",
                //   color: "black",
                // }}
                // refetchData={() => {}}
                // ref={myGridQuickRef}
              />

              <Routes>
                <Route
                  path="view-details/*"
                  element={
                    <StockEditViewWrapper ClosedEventCall={ClosedEventCall} />
                  }
                />
              </Routes>
            </>
          ) : null}
        </Grid>
      </Container>

      {isOpenSave && messageArray?.length > 0 && (
        <div
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setIsOpenSave(false);
              setmessageArray([]);
            }
          }}
        >
          <PopupRequestWrapper
            MessageTitle={"Account Description"}
            Message={messageArray ? messageArray : "something is wrong "}
            onClickButton={(rows, buttonName) => {
              setIsOpenSave(false);
              setmessageArray([]);
            }}
            buttonNames={["Ok"]}
            rows={[]}
            open={isOpenSave}
          />
        </div>
      )}
    </>
  );
};
