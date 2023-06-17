import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getAccountInquiry = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETACCTVIEWMKR", {
  //     USERNAME: "parag",
  //     COMP_CD: "473 ",
  //     USER_ID: "parag",
  //     BRANCH_CD: "",
  //     ACCT_TYPE: "",
  //     ACCT_CD: "00003068            ",
  //   });
  // console.log("<<<getAccountInquiry", data, status);
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NAME: "VIJAY S SHARMA",
      ACCT_NO: "1234123412351234",
      CUST_ID: "123",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1678D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "4546564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
  ];
};
