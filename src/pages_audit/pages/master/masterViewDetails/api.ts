import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getpMiscData = async (category_cd) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(`GETPMISCDATA`, {
      CATEGORY_CD: category_cd,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData.map(({ DATA_VALUE, DISPLAY_NM }) => {
        return {
          value: DATA_VALUE,
          label: DISPLAY_NM,
        };
      });
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
