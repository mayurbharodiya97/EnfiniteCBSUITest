import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getFDViewDtl = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFDVIEWDTL", reqData);
  if (status === "0") {
    // return data;

    const dataStatus = data;
    dataStatus.map((item) => {
      if (item?.LEAN_FLAG.trim() === "Y") {
        item._rowColor = "rgb(40 142 159 / 60%)";
      }
    });
    return dataStatus;
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

    console.log("responseData", responseData);

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
