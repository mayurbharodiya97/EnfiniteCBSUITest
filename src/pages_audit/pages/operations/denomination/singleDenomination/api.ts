import { DefaultErrorObject } from "@acuteinfo/common-base";
import { AuthSDK } from "registry/fns/auth";

export const getTabsByParentType = async (reqObj: reqObjTypes) => {
  const { reqData, controllerFinal } = reqObj;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "GETDLYTRNTABFIELDDISP",
      {
        // PARENT_TYPE: reqData?.PARENT_TYPE,
        COMP_CD: reqData?.COMP_CD,
        ACCT_TYPE: reqData?.ACCT_TYPE,
        BRANCH_CD: reqData?.BRANCH_CD,
      },
      {},
      null,
      controllerFinal
    ); // Pass signal as an option

  if (status === "0") {
    data?.map((a, i) => {
      a.index1 = i;
    });

    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

interface reqObjTypes {
  reqData: any;
  controllerFinal?: any;
}

export const getCarousalCards = async (reqObj: reqObjTypes) => {
  const { reqData, controllerFinal } = reqObj;
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher(
      "DAILYTRNCARDDTL",
      {
        PARENT_TYPE: reqData?.PARENT_TYPE,
        COMP_CD: reqData?.COMP_CD,
        ACCT_TYPE: reqData?.ACCT_TYPE,
        ACCT_CD: reqData?.ACCT_CD,
        BRANCH_CD: reqData?.BRANCH_CD,
      },
      {},
      null,
      controllerFinal
    );
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const CashReceiptEntrysData = async ({
  COMP_CD,
  BRANCH_CD,
  USER_NAME,
  TRAN_DT,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCASHDENO", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      USER_NAME: USER_NAME,
      TRAN_DT: TRAN_DT,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getReleaseGridData = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCASHRELEASEMCTDTL", {
      COMP_CD: COMP_CD ?? "",
      BRANCH_CD: BRANCH_CD ?? "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getReleaseSubGridData = async ({
  ENTERED_COMP_CD,
  ENTERED_BRANCH_CD,
  MCT_TRAN_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETCASHRELEASEMCTSUBDTL", {
      ENTERED_COMP_CD: ENTERED_COMP_CD ?? "",
      ENTERED_BRANCH_CD: ENTERED_BRANCH_CD ?? "",
      MCT_TRAN_CD: MCT_TRAN_CD ?? "",
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const releaseRecords = async (req) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("DELETECASHTRNDTL", {
      ...req,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
