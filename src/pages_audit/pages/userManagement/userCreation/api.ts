import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";

export const getUserCreationGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "GETADMINUSERGRID",
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
        ALLOW_RELEASE: item.ALLOW_RELEASE === "Y" ? true : false,
        ACTIVE_FLAG: item.ACTIVE_FLAG === "Y" ? true : false,
        INACTIVE_DATE: Boolean(item?.INACTIVE_DATE)
          ? format(new Date(item?.INACTIVE_DATE), "dd/MM/yyyy HH:mm:ss")
          : "",
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
