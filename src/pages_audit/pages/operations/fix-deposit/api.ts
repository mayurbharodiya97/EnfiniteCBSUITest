import { DefaultErrorObject } from "@acuteinfo/common-base";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getFDViewDtl = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDVIEWDTL", reqData);
  if (status === "0") {
    return data?.map((item: any) => {
      const updatedItem = {
        ...item,
        INT_RATE: Number(item?.INT_RATE ?? 0).toFixed(2),
      };
      if (updatedItem?.LEAN_FLAG.trim() === "Y") {
        updatedItem._rowColor = "rgb(255, 225, 225)";
      }
      return updatedItem;
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPaidFDViewDtl = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPAIDFDVIEWDTL", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDViewMasterDtl = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDVIEWMASTER", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateAcctDtl = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOVALIDATEACCOUNT", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDParaDetail = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDPARADETAIL", { ...reqData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getFDIntDetail = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDINTDTL", { ...reqData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const checkAllowModifyFDData = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHECKALLOWMODIFYFD", { ...reqData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDIntTermDDWData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDINTTERM", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DISP_VAL, DATA_VAL }) => {
        return {
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPeriodDDWData = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPERIODLIST", {
      ...reqData,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(
        ({ DESCR, PERIOD_CD, DEFAULT_VALUE }) => {
          return {
            value: PERIOD_CD,
            label: DESCR,
            defaultVal: DEFAULT_VALUE,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDIntRate = async (currField, dependentFields, auth) => {
  let currFieldName = currField?.name?.split(".");
  let fieldName = currFieldName[currFieldName.length - 1];
  let tranDate =
    fieldName === "TRAN_DT"
      ? currField?.value
      : dependentFields?.["FDDTL.TRAN_DT"]?.value;
  let periodCode =
    fieldName === "PERIOD_CD"
      ? currField?.value
      : dependentFields?.["FDDTL.PERIOD_CD"]?.value;
  let periodNo =
    fieldName === "PERIOD_NO"
      ? currField?.value
      : dependentFields?.["FDDTL.PERIOD_NO"]?.value;
  let cashAmt =
    fieldName === "CASH_AMT"
      ? currField?.value
      : dependentFields?.["FDDTL.CASH_AMT"]?.value;
  let transAmt =
    fieldName === "TRSF_AMT"
      ? currField?.value
      : dependentFields?.["FDDTL.TRSF_AMT"]?.value;

  let principalAmt = Number(cashAmt) + Number(transAmt);

  if (
    currField?.value &&
    dependentFields?.["FDDTL.BRANCH_CD"]?.value &&
    dependentFields?.["FDDTL.ACCT_TYPE"]?.value &&
    dependentFields?.["FDDTL.ACCT_CD"]?.value
  ) {
    const { data, status, message } = await AuthSDK.internalFetcher(
      "GETFDINTRATE",
      {
        COMP_CD: auth?.companyID ?? "",
        BRANCH_CD: dependentFields?.["FDDTL.BRANCH_CD"]?.value ?? "",
        ACCT_TYPE: dependentFields?.["FDDTL.ACCT_TYPE"]?.value ?? "",
        ACCT_CD: dependentFields?.["FDDTL.ACCT_CD"]?.value ?? "",
        CATEG_CD: dependentFields?.["FDDTL.CATEG_CD"]?.value ?? "",
        TRAN_DT: format(tranDate, "dd-MMM-yyyy"),
        TRSF_AMT: transAmt,
        PERIOD_CD: periodCode,
        PERIOD_NO: periodNo,
        MATURITY_DT: dependentFields?.["FDDTL.MATURITY_DT"]?.value
          ? format(dependentFields?.["FDDTL.MATURITY_DT"]?.value, "dd-MMM-yyyy")
          : "",
        PRE_INT_FLAG: "N",
        PRINCIPAL_AMT: principalAmt,
      }
    );
    if (status === "0") {
      return {
        INT_RATE: {
          value: data?.[0]?.INT_RATE ?? "",
          ignoreUpdate: true,
        },
        MATURITY_DT: {
          value: data?.[0]?.MATURITY_DT ?? "",
          ignoreUpdate: true,
        },
        MIN_AMT: {
          value: data?.[0]?.MIN_AMT ?? "",
          ignoreUpdate: true,
        },
        MAX_AMT: {
          value: data?.[0]?.MAX_AMT ?? "",
          ignoreUpdate: true,
        },
        MIN_DAYS: {
          value: data?.[0]?.MIN_DAYS ?? "",
          ignoreUpdate: true,
        },
        MAX_DAYS: {
          value: data?.[0]?.MAX_DAYS ?? "",
          ignoreUpdate: true,
        },
      };
    } else {
      return {
        [fieldName]: {
          value: "",
          error: message ?? "",
          ignoreUpdate: true,
        },
        INT_RATE: {
          value: "",
          ignoreUpdate: true,
        },
        MATURITY_DT: {
          value: "",
          ignoreUpdate: true,
        },
      };
    }
  } else {
    return {};
  }
};

export const getFDMaturityAmt = async (currField, dependentFields, auth) => {
  let currFieldName = currField?.name?.split(".");
  let fieldName = currFieldName[currFieldName.length - 1];
  let cashAmt =
    fieldName === "CASH_AMT"
      ? currField?.value
      : dependentFields?.["FDDTL.CASH_AMT"]?.value;
  let transAmt =
    fieldName === "TRSF_AMT"
      ? currField?.value
      : dependentFields?.["FDDTL.TRSF_AMT"]?.value;
  let termCd =
    fieldName === "TERM_CD"
      ? currField?.value
      : dependentFields?.["FDDTL.TERM_CD"]?.value;
  let intRate =
    fieldName === "INT_RATE"
      ? currField?.value
      : dependentFields?.["FDDTL.INT_RATE"]?.value;

  let principalAmt = Number(cashAmt) + Number(transAmt);

  if (
    currField?.value &&
    dependentFields?.["FDDTL.BRANCH_CD"]?.value &&
    dependentFields?.["FDDTL.ACCT_TYPE"]?.value &&
    dependentFields?.["FDDTL.ACCT_CD"]?.value
  ) {
    const { data, status, message } = await AuthSDK.internalFetcher(
      "GETFDMATURITYAMT",
      {
        COMP_CD: auth?.companyID ?? "",
        BRANCH_CD: dependentFields?.["FDDTL.BRANCH_CD"]?.value ?? "",
        ACCT_TYPE: dependentFields?.["FDDTL.ACCT_TYPE"]?.value ?? "",
        ACCT_CD: dependentFields?.["FDDTL.ACCT_CD"]?.value ?? "",
        CATEG_CD: dependentFields?.["FDDTL.CATEG_CD"]?.value ?? "",
        TRAN_DT: format(
          dependentFields?.["FDDTL.TRAN_DT"]?.value,
          "dd-MMM-yyyy"
        ),
        TRSF_AMT: transAmt,
        PERIOD_CD: dependentFields?.["FDDTL.PERIOD_CD"]?.value ?? "",
        PERIOD_NO: dependentFields?.["FDDTL.PERIOD_NO"]?.value ?? "",
        MATURITY_DT: dependentFields?.["FDDTL.MATURITY_DT"]?.value
          ? format(dependentFields?.["FDDTL.MATURITY_DT"]?.value, "dd-MMM-yyyy")
          : "",
        PRE_INT_FLAG: "N",
        PRINCIPAL_AMT: principalAmt,
        TERM_CD: termCd,
        INT_RATE: intRate,
      }
    );
    if (status === "0") {
      return {
        MATURITY_AMT: {
          value: data?.[0]?.MATURITY_AMT ?? "",
          ignoreUpdate: true,
        },
        MONTHLY_INT: {
          value: data?.[0]?.MONTHLY_INT ?? "",
          ignoreUpdate: true,
        },
      };
    } else {
      return {
        [fieldName]: {
          value: "",
          error: message ?? "",
          ignoreUpdate: true,
        },
        MATURITY_AMT: {
          value: "",
          ignoreUpdate: true,
        },
        MONTHLY_INT: {
          value: "",
          ignoreUpdate: true,
        },
      };
    }
  } else {
    return {};
  }
};

export const validateFDDepAmt = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEFDDEPAMT", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const checkLienAcct = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHECKLIEN", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validAndUpdateFDDtl = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEUPDATEFDDETAILS", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateFDDetails = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEFDDETAILS", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const saveFDDetails = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("SAVEFDDETAILS", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

//payment
export const checkAllowFDPay = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("CHECKALLOWFDPAY", { ...reqData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getPrematureRate = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPREMATRATE", { ...reqData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDPaymentDtl = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDPAYMENTDTL", { ...reqData });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validatePaymetEntry = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEFDPAYMENT", reqData);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

////////Old api
export const getFDAccountsDetail = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCUSTOMERFDACCOUNTS", { ...Apireq });
  // if (status === "0") {
  //   return data;
  // } else {
  return { data, status, message, messageDetails };
  // }
};

export const validateAccountAndGetDetail = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("VALIDATEACCOUNT", {
      BRANCH_CD: reqData?.BRANCH_CD ?? "",
      COMP_CD: reqData?.COMP_CD ?? "",
      ACCT_TYPE: reqData?.ACCT_TYPE ?? "",
      ACCT_CD: reqData?.ACCT_CD ?? "",
      SCREEN_REF: reqData?.SCREEN_REF ?? "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

// export const validateAccountAndGetDetail = async (
//   companyCode,
//   branchCode,
//   accountType,
//   accountCode,
//   screenReference
// ) => {
//   if (!Boolean(companyCode)) return { status: "-1" };
//   if (!Boolean(branchCode)) return { status: "-1" };
//   if (!Boolean(accountType)) return { status: "-1" };
//   if (!Boolean(accountCode)) return { status: "-1" };
//   if (!Boolean(screenReference)) return { status: "-1" };
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("VALIDATEACCOUNT", {
//       COMP_CD: companyCode,
//       BRANCH_CD: branchCode,
//       ACCT_TYPE: accountType,
//       ACCT_CD: accountCode,
//       SCREEN_REF: screenReference,
//     });
//   return { data, status, message, messageDetails };
// };

// export const valiateFDAccounts = async (Apireq) => {
//   const { data, status, message, messageDetails } =
//     await AuthSDK.internalFetcher("VALIDATEFDACCOUNTS", { ...Apireq });
//   if (status === "0") {
//     return data;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };

export const doFixDepositCreation = async (Apireq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOFDDEPOSIT", { ...Apireq });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDSchemeData = async (fdTranCode, categCode) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDSCHEMELIST", {
      FD_DOUBLE_TRAN_CD: fdTranCode,
      CATEG_CD: categCode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDOperationData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDOPERATION", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DISP_VAL, DATA_VAL, ...others }) => {
        return {
          ...others,
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFDOperationMode = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDOPERMODE", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(({ DISP_VAL, DATA_VAL, ...others }) => {
        return {
          ...others,
          value: DATA_VAL,
          label: DISP_VAL,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
