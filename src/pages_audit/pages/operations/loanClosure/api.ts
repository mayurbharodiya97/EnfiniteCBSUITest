import { LoanClosureReqGridMetaData } from "./gridMetadata";
import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return LoanClosureReqGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getLoanClosureReqGridData = async ({ fromDate, toDate }) => {
  // let responseData = [
  //   {
  //     ref_no: "5465645",
  //     user_name: "TEST234",
  //     applicant_nm: "ABCDEFGH",
  //     req_dt: "29/04/2022",
  //     td_acct: "56464646654646",
  //     loan_amt: "100000",
  //     emi_amt: "10000",
  //     status: "Pending",
  //     lock_by: "",
  //     TRAN_CD: "1",
  //   },
  // ];
  // let rows = { rows: responseData };
  // return responseData;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETLOANCLSCONFREQ", {
      FROM_DATE: fromDate,
      TO_DATE: toDate,
      DISPLAY_LANGUAGE: "en",
      ACTION: "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
