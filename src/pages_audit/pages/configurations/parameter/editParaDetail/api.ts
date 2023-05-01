//import { LOSSDK } from "registry/fns/functions";
import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getParaDetailFormData = async (tranCD) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("LOANAPPROVALPROCESS_AUTH", {
      TRAN_CD: tranCD,
      FLAG: "AUTH",
      DISPLAY_LANGUAGE: "en",
      ACTION: "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateParameterMasterData = async ({
  compCode,
  paraCode,
  dataTypeCode,
  paraValue,
}) => {
  if (!Boolean(compCode)) {
    throw DefaultErrorObject(
      "Required value missing for Company Code.",
      "warning"
    );
  } else if (!Boolean(paraCode)) {
    throw DefaultErrorObject(
      "Required value missing for Parameter Code.",
      "warning"
    );
  } else if (!Boolean(dataTypeCode)) {
    throw DefaultErrorObject(
      "Required value missing for Data type.",
      "warning"
    );
  } else if (!Boolean(paraValue)) {
    throw DefaultErrorObject(
      "Required value missing for Parameter Value.",
      "warning"
    );
  } else {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "UPDATEPARAMST",
      {
        DATATYPE_CD: dataTypeCode,
        PARA_VALUE: paraValue,
        COMP_CD: compCode,
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
