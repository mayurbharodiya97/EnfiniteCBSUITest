import { utilFunction } from "@acuteinfo/common-base";

/**
 * This function is used for dynamic screen ref for menu list API.
 * @param path Screen's main url (useLocation().pathname)
 * @param data Pass authState?.menulistdata
 * @returns Screen ref of perticular screen
 */
export const getdocCD = (path: string, data: any) => {
  const relativePath = path.replace("/cbsenfinity/", "");
  let cleanedPath;

  if (relativePath.includes("/")) {
    cleanedPath = relativePath.split("/").slice(0, 2).join("/");
  } else {
    cleanedPath = relativePath;
  }
  let screenList = utilFunction?.GetAllChieldMenuData(data, true);
  const matchingPath = screenList.find((item) => item.href === cleanedPath);

  if (matchingPath) {
    return `${matchingPath.user_code.trim()}`;
  }
  return "";
};

/**
 * This function is used to validate the branch code when selecting the HO branch from another branch.
 * @param currentField pass currentField
 * @param messageBox pass formState?.MessageBox
 * @param authState pass authState
 * @returns Boolean value
 */
export const validateHOBranch = async (currentField, messageBox, authState) => {
  if (
    authState?.user?.baseBranchCode === currentField?.value &&
    authState?.user?.baseBranchCode !== authState?.user?.branchCode
  ) {
    const buttonName = await messageBox({
      messageTitle: "HOBranchValidMessageTitle",
      message: "HOBranchValidMessage",
      buttonNames: ["Ok"],
      icon: "ERROR",
    });
    if (buttonName === "Ok") {
      return true;
    }
    return false;
  }
  return false;
};
