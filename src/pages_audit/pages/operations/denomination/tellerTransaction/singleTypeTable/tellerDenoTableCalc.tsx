import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import TellerDenoTable from "./tellerDenoTable";
import {
  SingleTableDataReducer,
  SingleTableInititalState,
  SingleTableActionTypes,
} from "./denoTableActionTypes";
import { usePopupContext } from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import * as API from "../../api";
import { format } from "date-fns";

const TellerDenoTableCalc = ({
  displayTable,
  formData,
  data,
  isLoading,
  onCloseTable,
  gridLable,
  initRemainExcess,
  // screenRef,
  // entityType,
  setOpenDenoTable,
  setCount,
  screenFlag,
  typeCode,
}) => {
  const [state, dispatch] = useReducer(
    SingleTableDataReducer,
    SingleTableInititalState
  );
  const textFieldRef: any = useRef(null);
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);

  //for common function for set required table column totals
  const calculateTotals = useCallback((field) => {
    const finalTotal = {};

    for (let key in field) {
      const newTotalAmount = Object.values(field[key] || "0").reduce(
        (acc: any, val: any) => acc + (parseFloat(val) || 0),
        0
      );

      if (Boolean(state?.inputVal)) {
        finalTotal[key] = newTotalAmount;
      }
    }
    return finalTotal;
  }, []);

  useEffect(() => {
    // set initial values of available quntity and available balance
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
  }, [data, state?.openDeno]);

  //cleanup function
  useEffect(() => {
    return () => {
      // Set input values and amount on openDeno change(clear input value and amount)
      dispatch({
        type: SingleTableActionTypes?.SET_INPUT_VAL,
        payload: {},
      });
      dispatch({
        type: SingleTableActionTypes?.SET_AMOUNT_VAL,
        payload: [],
      });
    };
  }, []);

  //set initial totals of input value and amount
  useEffect(() => {
    const dataObj = {
      inputVal: "0",
      amount: "0",
      availNote: state?.availNote,
      balance: state?.balance,
    };
    const newValue = calculateTotals(dataObj);

    dispatch({
      type: SingleTableActionTypes?.SET_TOTAL_VAL,
      payload: newValue,
    });
  }, [state?.availNote, state?.balance, state?.openDeno, calculateTotals]);

  //for aceept only numbers (positive and negative) without decimal
  const sanitizedValue = useCallback((inputValue) => {
    if (inputValue?.startsWith("-")) {
      return "-" + inputValue?.replace(/[^0-9]/g, "");
    } else {
      return inputValue?.replace(/[^0-9]/g, "");
    }
  }, []);

  const handleChange = useCallback(
    (event, index) => {
      //set sanitized value returned by sanitizedValue function (new value have only numbers (positive and negative) without decimal)
      let userInput = event?.target?.value;
      const sanitValue = sanitizedValue(userInput);
      let updatedValue = { ...state?.inputVal };
      updatedValue[index] = sanitValue;
      dispatch({
        type: SingleTableActionTypes?.SET_INPUT_VAL,
        payload: updatedValue,
      });

      //display Amount column value (multiplied value of denomination * note count)
      const multipliedValue = [...state?.amount];
      multipliedValue[index] =
        parseFloat(sanitValue) * parseFloat(data?.[index]?.DENO_VAL);
      dispatch({
        type: SingleTableActionTypes?.SET_AMOUNT_VAL,
        payload: multipliedValue,
      });
    },
    [sanitizedValue, state?.inputVal, state?.amount, data]
  );

  // useEffect(() => {
  //   let initAvailNote: any = [];
  //   let initBalance: any = [];
  //   data?.map((notes) => {
  //     initAvailNote.push(notes?.AVAIL_QTY);
  //     initBalance.push(notes?.AVAIL_VAL);
  //   });
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_AVAIL_NOTE,
  //     payload: initAvailNote,
  //   });
  //   dispatch({
  //     type: SingleTableActionTypes?.SET_BAL_VAL,
  //     payload: initBalance,
  //   });
  //   // dispatch({
  //   //   type: SET_REMAINEXCESS_VAL,
  //   //   payload: Boolean(formData?.TRN === "R")
  //   //     ? formData?.RECEIPT
  //   //     : Boolean(formData?.TRN === "P")
  //   //     ? formData?.PAYMENT
  //   //     : "0",
  //   // });
  // }, [data, state?.openDeno]);

  //Handle blur logic for error remove
  const handleBlurErrLogic = useCallback((event, index) => {
    dispatch({
      type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
      payload: {
        index: index,
        message: null,
      },
    });
  }, []);

  // Handle blur event for input validation and calculation
  const handleonBlur = useCallback(
    async (event, index) => {
      //For clear input field value when get only '-' in input
      if (Boolean(event?.target?.value === "-")) {
        state.inputVal[index] = "";
      }

      // Recalculate totals and dispatch
      const dataForTotal = {
        inputVal: state?.inputVal || "0",
        amount: state?.amount || "0",
        availNote: state?.availNote || "0",
        balance: state?.balance || "0",
      };

      const newTotals = calculateTotals(dataForTotal);
      dispatch({
        type: SingleTableActionTypes?.SET_TOTAL_VAL,
        payload: newTotals,
      });

      // Validation logic based on typeCode
      const exceedBalance =
        typeCode === "1" &&
        state?.amount[index] < 0 &&
        Math.abs(state?.amount[index]) > data[index]?.AVAIL_VAL;

      const exceedPositive =
        typeCode === "4" &&
        state?.amount[index] > 0 &&
        state?.amount[index] > data[index]?.AVAIL_VAL;

      if (exceedBalance || exceedPositive) {
        dispatch({
          type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
          payload: {
            index: index,
            message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
          },
        });

        // // Reset input and amount on error
        // state.inputVal[index] = "";
        // state.amount[index] = "";
      } else {
        //clear error when if condition is no true
        handleBlurErrLogic(event, index);
      }

      // if (state?.remainExcess === 0) {
      //   // dispatch({
      //   //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
      //   //   payload: true,
      //   // });
      //   const res = await MessageBox({
      //     messageTitle: "Confirmation",
      //     message: "All Transaction are Completed Want to Proceed ?",
      //     //@ts-ignore
      //     buttonNames: ["Yes", "No"],
      //     defFocusBtnName: "Yes",
      //     // loadingBtnName: ["Yes"],
      //     icon: "INFO",
      //   });
      //   if (res === "Yes") {
      //     console.log("form Submitted");
      //   } else if (res === "No") {
      //     CloseMessageBox();
      //   }
      // } else {
      //   // dispatch({
      //   //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
      //   //   payload: false,
      //   // });
      //   CloseMessageBox();
      // }

      //Validation logic based typeCode
      // if (
      //   typeCode === "1" &&
      //   state?.amount[index] < 0 &&
      //   Math.abs(state?.amount[index]) > data[index]?.AVAIL_VAL
      // ) {
      //   // setDisplayError(newDisplayErrors);
      //   dispatch({
      //     type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
      //     payload: {
      //       index: index,
      //       message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
      //     },
      //   });

      //   if (Boolean(state?.displayError)) {
      //     state.inputVal[index] = "";
      //     state.amount[index] = "";
      //   }

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
      // }

      //condition for if TRN is Payment and values is +(positive) and greater then of TotalAmount
      // else if (
      //   typeCode === "4" &&
      //   state?.amount[index] > 0 &&
      //   state?.amount[index] > data[index]?.AVAIL_VAL
      // ) {
      //   dispatch({
      //     type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
      //     payload: {
      //       index: index,
      //       message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to Balance`,
      //     },
      //   });
      //   if (Boolean(state?.displayError)) {
      //     state.inputVal[index] = "";
      //     state.amount[index] = "";
      //   }
      //   //set multiplication is `0` when err0 is occurs according to index
      //   // setMultiplicationResult((preVal) => {
      //   //   const updatedRslt = [...preVal];
      //   //   updatedRslt[index] = 0;
      //   //   return updatedRslt;
      //   // });

      //   // //for clear input whe error occur according to index
      //   // const updatedInputVal = { ...inputVal };
      //   // updatedInputVal[index] = "";
      //   // setInputVal(updatedInputVal);
      // } else {
      // state.displayError = "";
      // // dispatch({
      // //   type: SingleTableActionTypes?.SET_DIS_ERR_VAL,
      // //   payload: {
      // //     message: null,
      // //   },
      // // });
      // handleBlurErrLogic(event, index);
      // }

      // const consoleData = getRowData();
      // console.log(consoleData, "consoleconsoleconsoleconsoleconsole");
    },
    [
      state.inputVal,
      state?.amount,
      data,
      typeCode,
      handleBlurErrLogic,
      calculateTotals,
    ]
  );

  // Helper function to check for errors in displayError
  const hasError = useCallback(
    (obj) => Object.values(obj).some((val) => val !== null),
    []
  );

  // Check for errors
  const haveError = hasError(state.displayError);

  // const handleonFocus = (event, index) => {
  //   // Call the shared logic for the else part
  //   // handleBlurLogic(event,index);
  // };

  // Update remaining excess value after amount total calculation
  useEffect(() => {
    if (!Boolean(haveError)) {
      const calRemainExcess: any =
        parseFloat(initRemainExcess) - parseFloat(state?.columnTotal?.amount);
      dispatch({
        type: SingleTableActionTypes?.SET_REMAINEXCESS_VAL,
        payload: calRemainExcess,
      });
    }
  }, [state?.columnTotal?.amount, data, haveError, formData]);

  //Mutation for saving denomination data
  const saveDenominationData = useMutation(API.saveDenoData, {
    onSuccess: async (data) => {
      CloseMessageBox();
      setOpenDenoTable(false);
      if (data?.length) {
        if (data?.[0]?.hasOwnProperty("O_STATUS")) {
          for (const result of data) {
            const status = result?.O_STATUS;
            const message = result?.O_MESSAGE;

            if (status === "999" || status === "99" || status === "9") {
              setTimeout(async () => {
                await MessageBox({
                  messageTitle:
                    status === "999"
                      ? "Validation Failed"
                      : status === "99"
                      ? "Confirmation"
                      : status === "9"
                      ? "Alert"
                      : "",
                  message,
                  icon:
                    status === "999"
                      ? "ERROR"
                      : status === "99"
                      ? "CONFIRM"
                      : status === "9"
                      ? "WARNING"
                      : undefined,
                  buttonNames: status === "99" ? ["Yes", "No"] : ["Ok"],
                });
                setCount((prev) => prev + 1);
              }, 0);
            }
          }
        } else {
          setTimeout(async () => {
            await MessageBox({
              messageTitle: "Generated Voucher No./Reference No.",
              message: `${data?.[0]?.TRAN_CD} / ${data?.[0]?.REFERENCE_NO}`,
              defFocusBtnName: "Ok",
              icon: "INFO",
            });
            setCount((prev) => prev + 1);
          }, 0);
        }
      }
    },
    onError: () => CloseMessageBox(),
  });

  // const saveDenominationData = useMutation(API.saveDenoData, {
  //   onSuccess: async (data: any, variables: any) => {
  //     CloseMessageBox();
  //     setOpenDenoTable(false);
  //     if (data?.length > 0) {
  //       if (data?.[0]?.hasOwnProperty("O_STATUS")) {
  //         const getBtnName = async (msgObj) => {
  //           let btnNm = await MessageBox(msgObj);
  //           return { btnNm, msgObj };
  //         };
  //         for (let i = 0; i < data?.length; i++) {
  //           const status: any = data?.[i]?.O_STATUS;
  //           const message = data?.[i]?.O_MESSAGE;
  //           if (status === "999") {
  //             setTimeout(async () => {
  //               const { btnNm, msgObj } = await getBtnName({
  //                 messageTitle: "ValidationFailed",
  //                 message,
  //                 icon: "ERROR",
  //               });
  //               if (btnNm === "Ok") {
  //                 setCount((pre) => pre + 1);
  //               }
  //             }, 0);
  //           } else if (status === "99") {
  //             setTimeout(async () => {
  //               const { btnNm, msgObj } = await getBtnName({
  //                 messageTitle: "Confirmation",
  //                 message,
  //                 buttonNames: ["Yes", "No"],
  //                 icon: "CONFIRM",
  //               });
  //               if (btnNm === "No") {
  //                 setCount((pre) => pre + 1);
  //               }
  //             }, 0);
  //           } else if (status === "9") {
  //             setTimeout(async () => {
  //               const { btnNm, msgObj } = await getBtnName({
  //                 messageTitle: "Alert",
  //                 message,
  //                 icon: "WARNING",
  //               });
  //             }, 0);
  //           }
  //         }
  //       } else {
  //         setTimeout(async () => {
  //           const res = await MessageBox({
  //             messageTitle: "Generated Voucher No./ Reference No.",
  //             message: `${data?.[0]?.TRAN_CD} / ${data?.[0]?.REFERENCE_NO}`,
  //             defFocusBtnName: "Ok",
  //             icon: "INFO",
  //           });
  //           if (res === "Ok") {
  //             setCount((pre) => pre + 1);
  //           }
  //         }, 0);
  //       }
  //     }
  //   },
  //   onError: (error: any, variables: any) => {
  //     CloseMessageBox();
  //   },
  // });

  //useEffect for open save confirmation and call the denomination save API
  useEffect(() => {
    const fetchData = async () => {
      if (state?.remainExcess === 0 && Boolean(displayTable)) {
        const res = await MessageBox({
          messageTitle: "Confirmation",
          message: "All Transactions are Completed. Do you want to proceed?",
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          loadingBtnName: ["Yes"],
          icon: "CONFIRM",
        });
        if (res === "Yes") {
          //For collect row data of deno. table
          const rowData = getDenoRowData();

          //For map the single deno. rows
          const mapSingleDinoRow = (item) => ({
            BRANCH_CD: item?.BRANCH_CD ?? "",
            ACCT_TYPE: item?.ACCT_TYPE ?? "",
            ACCT_CD: item?.ACCT_CD ?? "",
            TYPE_CD: item?.TRX ?? "",
            COMP_CD: authState?.companyID ?? "",
            CHEQUE_NO: item?.CHQNO ?? "",
            SDC: item?.SDC ?? "",
            SCROLL1: Boolean(item?.SCROLL) ? item?.SCROLL : item?.TOKEN ?? "",
            CHEQUE_DT: item?.CHQ_DT ?? "",
            REMARKS: item?.REMARK ?? "",
            AMOUNT: Boolean(item?.RECEIPT)
              ? item?.RECEIPT ?? "0"
              : item?.PAYMENT ?? "0",
          });

          //Prepearing API request
          const reqData = {
            TRN_DTL:
              screenFlag === "SINGLEDENO"
                ? formData?.singleDenoRow?.map(mapSingleDinoRow)
                : [
                    {
                      BRANCH_CD: formData?.BRANCH_CD ?? "",
                      ACCT_TYPE: formData?.ACCT_TYPE ?? "",
                      ACCT_CD: formData?.ACCT_CD ?? "",
                      TYPE_CD: typeCode ?? "",
                      COMP_CD: authState?.companyID ?? "",
                      CHEQUE_NO: formData?.CHEQUE_NO ?? "", //
                      SDC: formData?.SDC ?? "",
                      SCROLL1: formData?.SCROLL1 ?? "",
                      CHEQUE_DT: formData?.CHEQUE_DT ?? "",
                      REMARKS: formData?.REMARKS ?? "",
                      AMOUNT:
                        screenFlag === "CASHREC"
                          ? formData?.RECEIPT ?? "0"
                          : formData?.AMOUNT ?? "0",
                      TRAN_CD: formData?.TRAN_CD ?? "",
                    },
                  ],
            DENO_DTL: rowData?.map((itemData) => ({
              TYPE_CD: typeCode ?? "",
              DENO_QTY: itemData?.INPUT_VALUE ?? "",
              DENO_TRAN_CD: itemData?.TRAN_CD ?? "",
              DENO_VAL: itemData?.DENO_VAL ?? "",
              AMOUNT: itemData?.MULTIPLIED_VALUE?.toString() ?? "",
            })),
            SCREEN_REF:
              {
                CASHREC: "TRN/039",
                CASHPAY: "TRN/040",
                SINGLEDENO: "TRN/041",
                CASHRECOTHER: "TRN/039",
                SINGLERECOTHER: "TRN/041",
              }[screenFlag] ?? "",

            // screenFlag === "CASHREC" || screenFlag === "CASHRECOTHER"
            //   ? "TRN/039"
            //   : screenFlag === "CASHPAY"
            //   ? "TRN/040"
            //   : screenFlag === "SINGLEDENO"
            //   ? "TRN/041"
            //   : "",
            ENTRY_TYPE:
              {
                CASHREC: "SINGLEREC",
                CASHPAY: "SINGLEPAY",
                SINGLEDENO: "MULTIRECPAY",
                CASHRECOTHER: "SINGLEOTHREC",
                SINGLERECOTHER: "MULTIOTHREC",
              }[screenFlag] ?? "",

            // screenFlag === "CASHREC"
            //   ? "SINGLEREC"
            //   : screenFlag === "CASHPAY"
            //   ? "SINGLEPAY"
            //   : screenFlag === "SINGLEDENO"
            //   ? "MULTIRECPAY"
            //   : screenFlag === "CASHRECOTHER"
            //   ? "SINGLEOTHREC"
            //   : "MULTIOTHREC",
          };

          //Mutate deno. save API
          saveDenominationData?.mutate(reqData);
        } else {
          CloseMessageBox();
        }
      }
    };

    fetchData();
  }, [state?.remainExcess]);

  const getDenoRowData = () =>
    data
      ?.map((apiRow, index) => {
        const inputAmount = state?.inputVal[index] || "";
        const multipliedValue = state?.amount[index] || "";

        if (
          Boolean(inputAmount) &&
          Boolean(multipliedValue) &&
          multipliedValue !== "NaN"
        ) {
          return {
            ...apiRow,
            INPUT_VALUE: inputAmount,
            MULTIPLIED_VALUE: multipliedValue,
          };
        }
      })
      ?.filter(Boolean);

  // const getRowData = () => {
  //   const row = data;
  //   const inputAmount = state?.inputVal || "";
  //   const multiplicationResult = state?.amount || "";

  //   const getRowViseData = row
  //     ?.map((apiRows, index) => {
  //       if (
  //         Object?.hasOwn(inputAmount, index) &&
  //         Boolean(inputAmount[index]) &&
  //         Boolean(state?.amount[index]) &&
  //         state?.amount[index] !== "NaN"
  //       ) {
  //         const newRow = { ...apiRows, INPUT_VALUE: inputAmount[index] };
  //         if (state?.amount[index] !== undefined) {
  //           newRow.MULTIPLIED_VALUE = state?.amount[index];
  //         }
  //         return newRow;
  //       }
  //     })
  //     ?.filter((row) => {
  //       return Boolean(row);
  //     });

  //   return getRowViseData;
  // };

  return (
    <TellerDenoTable
      displayTable={displayTable}
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
      // openAcctDtl={state?.openAcctDtl}
      displayError={state?.displayError}
      // handleonFocus={handleonFocus}
      gridLable={gridLable}
      saveDenominationData={saveDenominationData}
    />
  );
};

export default TellerDenoTableCalc;
