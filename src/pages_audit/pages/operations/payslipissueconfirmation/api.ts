import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getPayslipCnfRetrieveData = async (reqdata) => {

  const { data, status, message, messageDetails } = await AuthSDK.internalFetcher(
      "GETPAYSLIPCNFRETRIVEGRID",
      reqdata
    );
   
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(
        ({ ...items }) => {
          return {
            ...items,

            CONFIRMED: items.CONFIRMED === "Y" ? "Confirmed" : "Pending"

          };

        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
  };