export const calculateLTVPerc = (dependentFields) => {
  const sanLoanAmt = Number(dependentFields["SAN_LOAN_AMOUNT"]?.value);
  const fdBalance = Number(dependentFields["FD_BALANCE"]?.value);
  if (!isNaN(sanLoanAmt) && !isNaN(fdBalance)) {
    const total = (sanLoanAmt / fdBalance) * 100;
    return total.toFixed(2);
  }
};

export const calculateDBRAmount = (dependentFields) => {
  const emiAmount = Number(dependentFields["EMI_AMOUNT"]?.value);
  const monthlyIncome = Number(dependentFields["MONTHLY_INCOME"]?.value);
  if (!isNaN(emiAmount) && !isNaN(monthlyIncome)) {
    const total = emiAmount / monthlyIncome;
    return total.toFixed(2);
  }
};

export const calculateDBRPerc = (dependentFields) => {
  const otherLoanEMI = Number(dependentFields["OTHER_LOAN_EMI"]?.value);
  const ccLimitAmt = Number(dependentFields["CC_LIM_AMOUNT"]?.value);
  const percCardLimit = Number(dependentFields["PERC_CARD_LIMIT"]?.value);
  const monthlyIncome = Number(dependentFields["MONTHLY_INCOME"]?.value);
  const cardLimit = (ccLimitAmt * percCardLimit) / 100;
  const total = ((otherLoanEMI + cardLimit) / monthlyIncome) * 100;
  return total.toFixed(2);
};

export const calculateSanInstAmt = (dependentFields) => {
  const sanLoanAmt = Number(dependentFields["SAN_LOAN_AMOUNT"]?.value);
  const sanLoanTenure = Number(dependentFields["SAN_LOAN_TENURE"]?.value);
  const sanIntRate = Number(dependentFields["SAN_INT_RATE"]?.value);
  const sanInstAmt =
    sanLoanAmt *
    (sanIntRate / (12 * 100)) *
    (Math.pow(1 + sanIntRate / (12 * 100), sanLoanTenure) /
      (Math.pow(1 + sanIntRate / (12 * 100), sanLoanTenure) - 1));

  return sanInstAmt.toFixed(2);
};

export const calculateFinalLoanAmt = (dependentFields) => {
  const sanLoanAmt = Number(dependentFields["SAN_LOAN_AMOUNT"]?.value);
  const fdBalance = Number(dependentFields["FD_BALANCE"]?.value);
  if (!isNaN(sanLoanAmt) && !isNaN(fdBalance)) {
    const total = (sanLoanAmt / fdBalance) * fdBalance;
    return total.toFixed(2);
  }
};

export const getSchemeSource = (dependentFields) => {
  const value = dependentFields["PARENT_TYPE"]?.value;
  let optionData = dependentFields["PARENT_TYPE"]?.optionData;
  let source = "";
  if (Array.isArray(optionData)) {
    source = optionData.reduce((accu, item) => {
      if (item?.value === value) {
        return item?.SOURCE;
      }
      return accu;
    }, "");
  } else {
    if (optionData[value] === value) {
      source = optionData["SOURCE"];
    }
  }
  //console.log(">>source", dependentFields);
  return source;
};
// export const getSchemeSource = async (dependentFields: any): Promise<any> => {
//   const dependentVaue = dependentFields["PARENT_TYPE"].value;
//   const { status, data } = await AuthSDK.internalFetcher("", {
//     dependentVaue,
//   });
//   if (status === "success") {
//     return data;
//   } else {
//     return "";
//   }
// };
