import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getChequeBookEntryData = async ({
  companyID,
  branchCD,
  acctType,
  accountNo,
}) => {
  if (!Boolean(branchCD)) {
    throw DefaultErrorObject(
      "Required value missing for Branch.",
      "",
      "warning"
    );
  } else if (!Boolean(acctType)) {
    throw DefaultErrorObject(
      "Required value missing for Account Type.",
      "",
      "warning"
    );
  } else if (!Boolean(accountNo)) {
    throw DefaultErrorObject(
      "Required value missing for Account Number.",
      "",
      "warning"
    );
  } else {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETCHEQUEBOOK", {
        COMP_CD: companyID,
        BRANCH_CD: branchCD,
        ACCT_TYPE: acctType,
        ACCT_CD: accountNo,
      });

    if (status === "0") {
      let responsedata = data;
      return responsedata;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
};

export const getChequeLeavesList88888 = async ({ NO_OF_CHEQUE }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCHQLEAVESLIST", { COMP_CD: "132 " });
  if (status === "0") {
    return [
      {
        // CHEQUE_FROM: "8080808",
        // CHEQUE_TO: "9090909",
        SERVICE_CHARGE: "757754",
        GST: "4564564 ",
        FROM_CHEQUE_NO: "8080808",
        TO_CHEQUE_NO: "9090909",
        NO_OF_CHEQUE: NO_OF_CHEQUE,
        // SERVICE_CHARGE: "757754",
        // GST: "4564564 ",
      },
    ];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getCustomerCardDetailThroughCB = async ({ clientID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERDTL360", {
      CUSTOMER_DTL_LIST: { CBNUMBER: clientID, APP_INDICATOR: "TRANZWARE" },
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const saveCustomerRegisterRequest = async ({ inputData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("INSCUSTREGREQ", {
      INPUT_DATA: inputData,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTRXList = async (...reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRXLIST", {
      USER_NAME: reqData?.[3]?.user.id ?? "",
    });
  if (status === "0") {
    let responseData = data;
    console.log(responseData, "responseData TRX");
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ CODE, DESCRIPTION }) => {
        return {
          value: CODE,
          label: CODE + "-" + DESCRIPTION,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getJointDetailsList = async (...reqData) => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETJOINTDETILSLIST", {
  //     USER_NAME: reqData?.[3]?.user.id ?? "",
  //   });
  // if (status === "0") {
  //   let responseData = data;
  //   console.log(responseData, "responseData GETJOINTDETILSLIST");
  //   if (Array.isArray(responseData)) {
  //     responseData = responseData.map(({ CODE, DESCRIPTION }) => {
  //       return {
  //         value: CODE,
  //         label: CODE + "-" + DESCRIPTION,
  //       };
  //     });
  //   }
  //   return responseData;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);

  // }

  return {
    data: [
      {
        id: 1,
        name: "abcd1",
        accNo: 12345,
        phone: 12345,
        ref: "abcd",
        type: "abcdd",
        designation: "qwerty",
        person: "subham",
      },
      {
        id: 2,
        name: "abcd2",
        accNo: 12345,
        phone: 12345,
        ref: "abcd",
        type: "abcdd",
        designation: "qwerty",
        person: "ankit",
      },
      {
        id: 3,
        name: "abcd3",
        accNo: 12345,
        phone: 12345,
        ref: "abcd",
        type: "abcdd",
        designation: "qwerty",
        person: "vishal",
      },
      {
        id: 4,
        name: "abcd4",
        accNo: 12345,
        phone: 12345,
        ref: "abcd",
        type: "abcdd",
        designation: "qwerty",
        person: "subham6",
      },
    ],
  };
};
