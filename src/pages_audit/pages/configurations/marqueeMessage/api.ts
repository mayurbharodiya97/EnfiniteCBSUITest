import { noAuto } from "@fortawesome/fontawesome-svg-core";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getMarqueeMessagegridData = async (compCode) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETMARQUEEMESSAGEGRID", {
      COMP_CD: compCode,
    });
  if (status === "0") {
    return data.map((item) => {
      return {
        ...item,
        CHANNEL_DISP:
          item.CHANNEL === "I" ? "Internet Banking" : "Mobile Banking",
        STATUS: item.STATUS === "Y" ? true : false,
        // INACTIVE_DATE: Boolean(item?.INACTIVE_DATE)
        // ? format(new Date(item?.INACTIVE_DATE), "dd/MM/yyyy HH:mm:ss")
        // : "",
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateUserMarqueeMessage = async ({ data: reqdata }) => {
  console.log(">>reqdata", reqdata);
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("USERMARQEEMSGDML", {
      ...reqdata,
      ALERT_TYPE: "E",
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteMarqueeMessage = (data) => async () => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "USERMARQEEMSGDML",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};
