import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getBranchMasterGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETBRANCHMSTGRIDDATA", {});
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        ACTIVE_STATUS: item?.ACTIVE === "Y" ? "Yes" : "No",
        ACTIVE: item?.ACTIVE === "Y" ? true : false,
        CHQ_BOOK_ENABLED: item?.CHQ_BOOK_ENABLED === "Y" ? true : false,
        DPS_ENABLED: item?.DPS_ENABLED === "Y" ? true : false,
        FD_ENABLED: item?.FD_ENABLED === "Y" ? true : false,
        PAY_ORDER_ENABLED: item?.PAY_ORDER_ENABLED === "Y" ? true : false,
      };
    });
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
