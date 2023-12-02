import {
  AppBar,
  Box,
  Container,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { Alert } from "components/common/alert";
import { limitEntryMetaData } from "./limitEntryMetadata";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { limitEntryGridMetaData } from "./limtEntryGridMetadata";
import { SubmitFnType } from "packages/form";
import { getLimitEntryData } from "./api";
export const LimitEntry = () => {
  const [value, setValue] = useState("tab1");
  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const mutation: any = useMutation(getLimitEntryData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  console.log("<<<mutation", mutation);
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    myMasterRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);
    let otherAPIRequestPara = {
      COMP_CD: authState?.companyID,
      ACCT_CD: data?.ACCT_CD.padStart(6, "0").padEnd(20, " "),
      ACCT_TYPE: data?.ACCT_TYPE,
      BRANCH_CD: data?.BRANCH_CD,
    };
    if (value === "BUTTON_CLICK") {
      mutation.mutate({ otherAPIRequestPara });
      console.log("<<<if", data);
    } else {
      console.log("<<<else", data);
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="tab1" label="Limit Entry" />
          <Tab value="tab2" label="Limit Detail" />
          {/* <Tab value="tab3" label="Item Three" /> */}
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
          {mutation?.isError ? (
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
          {value === "tab1" ? (
            <div
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  let target: any = e?.target;
                  if (
                    (target?.name ?? "") ===
                      limitEntryMetaData.form.name + "/ACCT_CD" &&
                    target?.value !== ""
                  ) {
                    ClickEventManage();
                  }
                }
              }}
            >
              {mutation.isLoading || mutation.isFetching ? (
                <LinearProgress color="secondary" />
              ) : (
                <LinearProgressBarSpacer />
              )}
              <FormWrapper
                key={
                  "limitEntry" + mutation?.data?.length &&
                  Boolean(mutation?.isSuccess)
                    ? mutation?.data
                    : ""
                }
                metaData={limitEntryMetaData as MetaDataType}
                initialValues={mutation?.data?.[0] ?? []}
                onSubmitHandler={onSubmitHandler}
                // displayMode={"view"}
                // hideDisplayModeInTitle={true}
                loading={mutation.isLoading}
                // formStyle={{
                //   background: "white",
                //   // height: "40vh",
                //   overflowY: "auto",
                //   overflowX: "hidden",
                // }}
                hideHeader={false}
                ref={myMasterRef}
              />
            </div>
          ) : value === "tab2" ? (
            <>
              <GridWrapper
                key={`personalizeQuickView`}
                finalMetaData={limitEntryGridMetaData as GridMetaDataType}
                data={mutation.data ?? []}
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
