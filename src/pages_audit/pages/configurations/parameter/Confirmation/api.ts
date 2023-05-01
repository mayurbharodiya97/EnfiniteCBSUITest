import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getParameterConfirmGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETPARACONFIRMGRID", {});
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const confirmParemeterReq = async ({
  confirmed,
  companyCode,
  paraCode,
}) => {
  if (!Boolean(confirmed)) {
    throw DefaultErrorObject(
      "Required value missing for confirmed.",
      "warning"
    );
  } else if (!Boolean(companyCode)) {
    throw DefaultErrorObject(
      "Required value missing for Company Code.",
      "warning"
    );
  } else if (!Boolean(paraCode)) {
    throw DefaultErrorObject(
      "Required value missing for Parameter Code.",
      "warning"
    );
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "PARAMSTCONFIRM",
      {
        CONFIRMED: confirmed,
        COMP_CD: companyCode,
        PARA_CD: paraCode,
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, "error", messageDetails);
    }
  }
};
