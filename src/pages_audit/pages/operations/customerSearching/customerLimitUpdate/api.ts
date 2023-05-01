import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
export const getCustomerLimitDetails = async (UserName) => {
  if (!Boolean(UserName)) {
    throw DefaultErrorObject("Username is not valid");
  } else {
    let data = { CUSTOMER_ID: UserName, FLAG: "DETAIL" };
    let ResponseData = await AuthSDK.internalFetcher(
      "GETUSERTRNLIMITDTL",
      data
    );
    if (ResponseData.status === "0") {
      return ResponseData.data;
    } else {
      throw DefaultErrorObject(ResponseData?.message ?? "Error");
    }
  }
};

export const updateUserLimitAcceptReject = async ({ UserName, Confirmed }) => {
  if (!Boolean(UserName)) {
    throw DefaultErrorObject("Username is not valid");
  } else {
    let data = {
      CUSTOMER_ID: UserName,
      CONFIRMED: Confirmed,
      VERIFIED_MACHINE_NM: "test",
    };
    let ResponseData = await AuthSDK.internalFetcher(
      "USERLIMITACCEPTREJECTDATA",
      data
    );
    if (ResponseData.status === "0") {
      return ResponseData.message;
    } else {
      throw DefaultErrorObject(ResponseData?.message ?? "Error");
    }
  }
};

export const updateUserLimitData = async ({
  data,
  setServerError,
  setLocalLoding,
  isNewRow,
}) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DMLOPRATION_USERS_LIMIT_UPDATE",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
