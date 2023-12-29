import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
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
import { PopupRequestWrapper } from "components/custom/popupMessage";
export const LimitEntry = () => {
  const [value, setValue] = useState("tab1");
  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [newFormMetadata, setNewFormMetadata] =
    useState<any>(limitEntryMetaData);
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const [messageData, setMessageData] = useState<any>();
  const [detailForm, setDetailForm] = useState<any>();
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

  // let sjdbjhdb = getLimitNSCdetail();

  const onSubmitHandler = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    //@ts-ignore
    endSubmit(true);

    if (value === "SECURITY_CD") {
      securityLimitData.mutate({
        COMP_CD: authState?.companyID,
        SECURITY_CD: data?.SECURITY_CD,
        BRANCH_CD: authState?.user?.branchCode,
      });
    }
    if (value === "FD_ACCT_CD" || value === "FD_NO") {
      if (data?.MESSAGES) {
        setMessageData(data?.MESSAGES);
        setIsOpenSave(true);
      }
    }
  };

  let messageArray;
  if (messageData) {
    messageArray = messageData.split(", ").map((msg, i) => {
      return <p>{`(${i + 1})  ${msg}`}</p>;
    });
  }
  const onClickButton = (rows, buttonName) => {
    setIsOpenSave(false);
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
              onBlur={(e) => {
                const { target } = e;
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

                handleSubmitTab("SECURITY_CD");
                setTimeout(() => {
                  handleSubmitTab("FD_ACCT_CD");
                  handleSubmitTab("FD_NO");
                }, 1000);
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
                {({ isSubmitting, handleSubmit }) => {
                  console.log("isSubmitting, handleSubmit", isSubmitting);
                  return (
                    <>
                      <Button
                        color="primary"
                        onClick={() => setDetailForm("fddetail")}
                      >
                        FD Detail
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => setDetailForm("nscdetail")}
                      >
                        NSC Detail
                      </Button>
                    </>
                  );
                }}
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

      {isOpenSave && (
        <div
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              setIsOpenSave(false);
            }
          }}
        >
          {" "}
          <PopupRequestWrapper
            MessageTitle="Account Description"
            Message={messageArray ? messageArray : "something is wrong "}
            onClickButton={(rows, buttonName) =>
              onClickButton(rows, buttonName)
            }
            buttonNames={["Ok"]}
            rows={[]}
            open={isOpenSave}
          />
        </div>
      )}

      {detailForm === "fddetail" ? (
        <Dialog
          open={true}
          // onClose={onClose}
          // fullWidth={true}
          PaperProps={{
            style: {
              maxWidth: "950px",
            },
          }}
        >
          <FormWrapper
            key={"fddetailForm"}
            metaData={newFormMetadata}
            initialValues={[]}
            // onSubmitHandler={}
            // displayMode={"view"}
            // hideDisplayModeInTitle={true}
            // loading={}
            // formStyle={
            //   background: "white",
            //   // height: "40vh",
            //   overflowY: "auto",
            //   overflowX: "hidden",
            // }}
            hideHeader={false}
            // ref={}
          >
            {({ isSubmitting, handleSubmit }) => {
              console.log("isSubmitting, handleSubmit", isSubmitting);
              return (
                // <Button
                //   color="primary"
                //   onClick={(e) => handleSubmit(e, "FDdetail")}
                // >
                //   Save
                // </Button>
                <Button color="primary" onClick={() => setDetailForm("")}>
                  close
                </Button>
              );
            }}
          </FormWrapper>
        </Dialog>
      ) : detailForm === "nscdetail" ? (
        <Dialog
          open={true}
          // onClose={onClose}
          // fullWidth={true}
          PaperProps={{
            style: {
              maxWidth: "950px",
            },
          }}
        >
          <FormWrapper
            key={"nscdetailForm"}
            metaData={newFormMetadata}
            initialValues={[]}
            // onSubmitHandler={}
            // displayMode={"view"}
            // hideDisplayModeInTitle={true}
            // loading={}
            // formStyle={
            //   background: "white",
            //   // height: "40vh",
            //   overflowY: "auto",
            //   overflowX: "hidden",
            // }}
            hideHeader={false}
            // ref={}
          >
            {({ isSubmitting, handleSubmit }) => {
              console.log("isSubmitting, handleSubmit", isSubmitting);
              return (
                // <Button
                //   color="primary"
                //   onClick={(e) => handleSubmit(e, "FDdetail")}
                // >
                //   Save
                // </Button>
                <Button color="primary" onClick={() => setDetailForm("")}>
                  close
                </Button>
              );
            }}
          </FormWrapper>
        </Dialog>
      ) : null}
    </>
  );
};
