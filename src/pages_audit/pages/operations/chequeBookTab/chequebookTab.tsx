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
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { GridMetaDataType } from "components/dataTableStatic";
import { ChequeBookEntryMetaData } from "./chequebookEntryMetadata";
import { ChequebookDtlGridMetaData } from "./chequebookDetailMetadata";
import { SubmitFnType } from "packages/form";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { Alert } from "components/common/alert";

export const ChequebookTab = () => {
  const [value, setValue] = useState("chequebookEntry");
  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const mutation: any = useMutation(GetdetailData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  //   console.log("<<<mutation", mutation);
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
    console.log("<<<myMasterRef", myMasterRef?.current);
    //@ts-ignore
    endSubmit(true);
    let ApiKey: any = ChequeBookEntryMetaData?.form?.apiKey;
    let apiID: any = ChequeBookEntryMetaData?.form?.apiID;
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
          <Tab value="chequebookEntry" label="Chequebook Entry" />
          <Tab value="chequebookDetail" label="Chequebook Detail" />
          <Tab value="three" label="Item Three" />
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
                    ChequeBookEntryMetaData.form.name + "/ACCT_CD"
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
                  "chequebookEntry"
                  //   + mutation?.data?.length &&
                  // Boolean(mutation?.isSuccess)
                  //   ? mutation?.data
                  //   : ""
                }
                metaData={ChequeBookEntryMetaData as MetaDataType}
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
                finalMetaData={ChequebookDtlGridMetaData as GridMetaDataType}
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
export const GetdetailData = async ({ apiID, otherAPIRequestPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(apiID, {
      ...otherAPIRequestPara,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
