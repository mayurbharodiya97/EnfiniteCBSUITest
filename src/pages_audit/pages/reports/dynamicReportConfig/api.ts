import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
// import unicodeConversion from "./unicodeCoversion";

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
    "",
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
export const getMastersFormData = async (transactionID: number) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      `/adminPanelCommonServiceAPI/GETCHARGETEMPLATEMST`,
      {
        TRAN_CD: transactionID + "",
      },
      {
        UNIQUE_REQ_ID: "32627636893400",
        APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
      }
    );
  if (status === "0") {
    return data[0];
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getMastersGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      `GETSCHEMEMASTERGRIDDATA`,
      {
        COMP_CD: "001 ",
        BRANCH_CD: "001 ",
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

export const updateMastersData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DMLOPRATION_SERVICE_CHARGE_OPERATION",
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

export const deleteBytransactionID = (data) => async () => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DMLOPRATION_SERVICE_CHARGE_OPERATION" /*`/adminPanelCommonServiceAPI/UPDCHARGETEMPLATEMST`*/,
    data,
    {
      UNIQUE_REQ_ID: "32627636893400",
      APITOKEN: "MzI2Mjc2MzY4OTM0MDA=",
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
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
    throw DefaultErrorObject(messageDetails, "");
  }
};
