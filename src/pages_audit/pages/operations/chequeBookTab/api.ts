import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const saveChequebookData = async ({ otherAPIRequestPara }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DOCHEQUEBKISSUE", {
      ...otherAPIRequestPara,
      TRAN_CD: "1",
    });
  if (status === "0") {
    console.log("<<<datasave", data);
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
