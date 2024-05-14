import React, { useEffect, useRef, useState } from "react";
import DualPartTable from "./dualPartTable";
import { useStyles } from "./style";

const DualTableCalc = ({
  data,
  displayTableDual,
  openAcctDtl,
  onCloseTable,
  isLoading,
  extraAccDtl,
  formData,
}) => {
  const columnDefinitions = [
    {
      label: "Denomination",
      fieldName: "DENO_LABLE",
      isTotalWord: true,
      uniqueID: "1",
    },
    { label: "Receipt", fieldName: "receipt", isEditable: true, uniqueID: "2" },
    { label: "Amount", fieldName: "amount", isCurrency: true, uniqueID: "3" },
    {
      label: "Denomination",
      fieldName: "DENO_LABLE",
      isTotalWord: true,
      uniqueID: "4",
    },
    { label: "Payment", fieldName: "payment", isEditable: true, uniqueID: "5" },
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

  const remainExcess: any = useRef({});
  const fixedDataTotal: any = useRef({});
  const classes = useStyles();

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

  const finalReceiptPayment =
    (formData?.RECEIPT ? formData?.RECEIPT : formData?.PAYMENT) || "0";

  useEffect(() => {
    if (Boolean(formData)) {
      remainExcess.current = finalReceiptPayment;
    }
  }, [formData]);

  // console.log(remainExcess, "remainExcessremainExcess");

  const handleBlur = (fieldName, index) => {
    const newTotalAmounts = { ...totalAmounts };

    columnDefinitions.forEach((column) => {
      const fieldName = column.fieldName;
      newTotalAmounts[fieldName] = data.reduce((total, item, i) => {
        const value = inputValues[i]?.[fieldName] || item[fieldName] || "0";
        return total + parseFloat(value);
      }, 0);
    });

    const operation = formData?.TRN === "R" ? -1 : 1;
    const fieldOperation = fieldName === "receipt" ? 1 : -1;
    const amountfieldName = fieldName === "receipt" ? "amount" : "amount2";
    remainExcess.current =
      Number(finalReceiptPayment) +
      operation * fieldOperation * newTotalAmounts[amountfieldName];

    setTotalAmounts(newTotalAmounts);

    if (
      fieldName === "payment" &&
      inputValues[index]?.amount2 > data[index]?.AVAIL_VAL
    ) {
      setErrors((prevErrors) => [
        ...prevErrors,
        {
          index,
          fieldName,
          message:
            "Denomination 5000 should be less than or equal to balance amount.",
        },
      ]);
    } else if (
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

  const handleChange = (e, index, fieldName) => {
    const { value } = e.target;
    setInputValues((prevInputValues) => {
      const updatedValues = {
        ...prevInputValues,
        [index]: {
          ...prevInputValues[index],
          [fieldName]: value ?? "0",
        },
      };

      // Calculate the multiplied values
      if (fieldName === "receipt") {
        const denomination = parseFloat(data[index]["DENO_VAL"]);
        updatedValues[index]["amount"] = denomination * parseFloat(value);
      } else if (fieldName === "payment") {
        const denomination = parseFloat(data[index]["DENO_VAL"]);
        updatedValues[index]["amount2"] = denomination * parseFloat(value);
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
  //   console.log(totalAmounts, "totalAmountstotalAmounts");
  // }, [totalAmounts]);

  return (
    <DualPartTable
      data={data || []}
      columnDefinitions={columnDefinitions}
      isLoading={isLoading}
      displayTableDual={displayTableDual}
      openAcctDtl={openAcctDtl}
      onCloseTable={onCloseTable}
      handleChange={handleChange}
      inputValues={inputValues}
      totalAmounts={
        Object.keys(totalAmounts).length === 0
          ? fixedDataTotal.current
          : totalAmounts
      }
      extraAccDtl={extraAccDtl}
      handleBlur={handleBlur}
      inputRestrictions={inputRestrictions}
      remainExcess={remainExcess?.current}
      remainExcessLable={remainExcess?.current >= 0 ? "Remaining " : "Excess "}
      errors={errors}
    />
  );
};

export default DualTableCalc;
