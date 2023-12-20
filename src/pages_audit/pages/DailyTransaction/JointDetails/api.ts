import {
  AddIDinResponseData,
  DefaultErrorObject,
  utilFunction,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

// export const getJointDetailsList = async (...reqData) => {
//   return {
//     data: [
//       {
//         id: 1,
//         name: "abcd1",
//         accNo: 12345,
//         phone: 12345,
//         ref: "abcd",
//         type: "abcdd",
//         designation: "qwerty",
//         person: "subham",
//       },
//       {
//         id: 2,
//         name: "abcd2",
//         accNo: 12345,
//         phone: 12345,
//         ref: "abcd",
//         type: "abcdd",
//         designation: "qwerty",
//         person: "ankit",
//       },
//       {
//         id: 3,
//         name: "abcd3",
//         accNo: 12345,
//         phone: 12345,
//         ref: "abcd",
//         type: "abcdd",
//         designation: "qwerty",
//         person: "vishal",
//       },
//       {
//         id: 4,
//         name: "abcd4",
//         accNo: 12345,
//         phone: 12345,
//         ref: "abcd",
//         type: "abcdd",
//         designation: "qwerty",
//         person: "subham6",
//       },
//     ],
//   };
// };

export const getJointDetailsList = async (reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETJOINTACCTDTL", {
      COMP_CD: reqData.COMP_CD,
      ACCT_TYPE: reqData.ACCT_TYPE,
      ACCT_CD: reqData.ACCT_CD,
    });
  if (status === "0") {
    let responseData = data;

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const sendJointData = async (...reqData) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETJOINTDETILSLIST", {
      USER_NAME: reqData?.[3]?.user.id ?? "",
    });
  if (status === "0") {
    let responseData = data;
    console.log(responseData, "responseData GETJOINTDETILSLIST");

    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getJointDataById = async (...reqData) => {
  return { ref: "123", date: new Date(), name: "subham", phone: 12345 };
};
