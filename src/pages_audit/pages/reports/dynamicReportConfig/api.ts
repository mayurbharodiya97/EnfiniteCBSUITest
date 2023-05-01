import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getDynamicReportConfigGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "GETDYNRPTCONFIGGRIDDATA",
      {},
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const insertMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DYNAMICREPORTCONFIGINSERT",
    formData,
    {
      UNIQUE_REQ_ID: "32627636893400",
      APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynamicReportConfigData = async (transactionID: number) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "GETDYNRPTCONFIGDATA",
      {
        TRAN_CD: transactionID + "",
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const verifyDynRptSqlSyntax = async ({ sqlSyntax, detailsData }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "VERIFYDYNREPORTQUERY",
      { SQL_SYNTAX: sqlSyntax },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
