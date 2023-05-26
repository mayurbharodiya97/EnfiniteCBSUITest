import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";

// import { DefaultErrorObject } from "components/utils";

export const BranchSelectionGridData = async ({ userID }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("BRANCHLIST", {
      USER_NAME: userID, /////////////
    });
  const dataStatus = data;
  if (status === "0") {
    dataStatus.map((item) => {
      if (item?.STATUS === "Closed") {
        item._rowColor = "rgba(255, 79, 121, 0.1)";
      }
    });
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
  return [
    {
      BASE_COMP_CD: "473 ",
      COMP_CD: "473 ",
      DAYEND_STATUS: "B",
      EOD_RUNNING_STATUS: "H",
      BASE_BRANCH_CD: "0002",
      COMP_BASE_BRANCH_CD: "0002",
      DISP_NM: "0002 MAIN BRANCH",
      DISPLAY_NAME: "MAIN BRANCH",
      STATUS: "Open",
      BRANCH_CD: "0002",
      END_DATETIME: "",
      BRANCH_NM: "MAIN BRANCH",
      COMP_NM: "THE RAJKOT COMMERCIAL CO-OPERATIVE BANK LTD",
      SERVICE_TYPE: "B",
      BEGIN_DATETIME: "2023-02-08 00:01:53.0",
    },
    {
      BASE_COMP_CD: "473 ",
      COMP_CD: "473 ",
      DAYEND_STATUS: "E",
      EOD_RUNNING_STATUS: "N",
      BASE_BRANCH_CD: "0002",
      COMP_BASE_BRANCH_CD: "0002",
      DISP_NM: "0003 RAIYA ROAD ",
      DISPLAY_NAME: "RAIYA ROAD ",
      STATUS: "Closed",
      BRANCH_CD: "0003",
      END_DATETIME: "2023-02-08 18:58:18.0",
      BRANCH_NM: "RAIYA ROAD ",
      COMP_NM: "THE RAJKOT COMMERCIAL CO-OPERATIVE BANK LTD",
      SERVICE_TYPE: "B",
      BEGIN_DATETIME: "2023-02-08 00:01:53.0",
      _rowColor: "rgba(255, 79, 121, 0.1)",
    },
    {
      BASE_COMP_CD: "473 ",
      COMP_CD: "473 ",
      DAYEND_STATUS: "E",
      EOD_RUNNING_STATUS: "N",
      BASE_BRANCH_CD: "0002",
      COMP_BASE_BRANCH_CD: "0002",
      DISP_NM: "0005 VANIAWADI",
      DISPLAY_NAME: "VANIAWADI",
      STATUS: "Open",
      BRANCH_CD: "0005",
      END_DATETIME: "2023-02-08 18:51:46.0",
      BRANCH_NM: "VANIAWADI",
      COMP_NM: "THE RAJKOT COMMERCIAL CO-OPERATIVE BANK LTD",
      SERVICE_TYPE: "B",
      BEGIN_DATETIME: "2023-02-08 00:01:53.0",
    },
    {
      BASE_COMP_CD: "473 ",
      COMP_CD: "473 ",
      DAYEND_STATUS: "E",
      EOD_RUNNING_STATUS: "N",
      BASE_BRANCH_CD: "0002",
      COMP_BASE_BRANCH_CD: "0002",
      DISP_NM: "0006 MAVDI ROAD",
      DISPLAY_NAME: "MAVDI ROAD",
      STATUS: "Open",
      BRANCH_CD: "0006",
      END_DATETIME: "2023-02-08 19:27:55.0",
      BRANCH_NM: "MAVDI ROAD",
      COMP_NM: "THE RAJKOT COMMERCIAL CO-OPERATIVE BANK LTD",
      SERVICE_TYPE: "B",
      BEGIN_DATETIME: "2023-02-08 00:01:53.0",
    },
    {
      BASE_COMP_CD: "473 ",
      COMP_CD: "473 ",
      DAYEND_STATUS: "E",
      EOD_RUNNING_STATUS: "N",
      BASE_BRANCH_CD: "0002",
      COMP_BASE_BRANCH_CD: "0002",
      DISP_NM: "0007 BEDI YARD",
      DISPLAY_NAME: "BEDI YARD",
      STATUS: "Closed",
      BRANCH_CD: "0007",
      END_DATETIME: "2023-02-08 18:18:16.0",
      BRANCH_NM: "BEDI YARD",
      COMP_NM: "THE RAJKOT COMMERCIAL CO-OPERATIVE BANK LTD",
      SERVICE_TYPE: "B",
      _rowColor: "rgba(255, 79, 121, 0.1)",
      BEGIN_DATETIME: "2023-02-08 00:01:53.0",
    },
  ];
};

export const GetMenuData = async ({
  userID,
  COMP_CD,
  BRANCH_CD,
  GROUP_NAME,
  fulldata,
}) => {
  await AuthSDK.Getfingerprintdata();
  AuthSDK.loginUserDetails(fulldata);
  AuthSDK.setToken(fulldata.access_token);
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("MENULIST", {
      USER_NM: userID,
      MACHINE_IP: "",
      COMP_CD: COMP_CD,
      BASE_BRANCH_CD: BRANCH_CD,
      BRANCH_CD: BRANCH_CD,
      ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
      GROUP_NAME: GROUP_NAME,
      IMG_PATH: "",
      FLAG: "ALL_SCREENS",
      APP_TRAN_CD: "1",
    });
  return {
    status: "0",
    data: [
      {
        isRouterLink: "true",
        icon: "grip-horizontal",
        label: "Dashboard",
        href: "dashboard",
      },
      {
        isRouterLink: "true",
        icon: "file-lines",
        label: "All Screens",
        href: "all-screens",
      },
    ],
    message: "",
    messageDetails: "",
  };
};
