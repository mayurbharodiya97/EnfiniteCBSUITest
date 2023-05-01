import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getDateRetrievalReportData = async (reportID, filter) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(reportID, {
      FROM_DT: filter?.[0]?.value?.value ?? format(new Date(), "dd/MM/yyyy"),
      TO_DT: filter?.[1]?.value?.value ?? format(new Date(), "dd/MM/yyyy"),
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getDateUserNameRetrievalReportData = async (reportID, filter) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(reportID, {
      // FROM_DT: filter?.[0]?.value?.value ?? format(new Date(), "dd/MM/yyyy"),
      FROM_DT: "01/11/2022",
      TO_DT: filter?.[1]?.value?.value ?? format(new Date(), "dd/MM/yyyy"),
      // USER_NAME: filter?.[2]?.value?.value ?? format(new Date(), "dd/MM/yyyy"),
      USER_NAME: "TEST234",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
