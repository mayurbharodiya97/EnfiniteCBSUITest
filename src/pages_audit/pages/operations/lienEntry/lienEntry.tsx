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
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { Alert } from "components/common/alert";
import { LienGridMetaData } from "./lienEntryGridMetaData";
import { LienEntryMetadata } from "./lienEntryMetadata";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";

export const LienEntry = () => {
  const [value, setValue] = useState("tab1");
  const myMasterRef = useRef<any>(null);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const { authState } = useContext(AuthContext);

  const mutation: any = useMutation(GetdetailData, {
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
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);
    let ApiKey: any = LienEntryMetadata?.form?.apiKey;
    let apiID: any = LienEntryMetadata?.form?.apiID;
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
          <Tab value="tab1" label="Lien Entry" />
          <Tab value="tab2" label="Lien Detail" />
          {/* <Tab value="tab3" label="Processed Cheque(s) Detail" /> */}
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
                    LienEntryMetadata.form.name + "/ACCT_CD"
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
                  "stopPayEntry" + mutation?.data?.length &&
                  Boolean(mutation?.isSuccess)
                    ? mutation?.data
                    : ""
                }
                metaData={LienEntryMetadata ?? []}
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
            </div>
          ) : value === "tab2" ? (
            <>
              <GridWrapper
                key={`personalizeQuickView`}
                finalMetaData={LienGridMetaData as GridMetaDataType}
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
