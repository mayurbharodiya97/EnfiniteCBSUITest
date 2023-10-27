import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const saveChequebookData = async ({ otherAPIRequestPara2 }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOCHEQUEBKISSUE", {
      ...otherAPIRequestPara2,
      // TRAN_CD: "1",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
