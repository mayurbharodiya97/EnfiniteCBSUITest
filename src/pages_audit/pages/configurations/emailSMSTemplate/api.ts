import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getEmailSMSTemplateGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEMAILSMSTEMPLATEGRID", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateEngLocalMsgGridData = async ({
  msgID,
  msgTextEn,
  msgTextBn,
}) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "MESSAGEVALIDATIONUPDATE",
    {
      MSG_ID: msgID,
      MSG_TEXT: msgTextEn,
      MSG_TEXT_BN: msgTextBn,
      DISPLAY_LANGUAGE: "en",
      ACTION: "",
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
