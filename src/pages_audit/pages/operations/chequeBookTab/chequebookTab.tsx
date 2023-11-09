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
import React, { useContext, useEffect, useRef, useState } from "react";
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
import {
  TemporaryData,
  getChequebookDTL,
  getChequebookData,
  saveChequebookData,
} from "./api";
import { ProcessChequeDTL } from "./processChequeDTL";
import { PopupRequestWrapper } from "components/custom/popupMessage";

export const ChequebookTab = () => {
  const [value, setValue] = useState("chequebookEntry");
  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [isOpenSave, setIsOpenSave] = useState<any>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getChequeDetail: any = useMutation(getChequebookDTL, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const mutation: any = useMutation(getChequebookData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });
  const messages: any = mutation?.data?.[0]
    ? Object.values({
        ACCT_ALLOW_MSG: mutation.data[0].ACCT_ALLOW_MSG,
        BRN_ALLOW_MSG: mutation.data[0].BRN_ALLOW_MSG,
        CHEQUBOOK_ALLOW_MSG: mutation.data[0].CHEQUBOOK_ALLOW_MSG,
        CONFIRM_MSG: mutation.data[0].CONFIRM_MSG,
        STATUS_MSG: mutation.data[0].STATUS_MSG,
      })
        .filter(Boolean)
        .map((msg, i) => <p>{`(${i + 1})  ${msg}`}</p>)
    : [];
  useEffect(() => {
    if (!mutation?.isLoading && messages.length > 0) {
      setIsOpenSave(true);
    }

    if (mutation?.data?.[0]?.LEAF_ARR) {
      const result = mutation?.data?.[0]?.LEAF_ARR.split(",").map((item) => ({
        label: item,
        value: item,
      }));

      ChequeBookEntryMetaData.fields[5].options = () => {
        return result;
      };
    }
  }, [mutation?.data, mutation?.isLoading]);

  const saveChequeData: any = useMutation(saveChequebookData, {
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
    // endSubmit(true);
    let otherAPIRequestPara = {
      COMP_CD: authState?.companyID,
      ACCT_CD: data?.ACCT_CD.padEnd(20, " "),
      ACCT_TYPE: data?.ACCT_TYPE,
      BRANCH_CD: data?.BRANCH_CD,
    };

    let otherAPIRequestPara2 = {
      ...data,
      _isNewRow: true,
      COMP_CD: authState?.companyID,
      AUTO_CHQBK_FLAG: "N",
      CHARACTERISTICS: "B",
      PAYABLE_AT_PAR: "Y",
      SR_CD: "1",
      CHEQUE_FROM: Number(data?.CHEQUE_FROM),
      CHEQUE_TO: Number(data?.CHEQUE_TO),
      CHEQUE_TOTAL: Number(data?.CHEQUE_TOTAL),
      LEAF_ARR: Number(data?.LEAF_ARR),
      // TRAN_DT: "09-OCT-2023",
      // REQUISITION_DT: "09-OCT-2023",
    };
    if (value === "BUTTON_CLICK") {
      mutation.mutate({ otherAPIRequestPara });
      ChequeBookEntryMetaData.fields[4].isFieldFocused = true;
    } else {
      //@ts-ignore
      endSubmit(true);

      let newArray: any = [];

      for (
        let i = otherAPIRequestPara2.CHEQUE_FROM;
        i <=
        otherAPIRequestPara2.CHEQUE_FROM +
          (otherAPIRequestPara2.CHEQUE_TOTAL - 1) *
            otherAPIRequestPara2?.LEAF_ARR;
        i += otherAPIRequestPara2?.LEAF_ARR
      ) {
        newArray.push({
          ...otherAPIRequestPara2,
          CHEQUE_FROM: i,
          CHEQUE_TO: i + otherAPIRequestPara2?.LEAF_ARR - 1,
        });
      }

      console.log("<<<newRES", newArray);
      // saveChequeData.mutate({ otherAPIRequestPara2 });
    }
    //@ts-ignore
    endSubmit(true);
  };
  const onClickButton = (rows, buttonName) => {
    setIsOpenSave(false);
    ChequeBookEntryMetaData.fields[2].isFieldFocused = true;
  };
  const chequeDTLRequestPara = {
    COMP_CD: authState?.companyID,
    ACCT_CD: mutation?.data?.[0]?.ACCT_CD,
    ACCT_TYPE: mutation?.data?.[0]?.ACCT_TYPE,
    BRANCH_CD: mutation?.data?.[0]?.BRANCH_CD,
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
          {mutation?.data?.length > 0 && messages.length <= 0 && (
            <Tab
              value="chequebookDetail"
              label="Chequebook Detail"
              onClick={() => getChequeDetail.mutate({ chequeDTLRequestPara })}
            />
          )}
          {/* {mutation?.data?.length > 0 && (
            <Tab value="processChequeDTL" label="Processed Cheque(s) Detail" />
          )} */}
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
                  "chequebookEntry" + mutation?.data?.length &&
                  Boolean(mutation?.isSuccess)
                    ? mutation?.data
                    : ""
                }
                metaData={ChequeBookEntryMetaData as MetaDataType}
                initialValues={mutation?.data?.[0] ?? []}
                onSubmitHandler={onSubmitHandler}
                displayMode={"edit"}
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
          ) : value === "chequebookDetail" ? (
            <>
              <GridWrapper
                key={`personalizeQuickView`}
                finalMetaData={ChequebookDtlGridMetaData as GridMetaDataType}
                data={getChequeDetail?.data ?? []}
                setData={() => {}}
                loading={getChequeDetail.isLoading}
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
          ) : value === "processChequeDTL" ? (
            <>
              <GridWrapper
                key={`processChequeDTL`}
                finalMetaData={ProcessChequeDTL as GridMetaDataType}
                data={[]}
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
              // ChequeBookEntryMetaData.fields[2].isFieldFocused = true;
            }
          }}
        >
          {" "}
          <PopupRequestWrapper
            MessageTitle="Account Description"
            Message={
              messages ? messages : "Account is not Applicable to Cheque-book"
            }
            onClickButton={(rows, buttonName) =>
              onClickButton(rows, buttonName)
            }
            buttonNames={["Ok"]}
            rows={[]}
            open={isOpenSave}
          />
        </div>
      )}
    </>
  );
};
