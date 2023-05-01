import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getDynamicBoxData = async (apiName) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`/adminPanelCommonServiceAPI/${apiName}`, {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTrafficChartData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRAFFICCHARTDASH", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getTransactionChartData = async (type) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTRANCHARTDATADASH", {
      TYPE: type,
      ASON_DATE: format(new Date(), "dd-MMM-yyyy"),
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
