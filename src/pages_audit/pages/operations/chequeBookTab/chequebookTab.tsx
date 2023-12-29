import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Dialog,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { ChequeBKPopUpGridData } from "./chequeBKPopUpMetadat";
import { ActionTypes } from "components/dataTable";
import { enqueueSnackbar } from "notistack";
import { TablePagination } from "@mui/base";
import { queryClient } from "cache";

export const ChequebookTab = () => {
  const ChequeBKPopUpAction: ActionTypes[] = [
    {
      actionName: "save",
      actionLabel: "Save",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
    {
      actionName: "close",
      actionLabel: "Close",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];
  const [value, setValue] = useState("chequebookEntry");
  const myMasterRef = useRef<any>(null);
  const { authState } = useContext(AuthContext);
  const [isOpenSave, setIsOpenSave] = useState<any>(false);
  const [popupError, setPopupError] = useState<any>(false);
  let [chequeBookData, setChequeBookData] = useState<any>([]);
  // const [formEntryMetaData, setformEntryMetaData] = useState<any>(
  //   ChequeBookEntryMetaData
  // );
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getChequeDetail: any = useMutation(
    "getChequebookDTL",
    getChequebookDTL,
    {
      onSuccess: (data) => {},
      onError: (error: any) => {},
    }
  );

  const mutation: any = useMutation("getChequebookData", getChequebookData, {
    onSuccess: (data) => {},
    onError: (error: any) => {},
  });

  const saveChequeData: any = useMutation(
    "saveChequebookData",
    saveChequebookData,
    {
      onSuccess: (data) => {
        enqueueSnackbar("Data insert successfully", { variant: "success" });
        ClickEventManage();
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getChequebookDTL"]);
      queryClient.removeQueries(["getChequebookData"]);
      queryClient.removeQueries(["saveChequebookData"]);
    };
  }, []);

  const messages: any = mutation?.data?.[0]
    ? Object.values({
        ACCT_ALLOW_MSG: mutation.data[0].ACCT_ALLOW_MSG,
        BRN_ALLOW_MSG: mutation.data[0].BRN_ALLOW_MSG,
        CHEQUBOOK_ALLOW_MSG: mutation.data[0].CHEQUBOOK_ALLOW_MSG,
        CONFIRM_MSG: mutation.data[0].CONFIRM_MSG,
        STATUS_MSG: mutation.data[0].STATUS_MSG,
        ACCT_MSG: mutation.data[0].ACCT_MSG,
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

      ChequeBookEntryMetaData.fields[6].options = () => {
        return result;
      };
    }
    // if (mutation?.data && "BRANCH_CD" in mutation?.data?.[0]) {
    //   ChequeBookEntryMetaData.fields[5].isFieldFocused = true;
    // } else {
    //   ChequeBookEntryMetaData.fields[0].isFieldFocused = true;
    // }
  }, [mutation?.data, mutation?.isLoading]);

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
    // @ts-ignore
    endSubmit(true);
    let otherAPIRequestPara = {
      COMP_CD: authState?.companyID,
      ACCT_CD: data?.ACCT_CD.padStart(6, "0").padEnd(20, " "),
      ACCT_TYPE: data?.ACCT_TYPE,
      BRANCH_CD: data?.BRANCH_CD,
    };
    let otherAPIRequestPara2 = {
      ...data,
      _isNewRow: true,
      COMP_CD: authState?.companyID,
      // AUTO_CHQBK_FLAG: "N",
      CHEQUE_FROM: Number(data?.CHEQUE_FROM),
      CHEQUE_TO: Number(data?.CHEQUE_TO),
      CHEQUE_TOTAL: Number(data?.CHEQUE_TOTAL),
      LEAF_ARR: Number(data?.LEAF_ARR),
      TRAN_DT: authState?.workingDate,
      ENTERED_BRANCH_CD: data?.BRANCH_CD,
      ENTERED_COMP_CD: authState?.companyID,
    };

    if (value === "BUTTON_CLICK") {
      mutation.mutate({ otherAPIRequestPara });
    } else {
      //@ts-ignore
      endSubmit(true);

      let newArray: any = [];

      if (isNaN(otherAPIRequestPara2?.LEAF_ARR)) {
        //@ts-ignore
        endSubmit(true, "please select No. of cheque. ");
      } else {
        if (
          otherAPIRequestPara2.CHEQUE_TOTAL > 1 &&
          otherAPIRequestPara2?.CHEQUE_TO
        ) {
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
          setChequeBookData(newArray.length > 1 && newArray);
        }
      }
      if (newArray.length < 1 && Boolean(otherAPIRequestPara2?.LEAF_ARR)) {
        if (otherAPIRequestPara2.SERVICE_TAX > otherAPIRequestPara2.ACCT_BAL) {
          endSubmit(
            true,
            "Your account balance is less than the service charge, so please upgrade your balance and then try"
          );
        } else {
          // otherAPIRequestPara2 = {
          //   ...otherAPIRequestPara2,
          //   CHEQUE_FROM: "" + otherAPIRequestPara2.CHEQUE_FROM,
          //   CHEQUE_TO: "" + otherAPIRequestPara2.CHEQUE_TO,
          // };

          otherAPIRequestPara2 = {
            isNewRow: true,
            BRANCH_CD: authState.user.branchCode,
            COMP_CD: authState.companyID,
            DETAILS_DATA: {
              isNewRow: [otherAPIRequestPara2],
              isDeleteRow: [],
              isUpdatedRow: [],
            },
          };

          saveChequeData.mutate(otherAPIRequestPara2);
        }
      }
    }
  };

  const onClickButton = (rows, buttonName) => {
    setIsOpenSave(false);
    // ChequeBookEntryMetaData.fields[0].isFieldFocused = true;
  };
  const setChequeBKPopUpActiont = useCallback(
    (data) => {
      if (data?.name === "save") {
        if (
          chequeBookData?.[0]?.CHEQUE_TOTAL * chequeBookData?.[0]?.SERVICE_TAX >
          chequeBookData?.[0]?.ACCT_BAL
        ) {
          setPopupError(true);
        } else {
          chequeBookData = {
            isNewRow: true,
            BRANCH_CD: authState.user.branchCode,
            COMP_CD: authState.companyID,
            DETAILS_DATA: {
              isNewRow: chequeBookData,
              isDeleteRow: [],
              isUpdatedRow: [],
            },
          };
          saveChequeData.mutate(chequeBookData);
          setChequeBookData([]);
        }
      } else {
        setChequeBookData([]);
        setPopupError(false);
      }
    },
    [chequeBookData]
  );

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
          {mutation?.data &&
            messages.length < 1 &&
            (mutation?.data?.[0]?.NO_CHEQUEBOOK_ISSUE ||
              mutation?.data?.[0]?.NO_CHEQUE_USED ||
              mutation?.data?.[0]?.NO_CHEQUE_STOP ||
              mutation?.data?.[0]?.NO_CHEQUE_SURRENDER ||
              mutation.data[0].NO_OF_CHEQUE_UNUSED) && (
              // <Badge color="secondary" badgeContent={0}>
              <Tab
                value="chequebookDetail"
                label="Chequebook Detail"
                onClick={() => getChequeDetail.mutate({ chequeDTLRequestPara })}
              />
              // </Badge>
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
          {mutation?.isError || saveChequeData?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={
                    mutation?.error?.error_msg ??
                    saveChequeData?.error?.error_msg ??
                    "Unknow Error"
                  }
                  errorDetail={
                    mutation?.error?.error_detail ??
                    saveChequeData?.error?.error_detail ??
                    ""
                  }
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
                      ChequeBookEntryMetaData.form.name + "/ACCT_CD" &&
                    target?.value !== ""
                  ) {
                    ClickEventManage();
                  }
                }
              }}
            >
              {mutation.isLoading ||
              mutation.isFetching ||
              saveChequeData.isLoading ? (
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
                initialValues={mutation?.data?.[0] ?? {}}
                onSubmitHandler={onSubmitHandler}
                // displayMode={"edit"}
                // hideDisplayModeInTitle={true}
                loading={mutation.isLoading}
                formStyle={{
                  background: "white",
                  height: "calc(100vh - 300px)",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
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
      {mutation?.data &&
      value === "chequebookEntry" &&
      messages.length < 1 &&
      (mutation?.data?.[0]?.NO_CHEQUEBOOK_ISSUE ||
        mutation?.data?.[0]?.NO_CHEQUE_USED ||
        mutation?.data?.[0]?.NO_CHEQUE_STOP ||
        mutation?.data?.[0]?.NO_CHEQUE_SURRENDER ||
        mutation.data[0].NO_OF_CHEQUE_UNUSED) ? (
        <Container>
          <Toolbar
            sx={{
              background: "var(--theme-color5)",
              minHeight: "40px !important",
              fontSize: "15px",
              color: "white",
            }}
          >
            {`No. of chequebook issued = ${mutation?.data?.[0]?.NO_CHEQUEBOOK_ISSUE} , No of cheque used = ${mutation.data[0].NO_CHEQUE_USED}, No of
            cheque stop = ${mutation.data[0].NO_CHEQUE_STOP} , No of cheque surrender = ${mutation.data[0].NO_CHEQUE_SURRENDER} , No of unused
            cheque =  ${mutation.data[0].NO_OF_CHEQUE_UNUSED} `}
          </Toolbar>
        </Container>
      ) : null}

      {chequeBookData.length > 1 && (
        <>
          <Dialog open={true} maxWidth={"lg"}>
            {Boolean(popupError) && (
              // <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  errorMsg="Your account balance is less than the service charge"
                  errorDetail="Your account balance is less than the service charge, so please upgrade your balance and then try"
                  severity="error"
                />
              </AppBar>
              // </div>
            )}
            <GridWrapper
              key={`personalizeQuickView`}
              finalMetaData={ChequeBKPopUpGridData as GridMetaDataType}
              data={chequeBookData ?? []}
              setData={() => {}}
              loading={saveChequeData.isLoading}
              actions={ChequeBKPopUpAction}
              // controlsAtBottom={true}
              setAction={setChequeBKPopUpActiont}
              // headerToolbarStyle={{
              //   background: "var(--theme-color2)",
              //   color: "black",
              // }}
              // refetchData={() => {}}
              // ref={myGridQuickRef}
            />

            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                right: "8px",
                bottom: "9px",
                position: "absolute",
                // gap: "1rem",
                // display: "flex",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
                {`Total Cheque : ${
                  chequeBookData?.[0]?.CHEQUE_TOTAL *
                  chequeBookData?.[0]?.LEAF_ARR
                }`}
              </Typography>
              <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
                Total Charge &#160;:&#160;
                {chequeBookData?.[0]?.CHEQUE_TOTAL *
                  chequeBookData?.[0]?.SERVICE_TAX}
              </Typography>
              {/* <Typography sx={{ fontWeight: "bold" }} variant="subtitle1">
              GST : {"3443"}
            </Typography> */}
            </Grid>
          </Dialog>
        </>
      )}

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
