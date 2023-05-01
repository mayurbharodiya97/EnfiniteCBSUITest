import { AuthSDK } from "registry/fns/auth";
import { ReleaseUserGridMetaData } from "./gridMetadata";
import { DefaultErrorObject } from "components/utils";
export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return ReleaseUserGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getReleaseUsersGridData = async ({ block_type, type }) => {
  if (!Boolean(block_type)) {
    throw DefaultErrorObject("Please Select Release Type.", "warning");
  } else if (!Boolean(type)) {
    throw DefaultErrorObject("Please Select Block Type.", "warning");
  } else {
    let APIURL = "BLOCKUSERS_AFTER";
    if (block_type === "BEFOR") {
      APIURL = "BLOCKUSERS_BEFORE";
    }
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        `${APIURL}`,
        {
          BLOCK_TYPE: block_type,
          TYPE: type,
          DISPLAY_LANGUAGE: "en",
          ACTION: "",
        },
        {
          UNIQUE_REQ_ID: "32627636893400",
          APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
        }
      );
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  }
  // let responseData = [
  //   {
  //     sr_no: 1,
  //     username: "raju123",
  //     cust_name: "Rubbyyet",
  //     block_date: "01/04/2022",
  //     reason: "OTP Pin",
  //   },
  //   {
  //     sr_no: 2,
  //     username: "test234",
  //     cust_name: "Test 123",
  //     block_date: "01/04/2022",
  //     reason: "OTP Pin",
  //   },
  // ];
  // let rows = { rows: responseData };
  // return responseData;
};
