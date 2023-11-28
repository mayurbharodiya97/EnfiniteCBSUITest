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
import { getChequebookData } from "../chequeBookTab/api";
export const LimitEntry = () => {
  const [value, setValue] = useState("chequebookEntry");
  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const mutation: any = useMutation(getChequebookData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  const ClickEventManage = () => {
    let event: any = { preventDefault: () => {} };
    myMasterRef?.current?.handleSubmit(event, "BUTTON_CLICK");
  };
  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError
  ) => {
    //@ts-ignore
    endSubmit(true);
    limitEntryMetaData.form.label = " ";
    let ApiKey: any = limitEntryMetaData?.form?.apiKey;
    let apiID: any = limitEntryMetaData?.form?.apiID;
    let response = {};
    for (const key in ApiKey) {
      if (ApiKey.hasOwnProperty(key)) {
        const mappedKey = ApiKey[key];
        response[key] = data[mappedKey];
      }
    }

    let otherAPIRequestPara = {
      COMP_CD: authState?.companyID,
      ...response,
      ACCT_CD: data?.ACCT_CD.padEnd(20, " "),
    };
    mutation.mutate({ apiID, otherAPIRequestPara });
    limitEntryMetaData.fields[3].isFieldFocused = true;
    limitEntryMetaData.form.label =
      "Cheque Book Issue " +
      " " +
      authState?.companyID +
      data?.BRANCH_CD +
      data?.ACCT_TYPE +
      data?.ACCT_CD;
    // .replace(data?.BRANCH_CD, data?.BRANCH_CD);
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
          <Tab value="chequebookEntry" label="Limit Entry" />
          <Tab value="chequebookDetail" label="Limit Detail" />
          {/* <Tab value="three" label="Item Three" /> */}
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
          {value === "chequebookEntry" ? (
            <div
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  let target: any = e?.target;
                  if (
                    (target?.name ?? "") ===
                    limitEntryMetaData.form.name + "/ACCT_CD"
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
                  "chequebookEntry" + mutation?.data?.length &&
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
          ) : value === "chequebookDetail" ? (
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
