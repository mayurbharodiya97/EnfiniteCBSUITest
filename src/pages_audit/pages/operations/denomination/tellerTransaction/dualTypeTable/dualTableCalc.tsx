import React, { useContext, useEffect, useRef, useState } from "react";
import DualPartTable from "./dualPartTable";
import { AuthContext } from "pages_audit/auth";
import { usePopupContext } from "@acuteinfo/common-base";
import { useMutation } from "react-query";
import * as API from "../../api";

const DualTableCalc = ({
  data,
  displayTableDual,
  // openAcctDtl,
  onCloseTable,
  isLoading,
  gridLable,
  formData,
  initRemainExcess,
  screenRef,
  entityType,
  setOpenDenoTable,
  setCount,
}) => {
  const columnDefinitions = [
    {
      label: "Denomination",
      fieldName: "DENO_LABLE",
      isTotalWord: true,
      uniqueID: "1",
    },
    {
      label: "Receipt",
      fieldName: "receipt",
      isEditable: true,
      uniqueID: "2",
      isCurrency: true,
    },
    { label: "Amount", fieldName: "amount", isCurrency: true, uniqueID: "3" },
    {
      label: "Denomination",
      fieldName: "DENO_LABLE",
      isTotalWord: true,
      uniqueID: "4",
    },
    {
      label: "Payment",
      fieldName: "payment",
      isEditable: true,
      uniqueID: "5",
      isCurrency: true,
    },
    { label: "Amount", fieldName: "amount2", isCurrency: true, uniqueID: "6" },
    { label: "Available Note(s)", fieldName: "AVAIL_QTY", uniqueID: "7" },
    {
      label: "Balance",
      fieldName: "AVAIL_VAL",
      isCurrency: true,
      uniqueID: "8",
    },
  ];

  const [inputValues, setInputValues] = useState({});
  const [totalAmounts, setTotalAmounts] = useState({});
  type ErrorType = { index: number; fieldName: string; message: string };
  const [errors, setErrors] = useState<ErrorType[]>([]);
  const [confirmation, setConfirmation] = useState(false);
  const [remainExcess, setRemainExcess] = useState<any>(0);
  // const remainExcess: any = useRef({});
  const fixedDataTotal: any = useRef({});
  const { authState } = useContext(AuthContext);
  const { MessageBox, CloseMessageBox } = usePopupContext();

  const inputRestrictions = {
    min: 0,
    step: 1,
    pattern: "\\d*",
  };

  useEffect(() => {
    const newTotalAmounts = { ...totalAmounts };

    ["AVAIL_QTY", "AVAIL_VAL"].forEach((fieldName) => {
      newTotalAmounts[fieldName] = data.reduce((total, item) => {
        const value = item[fieldName] || "0";
        return total + parseFloat(value);
      }, 0);
    });

    fixedDataTotal.current = newTotalAmounts;
  }, [data]);

  const finalReceiptPayment = initRemainExcess;

  useEffect(() => {
    if (Boolean(formData)) {
      // remainExcess.current = finalReceiptPayment;
      setRemainExcess(finalReceiptPayment);
    }
  }, [formData, finalReceiptPayment]);

  const handleBlur = (event, fieldName, index) => {
    if (data) {
      const { value = "0" } = event?.target || {};
      // console.log(fieldName, "fieldNamefieldName54514552");
      const newTotalAmounts = { ...totalAmounts };
      columnDefinitions.forEach((column) => {
        const fieldName = column.fieldName;
        newTotalAmounts[fieldName] = data.reduce((total, item, i) => {
          const value = inputValues[i]?.[fieldName] || item[fieldName] || "0";
          return total + parseFloat(value);
        }, 0);
      });

      // Check if the error exists and update the state accordingly
      if (
        fieldName === "payment" &&
        inputValues[index]?.amount2 > data[index]?.AVAIL_VAL
      ) {
        setErrors((prevErrors) => {
          const updatedErrors = [
            ...prevErrors,
            {
              index,
              fieldName,
              message: `Denomination ${data?.[index]?.DENO_VAL} should be less than or equal to balance amount.`,
            },
          ];
          performCalculation(newTotalAmounts, updatedErrors);
          return updatedErrors;
        });
      } else {
        setErrors((prevErrors) => {
          const updatedErrors = prevErrors.filter(
            (error) => !(error.index === index && error.fieldName === fieldName)
          );
          performCalculation(newTotalAmounts, updatedErrors);
          return updatedErrors;
        });
      }
    }
  };

  const performCalculation = (newTotalAmounts, currentErrors) => {
    if (currentErrors.length === 0) {
      let calcRemainExcess;
      if (screenRef === "TRN/039") {
        calcRemainExcess =
          parseInt(finalReceiptPayment) -
          parseInt(newTotalAmounts["amount"]) +
          parseInt(newTotalAmounts["amount2"]);
      } else if (screenRef === "TRN/040") {
        calcRemainExcess =
          parseInt(finalReceiptPayment) +
          parseInt(newTotalAmounts["amount"]) -
          parseInt(newTotalAmounts["amount2"]);
      }
      setRemainExcess(calcRemainExcess);
    }
    setTotalAmounts(newTotalAmounts);
  };

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
                  icon: "CONFIRM",
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
                  icon: "WARNING",
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

  const getRowData = () => {
    const getRowsViseData = data
      ?.map((apiRow, index) => {
        if (Object?.hasOwn(inputValues, index)) {
          const newRowsReceipt = {
            ...apiRow,
            DENO_QTY:
              screenRef === "TRN/041"
                ? formData?.FINAL_AMOUNT > 0
                  ? inputValues[index]?.receipt
                  : "-" + inputValues[index]?.receipt
                : screenRef === "TRN/040"
                ? "-" + inputValues[index]?.receipt
                : screenRef === "TRN/039"
                ? inputValues[index]?.receipt
                : "",
            AMOUNT:
              screenRef === "TRN/041"
                ? formData?.FINAL_AMOUNT > 0
                  ? inputValues[index]?.amount?.toString()
                  : "-" + inputValues[index]?.amount?.toString()
                : screenRef === "TRN/040"
                ? "-" + inputValues[index]?.amount?.toString()
                : screenRef === "TRN/039"
                ? inputValues[index]?.amount?.toString()
                : "",
          };
          const newRowsPayment = {
            ...apiRow,
            DENO_QTY:
              screenRef === "TRN/041"
                ? formData?.FINAL_AMOUNT > 0
                  ? "-" + inputValues[index]?.payment
                  : inputValues[index]?.payment
                : screenRef === "TRN/039"
                ? "-" + inputValues[index]?.payment
                : screenRef === "TRN/040"
                ? inputValues[index]?.payment
                : "",
            AMOUNT:
              screenRef === "TRN/041"
                ? formData?.FINAL_AMOUNT > 0
                  ? "-" + inputValues[index]?.amount2?.toString()
                  : inputValues[index]?.amount2?.toString()
                : screenRef === "TRN/039"
                ? "-" + inputValues[index]?.amount2?.toString()
                : screenRef === "TRN/040"
                ? inputValues[index]?.amount2?.toString()
                : "",
          };

          const resMinusPay = {
            ...apiRow,
            DENO_QTY: (
              inputValues[index]?.receipt - inputValues[index]?.payment
            )?.toString(),
            AMOUNT: (
              inputValues[index]?.amount - inputValues[index]?.amount2
            )?.toString(),
          };
          if (
            Boolean(inputValues[index]?.receipt) &&
            Boolean(inputValues[index]?.payment)
          ) {
            return resMinusPay;
          } else if (inputValues[index]?.receipt) {
            return newRowsReceipt;
          } else if (inputValues[index]?.payment) {
            return newRowsPayment;
          }
        }
      })
      ?.filter((row) => {
        return Boolean(row);
      });
    return getRowsViseData?.flat();
  };
  const openConfirmation = async () => {
    if (remainExcess === 0 && displayTableDual) {
      setConfirmation(true);
      // const res = await MessageBox({
      //   messageTitle: "Confirmation",
      //   message: "All Transactions are Completed. Do you want to proceed?",
      //   buttonNames: ["Yes", "No"],
      //   defFocusBtnName: "No",
      //   icon: "CONFIRM",
      // });
      // if (res === "Yes") {
      //   console.log("Form Submitted");
      //   const DDT = getRowData();
      //   console.log(DDT, "DDtjanbdvjbnjsdbnvjksvdb");
      // } else if (res === "No") {
      //   CloseMessageBox();
      // }

      const response = await MessageBox({
        messageTitle: "Confirmation",
        message: "All Transactions are Completed. Do you want to proceed?",
        //@ts-ignore
        buttonNames: ["Yes", "No"],
        defFocusBtnName: "Yes",
        loadingBtnName: ["Yes"],
        icon: "CONFIRM",
      });
      if (response === "Yes") {
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
              DENO_QTY: itemData?.DENO_QTY ?? "",
              DENO_TRAN_CD: itemData?.TRAN_CD ?? "",
              DENO_VAL: itemData?.DENO_VAL ?? "",
              AMOUNT: itemData?.AMOUNT ?? "",
            };
            return data;
          }),
          SCREEN_REF: screenRef,
          ENTRY_TYPE: entityType,
        };
        saveDenominationData?.mutate(reqData);
      } else if (response === "No") {
        CloseMessageBox();
      }
    } else {
      CloseMessageBox();
    }
  };

  useEffect(() => {
    if (Object?.keys(totalAmounts)?.length > 0) {
      openConfirmation();
    }
    // console.log(data, totalAmounts, "data,totalAmount");
  }, [data, totalAmounts, remainExcess]);

  const handleChange = (e, index, fieldName) => {
    const { value } = e.target;
    setInputValues((prevInputValues) => {
      const updatedValues = {
        ...prevInputValues,
        [index]: {
          receipt: prevInputValues[index]?.receipt || "",
          amount: prevInputValues[index]?.amount || 0,
          payment: prevInputValues[index]?.payment || "",
          amount2: prevInputValues[index]?.amount2 || 0,
          [fieldName]: value ?? "0",
        },
      };

      // Calculate the multiplied values
      if (fieldName === "receipt") {
        const denomination = parseFloat(data[index]["DENO_VAL"]);
        updatedValues[index]["amount"] =
          denomination * parseFloat(value || "0");
      } else if (fieldName === "payment") {
        const denomination = parseFloat(data[index]["DENO_VAL"]);
        updatedValues[index]["amount2"] =
          denomination * parseFloat(value || "0");
      }

      if (
        updatedValues[index].receipt === "" &&
        updatedValues[index].payment === ""
      ) {
        delete updatedValues[index];
      }

      return updatedValues;
    });

    if (
      errors.some(
        (error) => error.index === index && error.fieldName === fieldName
      )
    ) {
      setErrors((prevErrors) =>
        prevErrors.filter(
          (error) => !(error.index === index && error.fieldName === fieldName)
        )
      );
    }
  };

  useEffect(() => {
    setInputValues({});
    setTotalAmounts({});
    setErrors([]);
  }, [onCloseTable]);

  const closeConfirmation = () => {
    setConfirmation(false);
  };

  return (
    <DualPartTable
      data={data || []}
      columnDefinitions={columnDefinitions}
      isLoading={isLoading}
      displayTableDual={displayTableDual}
      // openAcctDtl={openAcctDtl}
      onCloseTable={onCloseTable}
      handleChange={handleChange}
      inputValues={inputValues}
      totalAmounts={
        Object.keys(totalAmounts).length === 0
          ? fixedDataTotal.current
          : totalAmounts
      }
      gridLable={gridLable}
      handleBlur={handleBlur}
      inputRestrictions={inputRestrictions}
      remainExcess={remainExcess}
      remainExcessLable={remainExcess >= 0 ? "Remaining " : "Excess "}
      errors={errors}
      confirmation={confirmation}
      closeConfirmation={closeConfirmation}
      getRowData={getRowData}
      formData={formData}
      screenRef={screenRef}
      entityType={entityType}
    />
  );
};

export default DualTableCalc;
