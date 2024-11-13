import { utilFunction } from "@acuteinfo/common-base";

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
