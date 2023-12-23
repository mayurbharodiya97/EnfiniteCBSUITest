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
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { GridMetaDataType } from "components/dataTableStatic";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AuthContext } from "pages_audit/auth";
import { useMutation, useQuery } from "react-query";
import { Alert } from "components/common/alert";
import { limitEntryMetaData } from "./limitEntryMetadata";
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { limitEntryGridMetaData } from "./limtEntryGridMetadata";
import { SubmitFnType } from "packages/form";
import { LimitSecurityData, getLimitDTL, getLimitNSCdetail } from "./api";
import { queryClient } from "cache";
export const LimitEntry = () => {
  const [value, setValue] = useState("tab1");
  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [newFormMetadata, setNewFormMetadata] =
    useState<any>(limitEntryMetaData);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const securityLimitData: any = useMutation(
    "securityLimitData",
    LimitSecurityData,
    {
      onSuccess: (data) => {
        let newData;
        if (data.length > 0) {
          let newMetadata: any = [...limitEntryMetaData.fields, ...data];
          newData = { ...newFormMetadata, fields: newMetadata };
        } else {
          newData = { ...limitEntryMetaData };
        }
        setNewFormMetadata(newData);
      },
      onError: (error: any) => {},
    }
  );

  const getLimitDetailData: any = useMutation(
    "getLimitDetailData",
    getLimitDTL,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getLimitDetailData"]);
      queryClient.removeQueries(["securityLimitData"]);
    };
  }, []);

  let sjdbjhdb = getLimitNSCdetail();
  console.log("<<<getLimitNSCdetail", sjdbjhdb);

  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);
    console.log("<<<datajkcdjn", data);

    if (value === "SECURITY_CD") {
      securityLimitData.mutate({
        COMP_CD: authState?.companyID,
        SECURITY_CD: data?.SECURITY_CD,
        BRANCH_CD: authState?.user?.branchCode,
      });
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
          {/* <Tab
            value="tab2"
            label="Limit Detail"
            // onClick={() => getLimitDetailData.mutate(limitDTLRequestPara)}
          /> */}
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
          {securityLimitData?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    securityLimitData?.error?.error_msg ?? "Unknow Error"
                  }
                  errorDetail={securityLimitData?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : null}
          {value === "tab1" ? (
            <div
              onKeyDown={(e) => {
                const { target, key } = e;
                const { name, value }: any = target || {};

                const handleSubmitTab = (field) => {
                  if (
                    name === `${limitEntryMetaData.form.name}/${field}` &&
                    value !== ""
                  ) {
                    myMasterRef?.current?.handleSubmit(
                      { preventDefault: () => {} },
                      field
                    );
                  }
                };

                key === "Tab" && handleSubmitTab("SECURITY_CD");
              }}
            >
              {securityLimitData.isLoading || securityLimitData.isFetching ? (
                <LinearProgress color="secondary" />
              ) : (
                <LinearProgressBarSpacer />
              )}
              {/* {formWrapperMemo} */}
              <FormWrapper
                key={"limitEntryForm" + newFormMetadata + setNewFormMetadata}
                metaData={newFormMetadata}
                initialValues={[]}
                onSubmitHandler={onSubmitHandler}
                // displayMode={"view"}
                // hideDisplayModeInTitle={true}
                loading={securityLimitData.isLoading}
                // formStyle={
                //   background: "white",
                //   // height: "40vh",
                //   overflowY: "auto",
                //   overflowX: "hidden",
                // }}
                hideHeader={false}
                ref={myMasterRef}
              >
                {/* {({ isSubmitting, handleSubmit }) => {
                  console.log("isSubmitting, handleSubmit", isSubmitting);
                  return (
                    <Button
                      color="primary"
                      onClick={(e) => handleSubmit(e, "FDdetail")}
                    >
                      Save
                    </Button>
                  );
                }} */}
              </FormWrapper>
            </div>
          ) : value === "tab2" ? (
            <>
              <GridWrapper
                key={`personalizeQuickView`}
                finalMetaData={limitEntryGridMetaData as GridMetaDataType}
                data={getLimitDetailData.data ?? []}
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
