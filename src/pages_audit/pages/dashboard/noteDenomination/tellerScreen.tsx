import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { TellerScreenMetadata } from "./metadataTeller";
import { InitialValuesType, SubmitFnType } from "packages/form";
import { GradientButton } from "components/styledComponent/button";
import TellerDenoTable from "./tellerDenoTable";
import { useMutation } from "react-query";
import { AccDetailContext, AuthContext } from "pages_audit/auth";
import * as API from "./api";
import { PopupRequestWrapper } from "components/custom/popupMessage";
import SingleDeno from "./singleDeno";
import { Dialog, Grid, Paper, Typography } from "@mui/material";
import { cashReportMetaData } from "./metadataTeller";
import { ActionTypes } from "components/dataTable/types";
import { format, parse } from "date-fns";
import Report from "components/report";
import AccDetails from "pages_audit/pages/operations/DailyTransaction/TRNHeaderTabs/AccountDetails";
import { enqueueSnackbar } from "notistack";
import * as CommonApi from "pages_audit/pages/operations/DailyTransaction/TRNCommon/api";
import AccDtlCardSkeleton from "./acctDtlCardSkeleton";
// import { getCarousalCards } from "pages_audit/pages/operations/DailyTransaction/TRN001/Trn001";
import {
  SingleTableDataReducer,
  SingleTableInititalState,
  SingleTableActionTypes,
} from "./denoTableActionTypes";
import { usePopupContext } from "components/custom/popupContext";
import DualPartTable from "./dualPartTable";
import DualTableCalc from "./dualTableCalc";
const TellerScreen = () => {
  const formRef: any = useRef(null);
  const endSubmitRef: any = useRef(null);
  const textFieldRef: any = useRef(null);
  const popupReqWrapperRef: any = useRef(null);
  const [state, dispatch] = useReducer(
    SingleTableDataReducer,
    SingleTableInititalState
  );
  const [cardDetails, setCardDetails] = useState([]);
  const [extraAccDtl, setExtraAccDtl] = useState({});
  const { authState }: any = useContext(AuthContext);
  const { cardStore, setCardStore } = useContext(AccDetailContext);
  const { MessageBox } = usePopupContext();
  const [btnLoading, setBtnLoading] = useState({
    table1: false,
    table2: false,
  });

  useEffect(() => {
    // Check if cardStore and cardsInfo are present and cardsInfo is an array
    if (cardStore?.cardsInfo && Array.isArray(cardStore.cardsInfo)) {
      const extraAccDtl = cardStore.cardsInfo.reduce((result, details) => {
        if (details?.COL_LABEL === "Name") {
          result[details.COL_LABEL] = details.COL_VALUE;
        }
        return result;
      }, {});
      setExtraAccDtl(extraAccDtl);
    }
  }, [cardStore?.cardsInfo]);

  const onSubmitHandler: SubmitFnType = (
    data: any,
    displayData,
    endSubmit,
    setFieldError,
    actionFlag
  ) => {
    endSubmit(true);
    endSubmitRef.current = {
      data: { data },
      displayData,
      endSubmit,
      setFieldError,
    };
    if (actionFlag === "SAVE") {
      if (Boolean(data)) {
        dispatch({
          type: SingleTableActionTypes?.SET_FIELDS_DATA,
          payload: data,
        });
        dispatch({
          type: SingleTableActionTypes?.SET_OPENACCTDTL_VAL,
          payload: true,
        });
      }
    }
  };

  const getData: any = useMutation(API.CashReceiptEntrysData, {
    onSuccess: (response: any, variables?: any) => {
      // console.log(variables, "variables");
      dispatch({ type: SingleTableActionTypes?.SET_OPEN_DENO, payload: false });
      if (variables?.FLAG === "TABLE1") {
        setBtnLoading((pre) => ({ ...pre, table1: false }));
        dispatch({
          type: SingleTableActionTypes?.SET_DISP_TABLE,
          payload: true,
        });
      } else if (variables?.FLAG === "TABLE2") {
        setBtnLoading((pre) => ({ ...pre, table2: false }));

        dispatch({
          type: SingleTableActionTypes?.SET_DISP_TABLE_DUAL,
          payload: true,
        });
      }
    },
    onError: (error: any, variables?: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      if (variables?.FLAG === "TABLE1") {
        setBtnLoading((pre) => ({ ...pre, table1: false }));
        dispatch({
          type: SingleTableActionTypes?.SET_DISP_TABLE,
          payload: false,
        });
      } else if (variables?.FLAG === "TABLE2") {
        setBtnLoading((pre) => ({ ...pre, table2: false }));
        dispatch({
          type: SingleTableActionTypes?.SET_DISP_TABLE_DUAL,
          payload: true,
        });
      }
    },
  });

  const data: any = useMemo(() => {
    if (Array.isArray(getData.data)) {
      return [...getData.data];
    }
  }, [getData.data]);

  //initial value set in available note and balance column
  useEffect(() => {
    let initAvailNote: any = [];
    let initBalance: any = [];
    data?.map((notes) => {
      initAvailNote.push(notes?.AVAIL_QTY);
      initBalance.push(notes?.AVAIL_VAL);
    });
    dispatch({
      type: SingleTableActionTypes?.SET_AVAIL_NOTE,
      payload: initAvailNote,
    });
    dispatch({
      type: SingleTableActionTypes?.SET_BAL_VAL,
      payload: initBalance,
    });
    // dispatch({
    //   type: SET_REMAINEXCESS_VAL,
    //   payload: Boolean(state?.fieldsData?.TRN === "R")
    //     ? state?.fieldsData?.RECEIPT
    //     : Boolean(state?.fieldsData?.TRN === "P")
    //     ? state?.fieldsData?.PAYMENT
    //     : "0",
    // });
  }, [data, state?.openDeno]);

  //for common function for set required table column totals
  const getInitTotals = (getData) => {
    const finalTotal = {};

    for (let key in getData) {
      const newTotalAmount = Object.values(getData[key] || "0").reduce(
        (acc: any, val: any) => acc + (parseFloat(val) || 0),
        0
      );

      if (Boolean(state?.inputVal)) {
        finalTotal[key] = newTotalAmount;
      }
    }
    return finalTotal;
  };

  //set initial totals
  useEffect(() => {
    const dataObj = {
      inputVal: "0",
      amount: "0",
      availNote: state?.availNote,
      balance: state?.balance,
    };
    const newValue = getInitTotals(dataObj);

    dispatch({
      type: SingleTableActionTypes?.SET_TOTAL_VAL,
      payload: newValue,
    });
  }, [state?.availNote, state?.balance, state?.openDeno]);

  useEffect(() => {
    dispatch({
      type: SingleTableActionTypes?.SET_INPUT_VAL,
      payload: {},
    });
    dispatch({
      type: SingleTableActionTypes?.SET_AMOUNT_VAL,
      payload: [],
    });
  }, [state?.openDeno]);

  //for aceept only numbers (positive and negative) without decimal
  const sanitizedValue = (inputValue) => {
    if (inputValue.startsWith("-")) {
      return "-" + inputValue.replace(/[^0-9]/g, "");
    } else {
      return inputValue.replace(/[^0-9]/g, "");
    }
  };

  const handleChange = (event, index) => {
    //set sanitized value returned by sanitizedValue function (new value have only numbers (positive and negative) without decimal)
    let userInput = event.target.value;
    const sanitValue = sanitizedValue(userInput);
    let updatedValue = { ...state?.inputVal };
    updatedValue[index] = sanitValue;
    dispatch({
      type: SingleTableActionTypes?.SET_INPUT_VAL,
      payload: updatedValue,
    });

    //display Amout column value (multiplied value of denomination * note count)
    const multipliedValue = [...state?.amount];
    multipliedValue[index] =
      parseInt(sanitValue) * parseInt(data?.[index]?.DENO_VAL);
    dispatch({
      type: SingleTableActionTypes?.SET_AMOUNT_VAL,
      payload: multipliedValue,
    });
  };

  const actions: ActionTypes[] = [
    {
      actionName: "Close",
      actionLabel: "Close",
      multiple: false,
      rowDoubleClick: false,
      alwaysAvailable: true,
    },
  ];

  const setCurrentAction = useCallback((data) => {
    if (data?.name === "Close") {
      dispatch({
        type: SingleTableActionTypes?.SET_VIEWACCTDETAILS_VAL,
        payload: false,
      });
    }
  }, []);

  const handleCloseDialog = () => {
    dispatch({
      type: SingleTableActionTypes?.SET_VIEWACCTDETAILS_VAL,
      payload: false,
    });
  };

  const handleBlurLogic = (event, index) => {
    dispatch({
      type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
      payload: {
        index: index,
        message: null,
      },
    });
  };

  const handleonBlur = async (event, index) => {
    if (Boolean(event?.target?.value === "-")) {
      state.inputVal[index] = "";
    }
    const dataForTotal = {
      inputVal: state?.inputVal || "0",
      amount: state?.amount || "0",
      availNote: state?.availNote || "0",
      balance: state?.balance || "0",
    };

    const newValue = getInitTotals(dataForTotal);
    dispatch({
      type: SingleTableActionTypes?.SET_TOTAL_VAL,
      payload: newValue,
    });

    if (state?.remainExcess === 0) {
      dispatch({
        type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
        payload: true,
      });
    } else {
      dispatch({
        type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
        payload: false,
      });
    }

    if (
      state?.fieldsData?.TRN === "R" &&
      state?.amount[index] < 0 &&
      Math.abs(state?.amount[index]) > data[index]?.AVAIL_VAL
    ) {
      // setDisplayError(newDisplayErrors);
      dispatch({
        type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
        payload: {
          index: index,
          message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
        },
      });

      if (Boolean(state?.displayError)) {
        state.inputVal[index] = "";
        state.amount[index] = "";
      }

      //set multiplication is `0` when err0 is occurs according to index
      // setMultiplicationResult((preVal) => {
      //   const updatedRslt = [...preVal];
      //   updatedRslt[index] = 0;
      //   return updatedRslt;
      // });

      //for clear input whe error occur according to index
      // const updatedInputVal = { ...inputVal };
      // updatedInputVal[index] = "";
      // setInputVal(updatedInputVal);
    }

    //condition for if TRN is Payment and values is +(positive) and greater then of TotalAmount
    else if (
      state?.fieldsData?.TRN === "P" &&
      state?.amount[index] > 0 &&
      state?.amount[index] > data[index]?.AVAIL_VAL
    ) {
      dispatch({
        type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
        payload: {
          index: index,
          message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
        },
      });

      //set multiplication is `0` when err0 is occurs according to index
      // setMultiplicationResult((preVal) => {
      //   const updatedRslt = [...preVal];
      //   updatedRslt[index] = 0;
      //   return updatedRslt;
      // });

      // //for clear input whe error occur according to index
      // const updatedInputVal = { ...inputVal };
      // updatedInputVal[index] = "";
      // setInputVal(updatedInputVal);
    } else {
      state.displayError = "";
      // dispatch({
      //   type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
      //   payload: {
      //     message: null,
      //   },
      // });
      handleBlurLogic(event, index);
    }
  };

  function hasError(obj) {
    for (const key in obj) {
      if (obj[key] !== null) {
        return true; // Return true if any non-null value is found
      }
    }
    return false; // Return false if all values are null
  }

  const haveerror = hasError(state?.displayError);

  const handleonFocus = (event, index) => {
    // Call the shared logic for the else part
    // handleBlurLogic(event,index);
  };

  useEffect(() => {
    const withdrawAmount: any = Boolean(state?.fieldsData?.TRN === "R")
      ? state?.fieldsData?.RECEIPT
      : Boolean(state?.fieldsData?.TRN === "P")
      ? state?.fieldsData?.PAYMENT
      : "";

    const upadatedFinalAmount: any =
      parseInt(withdrawAmount) - parseInt(state?.columnTotal?.amount);
    if (!Boolean(haveerror)) {
      dispatch({
        type: SingleTableActionTypes?.SET_REMAINEXCESS_VAL,
        payload: upadatedFinalAmount,
      });
    }
  }, [state?.columnTotal?.amount, data, haveerror]);

  useEffect(() => {
    if (state?.remainExcess === 0) {
      dispatch({
        type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
        payload: true,
      });
    } else {
      dispatch({
        type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
        payload: false,
      });
    }
  }, [state?.remainExcess]);

  const onCloseTable = (newVal, flag) => {
    if (flag === "TABLE1") {
      dispatch({
        type: SingleTableActionTypes?.SET_DISP_TABLE,
        payload: newVal,
      });
    } else if (flag === "TABLE2") {
      dispatch({
        type: SingleTableActionTypes?.SET_DISP_TABLE_DUAL,
        payload: newVal,
      });
    }
    // if (Boolean(endSubmitRef.current?.endSubmit)) {
    //   endSubmitRef.current?.endSubmit(true);
    // }
  };

  const getCarousalCards = useMutation(CommonApi.getCarousalCards, {
    onSuccess: (data) => {
      setCardStore({ ...cardStore, cardsInfo: data });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.error_msg, {
        variant: "error",
      });
      setCardStore({ ...cardStore, cardsInfo: [] });
    },
  });

  let finalScreenRef = "";

  return (
    <>
      <Paper
        sx={{
          margin: "4.7rem 010px 1vh 10px",
          minHeight: "18rem",
          display: !Boolean(state?.openAcctDtl) ? "flex" : "block",
          justifyContent: !Boolean(state?.openAcctDtl) ? "center" : "none",
          alignItems: !Boolean(state?.openAcctDtl) ? "center" : "none",
          boxShadow: "none",
        }}
      >
        {Boolean(state?.openAcctDtl) ? (
          Boolean(getCarousalCards?.isLoading) ? (
            // <Box
            //   display={"flex"}
            //   // justifyContent={"space-evenly"}
            //   // width={"100vw"}
            //   marginTop={"15px"}
            // >
            <Grid
              container
              sx={
                {
                  // display: "flex",
                  // justifyContent: "space-evenly",
                }
              }
            >
              <Grid xs={12} sm={6} md={4} lg={4} xl={4}>
                <AccDtlCardSkeleton />
              </Grid>
              <Grid xs={12} sm={6} md={4} lg={4} xl={4}>
                <AccDtlCardSkeleton />
              </Grid>
              <Grid xs={12} sm={6} md={4} lg={4} xl={4}>
                <AccDtlCardSkeleton />
              </Grid>
            </Grid>
          ) : (
            // </Box>
            <AccDetails cardsData={cardDetails} />
          )
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontStyle: "italic",
              color: "var(--theme-color6)",
              fontWeight: "bold",
            }}
          >
            Please enter account number to get account details.....
          </Typography>
        )}
      </Paper>
      <FormWrapper
        key={`TellerScreen`}
        metaData={TellerScreenMetadata as MetaDataType}
        initialValues={{} as InitialValuesType}
        onSubmitHandler={onSubmitHandler}
        formStyle={{
          background: "white",
        }}
        controlsAtBottom={false}
        onFormButtonClickHandel={(id) => {}}
        formState={{ MessageBox: MessageBox }}
        setDataOnFieldChange={(action, payload) => {
          if (action === "RECEIPT" || action === "PAYMENT") {
            // popupReqWrapperRef?.current?.focus?.();
            dispatch({
              type: SingleTableActionTypes?.SET_OPEN_DENO,
              payload: true,
            });
            let event: any = { preventDefault: () => {} };
            formRef?.current?.handleSubmit(event, "SAVE");
          } else if (action === "TRN") {
            dispatch({
              type: SingleTableActionTypes?.SET_OPENACCTDTL_VAL,
              payload: false,
            });
            Boolean(data?.value) && data?.value === "S"
              ? dispatch({
                  type: SingleTableActionTypes?.SET_SINGLEDENO_SHOW,
                  payload: true,
                })
              : dispatch({
                  type: SingleTableActionTypes?.SET_SINGLEDENO_SHOW,
                  payload: false,
                });

            finalScreenRef = Boolean(action === "TRN")
              ? Boolean(data?.value === "R")
                ? "ETRN/039"
                : Boolean(data?.value === "P")
                ? "ETRN/040"
                : ""
              : "";
          } else if (action === "ACCT_CD") {
            if (
              Boolean(payload?.carousalCardData) &&
              Boolean(payload?.carousalCardData.length)
            ) {
              setCardStore({
                ...cardStore,
                cardsInfo: payload?.carousalCardData,
              });
              setCardDetails(payload?.carousalCardData);
              dispatch({
                type: SingleTableActionTypes?.SET_OPENACCTDTL_VAL,
                payload: true,
              });
            }

            // if (postData.RESTRICTION || postData.MESSAGE1) {
            //   let acctValidateMsg = postData.RESTRICTION || postData.MESSAGE1;
            //   dispatch({
            //     type: SingleTableActionTypes?.SET_ACCTVALIDMSG_VAL,
            //     payload: acctValidateMsg,
            //   });
            //   dispatch({
            //     type: SingleTableActionTypes?.SET_ACCTVALIDMSGBOX_VAL,
            //     payload: true,
            //   });
            // }
            // if (
            //   Boolean(data) &&
            //   Boolean(dependentFieldValues?.BRANCH_CD?.value) &&
            //   Boolean(dependentFieldValues?.ACCT_TYPE?.value)
            // ) {
            //   if (!Boolean(postData.RESTRICTION)) {
            //     getCarousalCards.mutate({
            //       COMP_CD: authState?.companyID,
            //       ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value,
            //       ACCT_CD: data,
            //       PARENT_TYPE:
            //         dependentFieldValues?.ACCT_TYPE?.optionData?.[0]
            //           ?.PARENT_TYPE ?? "",
            //     });
            //   } else {
            //     dispatch({
            //       type: SingleTableActionTypes?.SET_OPENACCTDTL_VAL,
            //       payload: false,
            //     });
            //   }
            // }
          } else if (action === "BRANCH_CD" || action === "ACCT_TYPE") {
            dispatch({
              type: SingleTableActionTypes?.SET_OPENACCTDTL_VAL,
              payload: false,
            });
          }
        }}
        ref={formRef}
      >
        {({ isSubmitting, handleSubmit }) => (
          <>
            <GradientButton
              // ref={buttonRef}
              style={{ marginRight: "5px" }}
              onClick={(event) => {
                dispatch({
                  type: SingleTableActionTypes?.SET_VIEWACCTDETAILS_VAL,
                  payload: true,
                });
              }}
              color={"primary"}
              disabled={false}
            >
              View Trn
            </GradientButton>
            {/* {Boolean(state?.displayTable) ? (
              <GradientButton
                // ref={buttonRef}
                style={{ marginRight: "5px" }}
                onClick={(event) => {
                  if (Boolean(endSubmitRef.current?.endSubmit)) {
                    endSubmitRef.current?.endSubmit(true);
                  }
                  dispatch({
                    type: SingleTableActionTypes?.SET_DISP_TABLE,
                    payload: false,
                  });
                }}
                color={"primary"}
              >
                Reset
              </GradientButton>
            ) : null} */}
          </>
        )}
      </FormWrapper>
      {Boolean(state?.confirmation) && !Boolean(haveerror) ? (
        <PopupRequestWrapper
          MessageTitle={"Confirmation"}
          Message={"All Transaction are Completed Want to Proceed"}
          onClickButton={(rows, buttonNames) => {
            if (Boolean(buttonNames === "Yes")) {
              console.log("form Submitted");
            } else if (Boolean(buttonNames === "No")) {
              dispatch({
                type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
                payload: false,
              });
            }
          }}
          buttonNames={["Yes", "No"]}
          rows={[]}
          loading={{ Yes: getData?.isLoading, No: false }}
          open={Boolean(state?.confirmation)}
        />
      ) : null}
      {Boolean(state?.openDeno) ? (
        <PopupRequestWrapper
          MessageTitle={"Denomination confirmation"}
          Message={"Are you sure to open denomination"}
          onClickButton={(rows, buttonNames) => {
            if (Boolean(buttonNames === "Table 1")) {
              const formattedDate = format(
                parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                "dd/MMM/yyyy"
              ).toUpperCase();
              setBtnLoading((pre) => ({ ...pre, table1: true }));
              getData.mutate({
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                USER_NAME: authState?.user?.id,
                // TRAN_DT: "03/FEB/2024",
                TRAN_DT: formattedDate,
                FLAG: "TABLE1",
              });
            } else if (Boolean(buttonNames === "Table 2")) {
              const formattedDate = format(
                parse(authState?.workingDate, "dd/MMM/yyyy", new Date()),
                "dd/MMM/yyyy"
              ).toUpperCase();
              setBtnLoading((pre) => ({ ...pre, table2: true }));
              getData.mutate({
                COMP_CD: authState?.companyID,
                BRANCH_CD: authState?.user?.branchCode,
                USER_NAME: authState?.user?.id,
                // TRAN_DT: "03/FEB/2024",
                TRAN_DT: formattedDate,
                FLAG: "TABLE2",
              });
            }
          }}
          buttonNames={["Table 1", "Table 2"]}
          rows={[]}
          loading={{
            "Table 1": btnLoading?.table1,
            "Table 2": btnLoading?.table2,
          }}
          open={Boolean(state?.openDeno)}
        />
      ) : null}
      <TellerDenoTable
        displayTable={state?.displayTable}
        data={data ?? []}
        handleChange={handleChange}
        inputValue={state?.inputVal}
        amount={state?.amount}
        availNotes={state?.availNote}
        balance={state?.balance}
        handleonBlur={handleonBlur}
        noteCntTotal={state?.columnTotal?.inputVal}
        amountTotal={state?.columnTotal?.amount}
        availNoteTotal={state?.columnTotal?.availNote}
        balanceTotal={state?.columnTotal?.balance}
        remainExcessBal={state?.remainExcess}
        finalLable={state?.remainExcess >= 0 ? "Remaining " : "Excess "}
        onCloseTable={onCloseTable}
        textFieldRef={textFieldRef}
        openAcctDtl={state?.openAcctDtl}
        displayError={state?.displayError}
        handleonFocus={handleonFocus}
        extraAccDtl={extraAccDtl}
      />
      {/* <DualTableCalc data={data ?? []} /> */}
      <DualTableCalc
        // columnDefinitions={columnDefinitions}
        // isLoading={false}
        // formData={state?.fieldsData}
        displayTableDual={state?.displayTableDual}
        openAcctDtl={state?.openAcctDtl}
        formData={state?.fieldsData}
        data={data ?? []}
        isLoading={getData?.isLoading}
        onCloseTable={onCloseTable}
        extraAccDtl={extraAccDtl}
      />
      {Boolean(state?.singleDenoShow) ? <SingleDeno /> : null}
      {state?.viewAcctDetails ? (
        <Dialog open={state?.viewAcctDetails} maxWidth={"xl"}>
          <Report
            reportID={"transactionServiceAPI/GETTODAYTRANDATA"}
            reportName={"GETTODAYTRANDATA"}
            dataFetcher={API.cashReportData}
            metaData={cashReportMetaData}
            disableFilters
            maxHeight={window.innerHeight - 250}
            title={cashReportMetaData?.title}
            options={{
              disableGroupBy: cashReportMetaData?.disableGroupBy,
            }}
            hideFooter={cashReportMetaData?.hideFooter}
            hideAmountIn={cashReportMetaData?.hideAmountIn}
            retrievalType={cashReportMetaData?.retrievalType}
            initialState={{
              groupBy: cashReportMetaData?.groupBy ?? [],
            }}
            onClose={handleCloseDialog}
            otherAPIRequestPara={{
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }}
            // dataTransformer={(data) => {
            //   setScrollData(data);
            //   return data;
            // }}
          />
        </Dialog>
      ) : null}
    </>
  );
};

export default TellerScreen;
