import {
  AppBar,
  Box,
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
import { LimitSecurityData, getFDdetail, getLimitDTL } from "./api";
export const LimitEntry = () => {
  const [value, setValue] = useState("tab1");
  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [newFormMetadata, setNewFormMetadata] =
    useState<any>(limitEntryMetaData);
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getFDdetailData: any = useMutation("getFDdetail", getFDdetail, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  useEffect(() => {
    getFDdetailData.mutate();
  }, []);
  console.log("<<<getFDdetailData", getFDdetailData);
  const securityLimitData: any = useMutation(LimitSecurityData, {
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
  });
  const getLimitDetailData: any = useMutation("getChequebookDTL", getLimitDTL, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const ClickEventManage = (fieldName) => {
    let event: any = { preventDefault: () => {} };
    myMasterRef?.current?.handleSubmit(event, fieldName);
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
    let otherAPIRequestPara2 = {
      COMP_CD: authState?.companyID,
      SECURITY_TYPE: data?.SECURITY_CODE,
      BRANCH_CD: authState?.user?.branchCode,
    };
    if (value === "limitEntry/SECURITY_CODE") {
      securityLimitData.mutate(otherAPIRequestPara2);
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
                let target: any = e?.target;
                if (e.key === "Tab") {
                  if (
                    (target?.name ?? "") ===
                      limitEntryMetaData.form.name + "/SECURITY_CODE" &&
                    target?.value !== ""
                  ) {
                    ClickEventManage(target?.name);
                  }
                }
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
