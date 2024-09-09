import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getAccCodeValidation = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANSCHEDULEACCOUNTDATA", {
      BRANCH_CD: reqData?.BRANCH_CD,
      COMP_CD: reqData?.COMP_CD,
      ACCT_TYPE: reqData?.ACCT_TYPE,
      ACCT_CD: reqData?.ACCT_CD,
      SCREEN_REF: reqData?.SCREEN_REF,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getLoanScheduleHeaderData = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  GD_DATE,
  ENT_COMP_CD,
  ENT_BRANCH_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANSCHEDULEHDR", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      GD_DATE: GD_DATE,
      ENT_COMP_CD: ENT_COMP_CD,
      ENT_BRANCH_CD: ENT_BRANCH_CD,
    });
  if (status === "0") {
    const dataStatus = data;
    dataStatus.map((item) => {
      if (item?.ACTIVE.trim() === "I") {
        item._rowColor = "rgb(164,164,164)";
      } else if (item?.RESCHEDULED.trim() === "Y") {
        item._rowColor = "rgb(152,251,152)";
      }
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLoanScheduleDetails = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  TRAN_CD,
  GD_DATE,
  USER_LEVEL,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANSCHEDULEDTL", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      TRAN_CD: TRAN_CD,
      GD_DATE: GD_DATE,
      USER_LEVEL: USER_LEVEL,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map((item) => {
        if (item?.ALLOW_EDIT === "N") {
          return {
            ...item,
            _isReadOnly: true,
          };
        } else {
          return item;
        }
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLoanRegenerateDetails = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANSCHEDULEACCTDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const validateRegenerateData = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOVALIDATEREGENRATELOAN", {
      ...ApiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const regenerateDataConfirmation = async (ApiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOREGENRATELAONSCHEDULE", {
      ...ApiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLoanInterestAmount = async ({
  INSTALLMENT_TYPE,
  TYPE_CD,
  INST_NO,
  INT_RATE,
  LIMIT_AMOUNT,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANINSTRS", {
      INSTALLMENT_TYPE: INSTALLMENT_TYPE,
      TYPE_CD: TYPE_CD,
      INST_NO: INST_NO,
      INT_RATE: INT_RATE,
      LIMIT_AMOUNT: LIMIT_AMOUNT,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDueDate = async ({
  INSTALLMENT_TYPE,
  INST_START_DATE,
  INST_NO,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANSCHEDULEDUEDATE", {
      INSTALLMENT_TYPE: INSTALLMENT_TYPE,
      INST_START_DATE: INST_START_DATE,
      INST_NO: INST_NO,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRescheduleDropDown = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANRESCHEDULEWITHDDW", {});
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DATA_VALUE, DISPLAY_VALUE }) => {
        return {
          value: DATA_VALUE,
          label: DISPLAY_VALUE,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRescheduleHeaderData = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  ASON_DT,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANRESCHEDULEHDR", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      ASON_DT: ASON_DT,
    });
  if (status === "0") {
    return data?.map((item) => {
      return {
        ...item,
        EMI_AMT_CHANGE: item?.EMI_AMT_CHANGE === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getFinalInstallment = async ({
  REMAINING_INST_NO,
  INST_NO,
  ORG_INST_NO,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANRESCHEDULEFINALINSTNO", {
      REMAINING_INST_NO: REMAINING_INST_NO,
      INST_NO: INST_NO,
      ORG_INST_NO: ORG_INST_NO,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getRescheduleLoanInterestAmount = async ({
  IDEAL_ACTUAL,
  IDEAL_BALANCE,
  OUTSTANDING_BAL,
  OUT_SUBSIDY,
  TYPE_CD,
  FINAL_INST_NO,
  INT_RATE,
  INSTALLMENT_TYPE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANRESCHEDULEINSTRS", {
      IDEAL_ACTUAL: IDEAL_ACTUAL,
      IDEAL_BALANCE: IDEAL_BALANCE,
      OUTSTANDING_BAL: OUTSTANDING_BAL,
      OUT_SUBSIDY: OUT_SUBSIDY,
      TYPE_CD: TYPE_CD,
      FINAL_INST_NO: FINAL_INST_NO,
      INT_RATE: INT_RATE,
      INSTALLMENT_TYPE: INSTALLMENT_TYPE,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getNoOfInstallment = async ({
  INST_RS,
  OUTSTANDING_BAL,
  INT_RATE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANRESCHEDULEINSTNOFROMINSTAMT", {
      INST_RS: INST_RS,
      OUTSTANDING_BAL: OUTSTANDING_BAL,
      INT_RATE: INT_RATE,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLoanRescheduleGridData = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  ACTIVE,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANDISBURSEDTLHIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      ACTIVE: ACTIVE,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getLoanRescheduleDetails = async ({
  COMP_CD,
  BRANCH_CD,
  ACCT_TYPE,
  ACCT_CD,
  REF_TRAN_CD,
  TRAN_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANSCHEDULEHIST", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      ACCT_TYPE: ACCT_TYPE,
      ACCT_CD: ACCT_CD,
      REF_TRAN_CD: REF_TRAN_CD,
      TRAN_CD: TRAN_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const proceedData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOLOANRESCHEDULE", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteProceedData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DODELETELOANDISBURSEDATA", {
      ...apiReq,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};

export const saveProceedData = async (apiReq) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOSAVELOANRECHEDULE", {
      ...apiReq,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
