import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getActionTakenMasterGridData = async ({
  companyID,
  branchCode,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETACTIONTAKENMSTDATADISP", {
      COMP_CD: companyID,
      BRANCH_CD: branchCode,
    });
  if (status === "0") {
    return data?.map((item) => {
      return {
        ...item,
        LEGAL_PROCESS: item?.LEGAL_PROCESS === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getSuitFldStdMstData = async (...reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETSUITFLDMSTDATADISP", {
      COMP_CD: reqdata?.[3]?.companyID,
      BRANCH_CD: reqdata?.[3]?.user?.branchCode,
    });
  if (status === "0") {
    let responseData = data;
    if (Array.isArray(responseData)) {
      responseData = responseData?.map(
        ({ DISPLAY_NM, SUIT_FILED_STATUS_CD, ...others }) => {
          return {
            ...others,
            value: SUIT_FILED_STATUS_CD,
            label: DISPLAY_NM,
          };
        }
      );
    }
    return responseData;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const updateActionTakenMasterData = async ({ data: reqdata }) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOACTIONTAKENDML",
    {
      ...reqdata,
    }
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const deleteActionTakenMasterData = async (data) => {
  const { status, message } = await AuthSDK.internalFetcher(
    "DOACTIONTAKENDML",
    data
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message);
  }
};
