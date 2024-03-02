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
import React, { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { SubmitFnType } from "packages/form";
import * as API from "./api";
import { AuthContext } from "pages_audit/auth";
import { Alert } from "components/common/alert";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { StopPayEntryMetadata } from "./stopPayEntryMetadata";
import { StopPayGridMetaData } from "./stopPayGridMetadata";
import { useMutation } from "react-query";

export const StopPaymentEntry = () => {
  const [value, setValue] = useState("tab1");
  const { authState } = useContext(AuthContext);
  const [gridDetailData, setGridDetailData] = useState<any>();
  const myMasterRef = useRef<any>(null);

  const getStopPayDetail: any = useMutation("getLimitDTL", API.stopPayDetail, {
    onSuccess: (data) => {
      setGridDetailData(data);
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
  };
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setGridDetailData({});
            if (newValue === "tab2") {
              myMasterRef?.current?.getFieldData().then((res) => {
                // initialValuesRef.current = res;
                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  StopPayGridMetaData.gridConfig.gridLabel = `Limit-Entry Detail \u00A0\u00A0 ${(
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
                    ENTERED_DATE: authState?.workingDate,
                    USER_LEVEL: authState?.role,
                  };
                  getStopPayDetail.mutate(RequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label="Stop Payment Entry" />
          <Tab value="tab2" label="Stop Payment Detail" />
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
          {/* {mutation?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={mutation?.error?.error_msg ?? "Unknow Error"}
                  errorDetail={mutation?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : mutation?.data?.length < 1 && Boolean(mutation?.isSuccess) ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  errorMsg="No data found"
                  errorDetail="No any data found"
                  severity="error"
                />
              </AppBar>
            </div>
          ) : null}
                 {mutation.isLoading || mutation.isFetching ? (
                <LinearProgress color="secondary" />
              ) : (
                <LinearProgressBarSpacer />
              )} */}

          {value === "tab1" ? (
            <FormWrapper
              key={"stopPayEntry"}
              metaData={StopPayEntryMetadata ?? []}
              initialValues={[]}
              onSubmitHandler={onSubmitHandler}
              // displayMode={"view"}
              // hideDisplayModeInTitle={true}
              loading={false}
              // formStyle={{
              //   background: "white",
              //   // height: "40vh",
              //   overflowY: "auto",
              //   overflowX: "hidden",
              // }}
              hideHeader={false}
              ref={myMasterRef}
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
          ) : value === "tab2" ? (
            <>
              <GridWrapper
                key={`stopPayGridData`}
                finalMetaData={StopPayGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={() => {}}
                // loading={saveQuickData.isLoading}
                // actions={Quickactions}
                // controlsAtBottom={true}
                // setAction={setQuickAction}
                // headerToolbarStyle={{
                //   background: "var(--theme-color2)",
                //   color: "black",
                // }}
                // refetchData={() => {}}
                // ref={myGridQuickRef}
              />
            </>
          ) : null}
        </Grid>
      </Container>
    </>
  );
};
