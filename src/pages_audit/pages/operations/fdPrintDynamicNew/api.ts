import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getFdPrintTempDdw = async () => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETPMISCDATA", {
        CATEGORY_CD: "FD_PRINT",
      });
    if (status === "0") {
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(({ DATA_VALUE, DISPLAY_NM, ...rest }) => {
          return { ...rest, value: DATA_VALUE, label: DISPLAY_NM };
        });
      }
      return responseData;
      
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  export const retrieveFdPrintData = async (apiReqPara) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher("GETFDPRINTDATA", {
        ...apiReqPara,
      });
    if (status === "0") {
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };