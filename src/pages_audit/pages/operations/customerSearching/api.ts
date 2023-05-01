import {
  CheckObjectAllKeyisEmpty,
  groupBy,
  DefaultErrorObject,
  utilFunction,
  AddIDinResponseData,
} from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getCustomerListSearching = async ({ data }) => {
  if (CheckObjectAllKeyisEmpty(data)) {
    throw DefaultErrorObject(
      "Please enter at least one detail to get details.",
      "",
      "warning"
    );
  } else {
    let ResponseData = await AuthSDK.internalFetcher("CUSTOMERSERCH", data);
    if (ResponseData.status === "0") {
      if (ResponseData.data === 0) {
        return ResponseData.data;
      }
      let returnData = groupBy(ResponseData.data, "USER_NAME");
      let allObject = Object.keys(returnData);
      let result = allObject.map((item) => {
        let rowData = returnData[item][0];
        return {
          ...rowData,
          DETAILS_DATA: returnData[item],
        };
      });
      return result;
    } else {
      throw DefaultErrorObject(
        ResponseData?.message ?? "Error",
        ResponseData?.messageDetails ?? ""
      );
    }
  }
};

export const updateRestrictUnlockUserData = async ({
  userName,
  restrictUnlockStatus,
  remarks,
}) => {
  if (!Boolean(userName)) {
    throw DefaultErrorObject(
      "Required value missing for User Name.",
      "warning"
    );
  } else if (!Boolean(restrictUnlockStatus)) {
    throw DefaultErrorObject(
      "Required value missing for restrict unlock Status.",
      "warning"
    );
  } else if (!Boolean(remarks)) {
    throw DefaultErrorObject("Required value missing for Remarks.", "warning");
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "RESTUNLOCKUSER",
      {
        USERNAME: userName,
        STATUS: restrictUnlockStatus,
        REMARKS: remarks,
        MACHINE_NM: "test",
        DISPLAY_LANGUAGE: "en",
        ACTION: "",
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};

export const updatePasswordResetData = async ({ userName }) => {
  if (!Boolean(userName)) {
    throw DefaultErrorObject(
      "Required value missing for User Name.",
      "warning"
    );
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "PASSWORDRESET",
      {
        CUSTOMER_ID: userName,
        MACHINE_NM: "test",
        DISPLAY_LANGUAGE: "en",
        ACTION: "",
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};

export const getRefreshDataDetail = async (userName) => {
  if (!Boolean(userName)) {
    throw DefaultErrorObject(
      "Required value missing for Customer ID.",
      "warning"
    );
  } else {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETUSERDTLFROM360", {
        CUSTOMER_ID: userName,
        COMP_CD: "001 ",
        DISPLAY_LANGUAGE: "en",
        ACTION: "",
      });
    if (status === "0") {
      let responsedata = data;
      if (Array.isArray(responsedata)) {
        responsedata = AddIDinResponseData(responsedata);
        let repdat = { gender: { F: "Female", M: "Male" } };
        responsedata = utilFunction.ChangeJsonValue(responsedata, repdat);
        responsedata = responsedata;
      }
      return responsedata;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};

export const updateCustomerRefreshData = async ({
  customerID,
  userName,
  inputData,
}) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "UPDATECUSTREFRESHDATA",
    {
      A_CUSTOMER_ID: customerID,
      A_USER_NM: userName,
      A_INPUT: { RESPONSE: inputData },
    }
  );
  if (status === "0") {
    return "Customer data update successfully.";
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
