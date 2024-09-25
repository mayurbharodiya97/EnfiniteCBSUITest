import React, { useContext, useEffect, useRef, useState } from "react";
import DualPartTable from "./dualPartTable";
import { AuthContext } from "pages_audit/auth";

const DualTableCalc = ({
  data,
  displayTableDual,
  // openAcctDtl,
  onCloseTable,
  isLoading,
  gridLable,
  formData,
  initRemainExcess,
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
      if (formData?.TRN === "1") {
        calcRemainExcess =
          parseInt(finalReceiptPayment) -
          parseInt(newTotalAmounts["amount"]) +
          parseInt(newTotalAmounts["amount2"]);
      } else if (formData?.TRN === "4") {
        calcRemainExcess =
          parseInt(finalReceiptPayment) +
          parseInt(newTotalAmounts["amount"]) -
          parseInt(newTotalAmounts["amount2"]);
      }
      setRemainExcess(calcRemainExcess);
    }
    setTotalAmounts(newTotalAmounts);
  };

  // useEffect(() => {
  //   console.log(remainExcess, "remainExcesskasnfckasfnvkasncfkasvnc");
  // }, [remainExcess]);

  //for open confirmation after match remain/eccess 0

  const getRowData = () => {
    const getRowsViseData = data
      ?.map((apiRow, index) => {
        if (Object?.hasOwn(inputValues, index)) {
          const { TRN } = formData;
          const newRowsReceipt = {
            ...apiRow,
            DENO_QTY:
              TRN === "4"
                ? "-" + inputValues[index]?.receipt
                : TRN === "1"
                ? inputValues[index]?.receipt
                : "",
            AMOUNT: inputValues[index]?.amount?.toString(),
          };
          const newRowsPayment = {
            ...apiRow,
            DENO_QTY____PY:
              TRN === "1"
                ? "-" + inputValues[index]?.payment
                : TRN === "4"
                ? inputValues[index]?.payment
                : "",
            AMOUNT: inputValues[index]?.amount2?.toString(),
          };
          if (
            Boolean(inputValues[index]?.receipt) &&
            Boolean(inputValues[index]?.payment)
          ) {
            return [newRowsReceipt, newRowsPayment];
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
      //   const res = await MessageBox({
      //     messageTitle: "Confirmation",
      //     message: "All Transactions are Completed. Do you want to proceed?",
      //     buttonNames: ["Yes", "No"],
      //     defFocusBtnName: "No",
      //     icon: "INFO",
      //   });
      //   if (res === "Yes") {
      //     console.log("Form Submitted");
      //     const DDT = getRowData();
      //     console.log(DDT, "DDtjanbdvjbnjsdbnvjksvdb");
      //   } else if (res === "No") {
      //     CloseMessageBox();
      //   }
      // } else {
      //   CloseMessageBox();
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
    const { TRN } = formData;
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
  // useEffect(() => {
  //   // console.log(remainExcess, "remianExcesssdsereefef");
  // }, [remainExcess]);

  const closeConfirmation = () => {
    setConfirmation(false);
    // Reset remainExcess state here
    // setRemainExcess(finalReceiptPayment);
  };

  const datasa = {
    BRANCH_CD: formData?.BRANCH_CD ?? "",
    ACCT_TYPE: formData?.ACCT_TYPE ?? "",
    ACCT_CD: formData?.ACCT_CD ?? "",
    TYPE_CD:
      formData?.TRN === "1" ? "1" : formData?.TRN === "4" ? "4" : "" ?? "",
    COMP_CD: authState?.companyID,
    CHEQUE_NO: formData?.CHEQUE_NO ? formData?.CHEQUE_NO : "" ?? "",
    SDC: formData?.SDC?.trim() ?? "",
    SCROLL1: "" ?? "",
    CHEQUE_DT: formData?.CHEQUE_DT ? formData?.CHEQUE_DT : "" ?? "",
    REMARKS: formData?.REMARK ?? "",
    AMOUNT: formData?.RECEIPT ? formData?.RECEIPT : formData?.PAYMENT ?? "",
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
    />
  );
};

export default DualTableCalc;
