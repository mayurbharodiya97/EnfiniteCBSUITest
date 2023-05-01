import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getMerchantMasterGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETMERCHANTGRIDDATA", {});
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        TRN_USER: item.TRN_USER === "Y" ? true : false,
        VIEW_USER: item.VIEW_USER === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updMerchantMasterGridData = async ({ data, setServerError }) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "UPDMERCHMSTDATA",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
