import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  Grid,
  LinearProgress,
  Tab,
  Tabs,
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
import { LinearProgressBarSpacer } from "components/dataTable/linerProgressBarSpacer";
import { Alert } from "components/common/alert";
import { getChequebookDTL, saveChequebookData } from "./api";
import { PopupRequestWrapper } from "components/custom/popupMessage";
import { ChequeBKPopUpGridData } from "./chequeBKPopUpMetadat";
import { ActionTypes } from "components/dataTable";
import { enqueueSnackbar } from "notistack";
import { queryClient } from "cache";
import { format } from "date-fns";

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
      actionLabel: "cancel",
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
  const [isTabVisible, setIsTabVisible] = useState<any>(false);
  let [messageArray, setmessageArray] = useState<any>([]);
  const [chequeBookData, setChequeBookData] = useState<any>([]);
  const [gridDetailData, setGridDetailData] = useState<any>();
  const [initData, setInitData] = useState<any>({});

  console.log("<<<wefuefgefgej", chequeBookData);
  const getChequeDetail: any = useMutation(
    "getChequebookDTL",
    getChequebookDTL,
    {
      onSuccess: (data) => {
        setGridDetailData(data);
      },
      onError: (error: any) => {},
    }
  );

  const saveChequeData: any = useMutation(
    "saveChequebookData",
    saveChequebookData,
    {
      onSuccess: (data) => {
        // setInitData({});
        setIsTabVisible(false);
        enqueueSnackbar("Data insert successfully", { variant: "success" });
      },
    }
  );

  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getChequebookDTL"]);
      queryClient.removeQueries(["saveChequebookData"]);
    };
  }, []);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    value
  ) => {
    // @ts-ignore
    endSubmit(true);
    console.log("<<sun<<   ", data);
    if (value === "Save") {
      let otherAPIRequestPara2 = {
        ...data,
        _isNewRow: true,
        COMP_CD: authState?.companyID,
        CHEQUE_FROM: Number(data?.CHEQUE_FROM),
        CHEQUE_TO: Number(data?.CHEQUE_TO),
        CHEQUE_TOTAL: Number(data?.CHEQUE_TOTAL),
        LEAF_ARR: Number(data?.LEAF_ARR),
        TRAN_DT: format(new Date(), "dd-MMM-yyyy"),
        ENTERED_BRANCH_CD: data?.BRANCH_CD,
        ENTERED_COMP_CD: authState?.companyID,
        ACCT_CD: data?.ACCT_CD?.padStart(6, "0").padEnd(20, " "),
      };
      let newArray: any = [];

      if (!otherAPIRequestPara2?.LEAF_ARR) {
        setFieldError({
          LEAF_ARR: "please select No. of cheque",
        });
      } else if (
        Number(otherAPIRequestPara2.SERVICE_TAX) >
        Number(otherAPIRequestPara2.ACCT_BAL)
      ) {
        setFieldError({
          ACCT_BAL: "balance is less than service-charge",
        });
      } else if (
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
      } else if (
        newArray.length < 1 &&
        Boolean(otherAPIRequestPara2?.LEAF_ARR)
      ) {
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
  };

  const setChequeBKPopUpActiont = useCallback(
    (data) => {
      if (data?.name === "save") {
        if (
          chequeBookData?.[0]?.CHEQUE_TOTAL *
            Number(chequeBookData?.[0]?.SERVICE_TAX) >
          Number(chequeBookData?.[0]?.ACCT_BAL)
        ) {
          setPopupError(true);
        } else {
          let chequeBookDatas = {
            isNewRow: true,
            BRANCH_CD: authState.user.branchCode,
            COMP_CD: authState.companyID,
            DETAILS_DATA: {
              isNewRow: chequeBookData,
              isDeleteRow: [],
              isUpdatedRow: [],
            },
          };
          saveChequeData.mutate(chequeBookDatas);
          setChequeBookData([]);
        }
      } else {
        setChequeBookData([]);
        setPopupError(false);
      }
    },
    [chequeBookData]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "s" && event.ctrlKey) {
        console.log("<<<key down");
        event.preventDefault();
        myMasterRef?.current?.handleSubmit(
          { preventDefault: () => {} },
          "Save"
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={(event, newValue) => {
            setGridDetailData([]);
            setValue(newValue);

            if (newValue === "chequebookDetail") {
              myMasterRef?.current?.getFieldData().then((res) => {
                setInitData(res);

                if (res?.ACCT_CD && res?.ACCT_TYPE && res?.BRANCH_CD) {
                  ChequebookDtlGridMetaData.gridConfig.gridLabel = `Cheque Book Issued \u00A0\u00A0\u00A0\u00A0 ${
                    authState?.companyID +
                    res?.BRANCH_CD +
                    res?.ACCT_TYPE +
                    res?.ACCT_CD
                  }    \u00A0\u00A0\u00A0\u00A0  ${res?.ACCT_NM}`;

                  const chequeDTLRequestPara = {
                    COMP_CD: authState?.companyID,
                    ACCT_CD: res?.ACCT_CD?.padStart(6, "0")?.padEnd(20, " "),
                    ACCT_TYPE: res?.ACCT_TYPE,
                    BRANCH_CD: res?.BRANCH_CD,
                  };
                  getChequeDetail.mutate(chequeDTLRequestPara);
                }
              });
            }
          }}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="chequebookEntry" label="Chequebook Entry" />

          {isTabVisible && (
            <Tab value="chequebookDetail" label="Chequebook Detail" />
          )}
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
          {saveChequeData?.isError ? (
            <div style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <AppBar position="relative" color="primary">
                <Alert
                  severity="error"
                  errorMsg={saveChequeData?.error?.error_msg ?? "Unknow Error"}
                  errorDetail={saveChequeData?.error?.error_detail ?? ""}
                  color="error"
                />
              </AppBar>
            </div>
          ) : null}
          {value === "chequebookEntry" ? (
            <>
              {saveChequeData.isLoading ? (
                <LinearProgress color="secondary" />
              ) : (
                <LinearProgressBarSpacer />
              )}

              <FormWrapper
                key={"chequebooksEntry" + saveChequeData.isSuccess}
                metaData={ChequeBookEntryMetaData as MetaDataType}
                initialValues={initData}
                onSubmitHandler={onSubmitHandler}
                // loading={true}
                ref={myMasterRef}
                setDataOnFieldChange={(action, payload) => {
                  console.log("<<<action", action, payload);
                  if (action === "MESSAGE") {
                    if (payload) {
                      messageArray = payload.split(", ").map((msg, i) => {
                        return <p>{`(${i + 1})  ${msg}`}</p>;
                      });
                    }
                    setmessageArray([messageArray]);
                    setIsOpenSave(() => true);
                    setIsTabVisible(false);
                  }
                  if (action === "DTL_TAB") {
                    setIsTabVisible(payload.DTL_TAB);
                  }
                  if (action === "CHEQUE_TOTAL") {
                    myMasterRef?.current?.handleSubmit(
                      { preventDefault: () => {} },
                      "Save"
                    );
                  }
                }}
              >
                {({ isSubmitting, handleSubmit }) => (
                  <>
                    <Button
                      onClick={(event) => {
                        handleSubmit(event, "Save");
                      }}
                      disabled={isSubmitting}
                      endIcon={
                        isSubmitting ? <CircularProgress size={20} /> : null
                      }
                      color={"primary"}
                    >
                      Save
                    </Button>
                  </>
                )}
              </FormWrapper>
            </>
          ) : value === "chequebookDetail" ? (
            <>
              <GridWrapper
                key={`chequebookDetail` + getChequeDetail.isSuccess}
                finalMetaData={ChequebookDtlGridMetaData as GridMetaDataType}
                data={gridDetailData ?? []}
                setData={setGridDetailData}
                loading={getChequeDetail.isLoading}
              />
            </>
          ) : null}
        </Grid>
      </Container>

      {chequeBookData.length > 1 && (
        <>
          <Dialog open={true} maxWidth={"lg"}>
            {Boolean(popupError) && (
              <AppBar position="relative" color="primary">
                <Alert
                  errorMsg="Your account balance is less than the service charge"
                  errorDetail="Your account balance is less than the service charge, so please upgrade your balance and then try"
                  severity="error"
                />
              </AppBar>
            )}
            <GridWrapper
              key={`personalizeQuickView`}
              finalMetaData={ChequeBKPopUpGridData as GridMetaDataType}
              data={chequeBookData ?? []}
              setData={() => {}}
              loading={saveChequeData.isLoading}
              actions={ChequeBKPopUpAction}
              setAction={setChequeBKPopUpActiont}
            />

            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                right: "8px",
                bottom: "9px",
                position: "absolute",
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
            </Grid>
          </Dialog>
        </>
      )}

      {isOpenSave && messageArray?.length > 0 && (
        <div
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsOpenSave(() => false);
              setmessageArray([]);
            }
          }}
        >
          {" "}
          <PopupRequestWrapper
            MessageTitle="Account Description"
            Message={messageArray}
            onClickButton={() => {
              setIsOpenSave(false);
              setmessageArray([]);
            }}
            buttonNames={["Ok"]}
            rows={[]}
            open={isOpenSave}
          />
        </div>
      )}
    </>
  );
};
