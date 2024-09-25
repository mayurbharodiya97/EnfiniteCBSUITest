import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "@acuteinfo/common-base";
import { format } from "date-fns";

// import { DefaultErrorObject } from "@acuteinfo/common-base";

export const BranchSelectionGridData = async () => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("BRANCHLIST", {});
  if (status === "0") {
    const dataStatus = data;
    dataStatus.map((item) => {
      if (item?.STATUS === "C") {
        item._rowColor = "rgba(255, 79, 121, 0.1)";
      }
    });
    return dataStatus;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const GetMenuData = async ({
  BASE_COMP_CD,
  BASE_BRANCH_CD,
  COMP_CD,
  BRANCH_CD,
  GROUP_NAME,
  APP_TRAN_CD,
  COMP_NM,
  BRANCH_NM,
  DAYEND_STATUS,
  EOD_RUNNING_STATUS,
  IS_UPD_DEF_BRANCH,
  COMP_BASE_BRANCH_CD,
  selectionMode,
}) => {
  // await AuthSDK.Getfingerprintdata();
  // AuthSDK.loginUserDetails(fulldata);
  // AuthSDK.setToken(fulldata.access_token);
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("MENULIST", {
      COMP_CD: COMP_CD,
      BASE_BRANCH_CD: BASE_BRANCH_CD,
      ASON_DT: format(new Date(), "dd/MMM/yyyy"),
      GROUP_NAME: GROUP_NAME,
      IMG_PATH: "",
      FLAG: "ALL_SCREENS",
      APP_TRAN_CD: APP_TRAN_CD,
      BASE_COMP_CD: BASE_COMP_CD,
      COMP_BASE_BRANCH_CD: COMP_BASE_BRANCH_CD,
      COMP_NM: COMP_NM,
      BRANCH_NM: BRANCH_NM,
      DAYEND_STATUS: DAYEND_STATUS,
      EOD_RUNNING_STATUS: EOD_RUNNING_STATUS,
      IS_UPD_DEF_BRANCH: IS_UPD_DEF_BRANCH,
      BRANCH_CD: BRANCH_CD,
      BRANCH_SELECTION_MODE: selectionMode,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
