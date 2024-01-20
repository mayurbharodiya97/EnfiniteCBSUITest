import { Box, Button, Container, Grid, Tab, Tabs } from "@mui/material";
import React, { useCallback, useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { StockGridMetaData } from "./stockGridMetadata";
import { StockEntryMetaData } from "./stockEntryMetadata";
import { useMutation } from "react-query";
import { stockGridData, viewUploadDOC } from "./api";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ActionTypes } from "components/dataTable";
import { StockEditViewWrapper } from "./stockEditViewWrapper";

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

  const stockEntryGridData: any = useMutation("stockGridData", stockGridData, {
    onSuccess: (data) => {
      setGridDetailData(data);
    },
    onError: (error: any) => {},
  });
  const viewUploadDOCment: any = useMutation("stockGridData", viewUploadDOC, {
    onSuccess: (data) => {
      console.log("<<<jdfwjflfjklfk", data);
    },
    onError: (error: any) => {},
  });

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);
    viewUploadDOCment.mutate();
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
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  StockGridMetaData.gridConfig.gridLabel = `Stock-Entry Detail \u00A0\u00A0 ${(
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " ")
                  ).replace(/\s/g, "")} -  ${res?.ACCT_NM}`;

                  const DTLRequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
                  };
                  stockEntryGridData.mutate(DTLRequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label="Stock Entry" />
          {visibleTab && <Tab value="tab2" label="Stock Detail" />}
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
          {value === "tab1" ? (
            <>
              <FormWrapper
                key={"stockEntry"}
                metaData={StockEntryMetaData ?? []}
                initialValues={initialValuesRef.current ?? []}
                onSubmitHandler={onSubmitHandler}
                // loading={mutation.isLoading}
                hideHeader={false}
                ref={myMasterRef}
                setDataOnFieldChange={(action, payload) => {
                  if (action === "VISIBLE_TAB") {
                    setVisibleTab(payload?.VISIBLE_TAB);
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
    </>
  );
};
