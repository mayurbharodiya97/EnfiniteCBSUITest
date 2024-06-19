import React, { useEffect, useRef, useState } from "react";
import DualPartTable from "./dualPartTable";
import { useStyles } from "./style";

const DualTableCalc = ({
  data,
  displayTableDual,
  // openAcctDtl,
  onCloseTable,
  isLoading,
  gridLable,
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
  const [confirmation, setConfirmation] = useState(false);
  const [remainExcess, setRemainExcess] = useState<any>(0);
  // const remainExcess: any = useRef({});
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
    (formData?.RECEIPT ? formData?.RECEIPT : formData?.PAYMENT) || 0;

  useEffect(() => {
    if (Boolean(formData)) {
      // remainExcess.current = finalReceiptPayment;
      setRemainExcess(finalReceiptPayment);
    }
  }, [formData]);

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
              message:
                "Denomination 5000 should be less than or equal to balance amount.",
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
      if (formData?.TRN === "R") {
        calcRemainExcess =
          parseInt(finalReceiptPayment) -
          parseInt(newTotalAmounts["amount"]) +
          parseInt(newTotalAmounts["amount2"]);
      } else if (formData?.TRN === "P") {
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
  const openConfirmation = () => {
    if (remainExcess === 0) {
      setConfirmation(true);
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
  //   // console.log(remainExcess, "remianExcesssdsereefef");
  // }, [remainExcess]);

  const closeConfirmation = () => {
    setConfirmation(false);
    // Reset remainExcess state here
    // setRemainExcess(finalReceiptPayment);
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
    />
  );
};

export default DualTableCalc;
