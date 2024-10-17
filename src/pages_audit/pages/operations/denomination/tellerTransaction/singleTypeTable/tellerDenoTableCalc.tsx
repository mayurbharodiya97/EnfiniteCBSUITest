import React, { useContext, useEffect, useReducer, useRef } from "react";
import TellerDenoTable from "./tellerDenoTable";
import {
  SingleTableDataReducer,
  SingleTableInititalState,
  SingleTableActionTypes,
} from "./denoTableActionTypes";
import { usePopupContext } from "@acuteinfo/common-base";
import { AuthContext } from "pages_audit/auth";
import { useMutation } from "react-query";
import * as API from "../api";

const TellerDenoTableCalc = ({
  displayTable,
  formData,
  data,
  isLoading,
  onCloseTable,
  gridLable,
  initRemainExcess,
  screenRef,
  entityType,
  setOpenDenoTable,
  setCount,
}) => {
  const textFieldRef: any = useRef(null);
  const [state, dispatch] = useReducer(
    SingleTableDataReducer,
    SingleTableInititalState
  );
  const { MessageBox, CloseMessageBox } = usePopupContext();
  const { authState } = useContext(AuthContext);
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
      parseFloat(sanitValue) * parseFloat(data?.[index]?.DENO_VAL);
    dispatch({
      type: SingleTableActionTypes?.SET_AMOUNT_VAL,
      payload: multipliedValue,
    });
  };

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
    //   payload: Boolean(formData?.TRN === "R")
    //     ? formData?.RECEIPT
    //     : Boolean(formData?.TRN === "P")
    //     ? formData?.PAYMENT
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

    if (
      screenRef === "TRN/039" &&
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
      screenRef === "TRN/040" &&
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

    // const consoleData = getRowData();
    // console.log(consoleData, "consoleconsoleconsoleconsoleconsole");
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
    const withdrawAmount: any = initRemainExcess;
    const upadatedFinalAmount: any =
      parseFloat(withdrawAmount) - parseFloat(state?.columnTotal?.amount);
    if (!Boolean(haveerror)) {
      dispatch({
        type: SingleTableActionTypes?.SET_REMAINEXCESS_VAL,
        payload: upadatedFinalAmount,
      });
    }
  }, [state?.columnTotal?.amount, data, haveerror, formData]);

  const saveDenominationData = useMutation(API.saveDenoData, {
    onSuccess: async (data: any, variables: any) => {
      CloseMessageBox();
      setOpenDenoTable(false);
      if (data?.length > 0) {
        if (data?.[0]?.hasOwnProperty("O_STATUS")) {
          const getBtnName = async (msgObj) => {
            let btnNm = await MessageBox(msgObj);
            return { btnNm, msgObj };
          };
          for (let i = 0; i < data?.length; i++) {
            const status: any = data?.[i]?.O_STATUS;
            const message = data?.[i]?.O_MESSAGE;
            if (status === "999") {
              setTimeout(async () => {
                const { btnNm, msgObj } = await getBtnName({
                  messageTitle: "ValidationFailed",
                  message,
                  icon: "ERROR",
                });
                if (btnNm === "Ok") {
                  setCount((pre) => pre + 1);
                }
              }, 0);
            } else if (status === "99") {
              setTimeout(async () => {
                const { btnNm, msgObj } = await getBtnName({
                  messageTitle: "Confirmation",
                  message,
                  buttonNames: ["Yes", "No"],
                  icon: "",
                });
                if (btnNm === "No") {
                  setCount((pre) => pre + 1);
                }
              }, 0);
            } else if (status === "9") {
              setTimeout(async () => {
                const { btnNm, msgObj } = await getBtnName({
                  messageTitle: "Alert",
                  message,
                });
              }, 0);
            }
          }
        } else {
          setTimeout(async () => {
            const res = await MessageBox({
              messageTitle: "Generated Voucher No./ Reference No.",
              message: `${data?.[0]?.TRAN_CD} / ${data?.[0]?.REFERENCE_NO}`,
              defFocusBtnName: "Ok",
              icon: "INFO",
            });
            if (res === "Ok") {
              setCount((pre) => pre + 1);
            }
          }, 0);
        }
      }
    },
    onError: (error: any, variables: any) => {
      CloseMessageBox();
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (state?.remainExcess === 0 && displayTable) {
        // dispatch({
        //   type: SingleTableActionTypes?.SET_CONFIRMATION_VAL,
        //   payload: true,
        // });
        const res = await MessageBox({
          messageTitle: "Confirmation",
          message: "All Transactions are Completed. Do you want to proceed?",
          //@ts-ignore
          buttonNames: ["Yes", "No"],
          defFocusBtnName: "Yes",
          loadingBtnName: ["Yes"],
          icon: "INFO",
        });
        if (res === "Yes") {
          const DDT = getRowData();
          const reqData = {
            TRN_DTL:
              screenRef === "TRN/041"
                ? formData?.singleDenoRow?.map((item) => {
                    const parameters = {
                      BRANCH_CD: item?.BRANCH_CD ?? "",
                      ACCT_TYPE: item?.ACCT_TYPE ?? "",
                      ACCT_CD: item?.ACCT_CD ?? "",
                      TYPE_CD: item?.TRX ?? "",
                      COMP_CD: authState?.companyID ?? "",
                      CHEQUE_NO: item?.CHQNO ?? "",
                      SDC: item?.SDC ?? "",
                      SCROLL1: Boolean(item?.SCROLL)
                        ? item?.SCROLL
                        : item?.TOKEN ?? "",
                      CHEQUE_DT: item?.CHQ_DT ?? "",
                      REMARKS: item?.REMARK ?? "",
                      AMOUNT: Boolean(item?.RECEIPT)
                        ? item?.RECEIPT
                        : item?.PAYMENT ?? "",
                    };
                    return parameters;
                  })
                : [
                    {
                      BRANCH_CD: formData?.BRANCH_CD ?? "",
                      ACCT_TYPE: formData?.ACCT_TYPE ?? "",
                      ACCT_CD: formData?.ACCT_CD ?? "",
                      TYPE_CD: screenRef === "TRN/039" ? "1" : "4",
                      COMP_CD: authState?.companyID ?? "",
                      CHEQUE_NO: formData?.CHEQUE_NO ?? "",
                      SDC: formData?.SDC ?? "",
                      SCROLL1: "",
                      CHEQUE_DT: formData?.CHEQUE_DT ?? "",
                      REMARKS: formData?.REMARK ?? "",
                      AMOUNT:
                        screenRef === "TRN/039"
                          ? formData?.RECEIPT
                          : formData?.PAYMENT,
                    },
                  ],
            DENO_DTL: DDT?.map((itemData) => {
              const data = {
                TYPE_CD:
                  screenRef === "TRN/041"
                    ? formData?.FINAL_AMOUNT > 0
                      ? "1"
                      : "4"
                    : screenRef === "TRN/039"
                    ? "1"
                    : "4",
                DENO_QTY: itemData?.INPUT_VALUE ?? "",
                DENO_TRAN_CD: itemData?.TRAN_CD ?? "",
                DENO_VAL: itemData?.DENO_VAL ?? "",
                AMOUNT: itemData?.MULTIPLIED_VALUE?.toString() ?? "",
              };
              return data;
            }),
            SCREEN_REF: screenRef,
            ENTRY_TYPE: entityType,
          };
          saveDenominationData?.mutate(reqData);
        } else if (res === "No") {
          CloseMessageBox();
        }
      } else {
        CloseMessageBox();
      }
    };

    fetchData();
  }, [state?.remainExcess]);

  const getRowData = () => {
    const row = data;
    const inputAmount = state?.inputVal || "";
    const multiplicationResult = state?.amount || "";
    const getRowViseData = row
      ?.map((apiRows, index) => {
        if (
          Object?.hasOwn(inputAmount, index) &&
          Boolean(inputAmount[index]) &&
          Boolean(state?.amount[index]) &&
          state?.amount[index] !== "NaN"
        ) {
          const newRow = { ...apiRows, INPUT_VALUE: inputAmount[index] };
          if (state?.amount[index] !== undefined) {
            newRow.MULTIPLIED_VALUE = state?.amount[index];
          }
          return newRow;
        }
      })
      ?.filter((row) => {
        return Boolean(row);
      });

    return getRowViseData;
  };

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
