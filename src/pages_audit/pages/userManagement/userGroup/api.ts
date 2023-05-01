import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";

export const getUserGroupGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "GETUSERGROUPGRIDDATA",
      {},
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const updUsrGrpData = async ({ data: formData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("UPDSECURITYGROUPING", formData);
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
