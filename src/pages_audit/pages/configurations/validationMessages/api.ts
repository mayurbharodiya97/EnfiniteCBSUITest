import { AuthSDK } from "registry/fns/auth";
import { ValidationMessagesGridMetaData } from "./gridMetadata";
import { DefaultErrorObject } from "components/utils";
// import unicodeConversion from "./unicodeCoversion";
export const getGridFormMetaData =
  ({ gridCode }) =>
  async () => {
    switch (gridCode) {
      case "CCC/001":
        return ValidationMessagesGridMetaData;
      default:
        /* eslint-disable no-throw-literal */
        throw { error_msg: "Invalid Product type" };
    }
  };

export const getValidationMessagesGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("MESSAGEVALIDATION", {
      DISPLAY_LANGUAGE: "en",
      ACTION: "",
    });
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
