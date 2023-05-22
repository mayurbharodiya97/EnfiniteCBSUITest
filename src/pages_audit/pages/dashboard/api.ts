import { DefaultErrorObject } from "components/utils";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";

export const getDashboardData = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETDASHBOARDDATA", {});
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
};
// export const getDashboardDatas = () => {};

export const QuickAccessTableGridData = async ({
  userID,
  COMP_CD,
  BRANCH_CD,
  BASE_BRANCH_CD,
  GROUP_NAME,
  APP_TRAN_CD,
}) => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("RECENT_FAVORITE", {
  //     USER_NM: userID,
  //     MACHINE_IP: "",
  //     COMP_CD: COMP_CD,
  //     BASE_BRANCH_CD: BASE_BRANCH_CD,
  //     BRANCH_CD: BRANCH_CD,
  //     ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
  //     GROUP_NAME: GROUP_NAME,
  //     IMG_PATH: "",
  //     FLAG: "ALL_SCREENS",
  //     APP_TRAN_CD: APP_TRAN_CD,
  //   });
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      DOC_NM: "A/c Opening Register Normal",
      HREF: "",
      DOC_DESCRIPTION: "M_NORMAL13",
      FLAG: "N",
      WINDOW_NAME:
        "w_balance_register                                                                                  ",
      DOC_CRDR: "3",
      DOC_TYPE: "R   ",
      FAVOURITE: "N",
      DESCRIPTION: "Other Report",
      SEQ_NO: "13",
      EXP_FLAG: "N",
      DOC_TITLE: "A/c Opening Register Normal",
      USER_DEFINED_DOC_TYPE: "R   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/111",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "RPT/111     ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "Y",
      IMG_PATH: "",
      WINDOW_PARM_NM: "OPEN_REGISTER",
      FULL_DOC_NM: "RPT/111 A/c Opening Register Normal RPT/111",
    },
    {
      DOC_NM: "Exception Report",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_report_base2                                                                                      ",
      DOC_CRDR: "3",
      DOC_TYPE: "R   ",
      FAVOURITE: "N",
      DESCRIPTION: "Other Report",
      SEQ_NO: "13",
      EXP_FLAG: "N",
      DOC_TITLE: "Exception Report",
      USER_DEFINED_DOC_TYPE: "R   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/1271",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "RPT/1271    ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "EXCEPTION_REPORT",
      FULL_DOC_NM: "RPT/1271 Exception Report RPT/1271",
    },
    {
      DOC_NM: "Day Book Format2",
      HREF: "",
      DOC_DESCRIPTION: "M_FORMAT28",
      FLAG: "N",
      WINDOW_NAME:
        "w_balance_register                                                                                  ",
      DOC_CRDR: "3",
      DOC_TYPE: "E   ",
      FAVOURITE: "N",
      DESCRIPTION: "Daily Reports & A/c Statement",
      SEQ_NO: "9",
      EXP_FLAG: "N",
      DOC_TITLE: "Day Book Format2",
      USER_DEFINED_DOC_TYPE: "E   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/912",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "RPT/912     ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "DAYBOOK_FORMAT2_FOR_SEVA",
      FULL_DOC_NM: "RPT/912 Day Book Format2 RPT/912",
    },
    {
      DOC_NM: "Advances Stock Entry",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_adv_stock_entry                                                                                   ",
      DOC_CRDR: "3",
      DOC_TYPE: "T   ",
      FAVOURITE: "N",
      DESCRIPTION: "Transaction Entry",
      SEQ_NO: "3",
      EXP_FLAG: "N",
      DOC_TITLE: "Advances Stock Entry",
      USER_DEFINED_DOC_TYPE: "T   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/718",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "TRN/718     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "TRN/718 Advances Stock Entry TRN/718",
    },
    {
      DOC_NM: "View User",
      HREF: "",
      DOC_DESCRIPTION: "M_VIEWUSER",
      FLAG: "N",
      WINDOW_NAME:
        "w_view_user                                                                                         ",
      DOC_CRDR: "3",
      DOC_TYPE: "N   ",
      FAVOURITE: "N",
      DESCRIPTION: "FD Reports",
      SEQ_NO: "7",
      EXP_FLAG: "N",
      DOC_TITLE: "View User",
      USER_DEFINED_DOC_TYPE: "N   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/1179",
      VARIANTS: "Y ",
      DOC_ISO_NO: "2",
      DOC_CD: "RPT/1179    ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "RPT/1179 View User RPT/1179",
    },
    {
      DOC_NM: "Daily Transaction All",
      HREF: "",
      DOC_DESCRIPTION: "M_ALL0",
      FLAG: "N",
      WINDOW_NAME:
        "w_balance_register                                                                                  ",
      DOC_CRDR: "3",
      DOC_TYPE: "R   ",
      FAVOURITE: "N",
      DESCRIPTION: "Other Report",
      SEQ_NO: "13",
      EXP_FLAG: "N",
      DOC_TITLE: "Daily Transaction All",
      USER_DEFINED_DOC_TYPE: "R   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/485",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "RPT/485     ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "Y",
      IMG_PATH: "",
      WINDOW_PARM_NM: "DAILY_TRN_TRANSFER_ALL",
      FULL_DOC_NM: "RPT/485 Daily Transaction All RPT/485",
    },
    {
      DOC_NM: "Daily Transaction ( Maker&nbsp￼",
      HREF: "",
      DOC_DESCRIPTION: "M_POSTINGENTRY",
      FLAG: "N",
      WINDOW_NAME:
        "w_daily_trn                                                                                         ",
      DOC_CRDR: "3",
      DOC_TYPE: "T   ",
      FAVOURITE: "N",
      DESCRIPTION: "Transaction Entry",
      SEQ_NO: "3",
      EXP_FLAG: "N",
      DOC_TITLE: "Daily Transaction ( Maker&nbsp￼",
      USER_DEFINED_DOC_TYPE: "T   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/001",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/001     ",
      DOC_ICON_PATH: "TRN001.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "C",
      FULL_DOC_NM: "TRN/001 Daily Transaction ( Maker&nbsp￼ TRN/001",
    },
    {
      DOC_NM: "Inward Clearing Process",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_inward_clearing_process                                                                           ",
      DOC_CRDR: "3",
      DOC_TYPE: "A   ",
      FAVOURITE: "N",
      DESCRIPTION: "Master Entry",
      SEQ_NO: "2",
      EXP_FLAG: "N",
      DOC_TITLE: "Inward Clearing Process",
      USER_DEFINED_DOC_TYPE: "A   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/650",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/650     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "TRN/650 Inward Clearing Process TRN/650",
    },
    {
      DOC_NM: "Daily Tran Confirmation (F2)",
      HREF: "",
      DOC_DESCRIPTION: "M_CONFIRMATION",
      FLAG: "N",
      WINDOW_NAME:
        "w_daily_trn                                                                                         ",
      DOC_CRDR: "3",
      DOC_TYPE: "D   ",
      FAVOURITE: "N",
      DESCRIPTION: "Master/Transaction Confirmation",
      SEQ_NO: "4",
      EXP_FLAG: "N",
      DOC_TITLE: "Daily Tran Confirmation (F2)",
      USER_DEFINED_DOC_TYPE: "D   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/002",
      VARIANTS: "Y ",
      DOC_ISO_NO: "2",
      DOC_CD: "TRN/002     ",
      DOC_ICON_PATH: "TRN002.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "O",
      FULL_DOC_NM: "TRN/002 Daily Tran Confirmation (F2) TRN/002",
    },
    {
      DOC_NM: "Clearing Type wise Register",
      HREF: "",
      DOC_DESCRIPTION: "M_TYPEWISE",
      FLAG: "N",
      WINDOW_NAME:
        "w_balance_register                                                                                  ",
      DOC_CRDR: "3",
      DOC_TYPE: "H   ",
      FAVOURITE: "N",
      DESCRIPTION: "Clearing Reports",
      SEQ_NO: "6",
      EXP_FLAG: "N",
      DOC_TITLE: "Clearing Type wise Register",
      USER_DEFINED_DOC_TYPE: "H   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/439",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "RPT/439     ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "CLG_TYPE",
      FULL_DOC_NM: "RPT/439 Clearing Type wise Register RPT/439",
    },
    {
      DOC_NM: "Template Based Report",
      HREF: "",
      DOC_DESCRIPTION: "M_85",
      FLAG: "N",
      WINDOW_NAME:
        "wr_dynamic_dw_create                                                                                ",
      DOC_CRDR: "3",
      DOC_TYPE: "N   ",
      FAVOURITE: "N",
      DESCRIPTION: "FD Reports",
      SEQ_NO: "7",
      EXP_FLAG: "N",
      DOC_TITLE: "Template Based Report",
      USER_DEFINED_DOC_TYPE: "N   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/1184",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "RPT/1184    ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "Y",
      IMG_PATH: "",
      WINDOW_PARM_NM: "DYNAMIC_REPORT_GENERATION",
      FULL_DOC_NM: "RPT/1184 Template Based Report RPT/1184",
    },
    {
      DOC_NM: "Cashier Exchange Confirmation",
      HREF: "",
      DOC_DESCRIPTION: "M_CONFIRMATION25",
      FLAG: "N",
      WINDOW_NAME:
        "w_confirm_base                                                                                      ",
      DOC_CRDR: "3",
      DOC_TYPE: "D   ",
      FAVOURITE: "N",
      DESCRIPTION: "Master/Transaction Confirmation",
      SEQ_NO: "4",
      EXP_FLAG: "N",
      DOC_TITLE: "Cashier Exchange Confirmation",
      USER_DEFINED_DOC_TYPE: "D   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/368",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/368     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "CASHIER_EXCHANGE",
      FULL_DOC_NM: "TRN/368 Cashier Exchange Confirmation TRN/368",
    },
  ];
};

export const TodaysTransactionTableGrid = async () => {
  return [
    {
      DOC_NM: "A/c Opening Register Normal",
      HREF: "",
      DOC_DESCRIPTION: "M_NORMAL13",
      FLAG: "N",
      WINDOW_NAME:
        "w_balance_register                                                                                  ",
      DOC_CRDR: "3",
      DOC_TYPE: "R   ",
      FAVOURITE: "N",
      DESCRIPTION: "Other Report",
      SEQ_NO: "13",
      EXP_FLAG: "N",
      DOC_TITLE: "A/c Opening Register Normal",
      USER_DEFINED_DOC_TYPE: "R   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/111",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "RPT/111     ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "Y",
      IMG_PATH: "",
      WINDOW_PARM_NM: "OPEN_REGISTER",
      FULL_DOC_NM: "RPT/111 A/c Opening Register Normal RPT/111",
    },
    {
      DOC_NM: "Exception Report",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_report_base2                                                                                      ",
      DOC_CRDR: "3",
      DOC_TYPE: "R   ",
      FAVOURITE: "N",
      DESCRIPTION: "Other Report",
      SEQ_NO: "13",
      EXP_FLAG: "N",
      DOC_TITLE: "Exception Report",
      USER_DEFINED_DOC_TYPE: "R   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/1271",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "RPT/1271    ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "EXCEPTION_REPORT",
      FULL_DOC_NM: "RPT/1271 Exception Report RPT/1271",
    },
    {
      DOC_NM: "Day Book Format2",
      HREF: "",
      DOC_DESCRIPTION: "M_FORMAT28",
      FLAG: "N",
      WINDOW_NAME:
        "w_balance_register                                                                                  ",
      DOC_CRDR: "3",
      DOC_TYPE: "E   ",
      FAVOURITE: "N",
      DESCRIPTION: "Daily Reports & A/c Statement",
      SEQ_NO: "9",
      EXP_FLAG: "N",
      DOC_TITLE: "Day Book Format2",
      USER_DEFINED_DOC_TYPE: "E   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/912",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "RPT/912     ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "DAYBOOK_FORMAT2_FOR_SEVA",
      FULL_DOC_NM: "RPT/912 Day Book Format2 RPT/912",
    },
    {
      DOC_NM: "Advances Stock Entry",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_adv_stock_entry                                                                                   ",
      DOC_CRDR: "3",
      DOC_TYPE: "T   ",
      FAVOURITE: "N",
      DESCRIPTION: "Transaction Entry",
      SEQ_NO: "3",
      EXP_FLAG: "N",
      DOC_TITLE: "Advances Stock Entry",
      USER_DEFINED_DOC_TYPE: "T   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/718",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "TRN/718     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "TRN/718 Advances Stock Entry TRN/718",
    },
    {
      DOC_NM: "View User",
      HREF: "",
      DOC_DESCRIPTION: "M_VIEWUSER",
      FLAG: "N",
      WINDOW_NAME:
        "w_view_user                                                                                         ",
      DOC_CRDR: "3",
      DOC_TYPE: "N   ",
      FAVOURITE: "N",
      DESCRIPTION: "FD Reports",
      SEQ_NO: "7",
      EXP_FLAG: "N",
      DOC_TITLE: "View User",
      USER_DEFINED_DOC_TYPE: "N   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/1179",
      VARIANTS: "Y ",
      DOC_ISO_NO: "2",
      DOC_CD: "RPT/1179    ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "RPT/1179 View User RPT/1179",
    },
    {
      DOC_NM: "Daily Transaction All",
      HREF: "",
      DOC_DESCRIPTION: "M_ALL0",
      FLAG: "N",
      WINDOW_NAME:
        "w_balance_register                                                                                  ",
      DOC_CRDR: "3",
      DOC_TYPE: "R   ",
      FAVOURITE: "N",
      DESCRIPTION: "Other Report",
      SEQ_NO: "13",
      EXP_FLAG: "N",
      DOC_TITLE: "Daily Transaction All",
      USER_DEFINED_DOC_TYPE: "R   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "RPT/485",
      VARIANTS: "Y ",
      DOC_ISO_NO: "",
      DOC_CD: "RPT/485     ",
      DOC_ICON_PATH: "RPT.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "N",
      FAV: "",
      APPROVED: "Y",
      IMG_PATH: "",
      WINDOW_PARM_NM: "DAILY_TRN_TRANSFER_ALL",
      FULL_DOC_NM: "RPT/485 Daily Transaction All RPT/485",
    },
    {
      DOC_NM: "Daily Transaction ( Maker&nbsp￼",
      HREF: "",
      DOC_DESCRIPTION: "M_POSTINGENTRY",
      FLAG: "N",
      WINDOW_NAME:
        "w_daily_trn                                                                                         ",
      DOC_CRDR: "3",
      DOC_TYPE: "T   ",
      FAVOURITE: "N",
      DESCRIPTION: "Transaction Entry",
      SEQ_NO: "3",
      EXP_FLAG: "N",
      DOC_TITLE: "Daily Transaction ( Maker&nbsp￼",
      USER_DEFINED_DOC_TYPE: "T   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/001",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/001     ",
      DOC_ICON_PATH: "TRN001.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "C",
      FULL_DOC_NM: "TRN/001 Daily Transaction ( Maker&nbsp￼ TRN/001",
    },
    {
      DOC_NM: "Inward Clearing Process",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_inward_clearing_process                                                                           ",
      DOC_CRDR: "3",
      DOC_TYPE: "A   ",
      FAVOURITE: "N",
      DESCRIPTION: "Master Entry",
      SEQ_NO: "2",
      EXP_FLAG: "N",
      DOC_TITLE: "Inward Clearing Process",
      USER_DEFINED_DOC_TYPE: "A   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/650",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/650     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "TRN/650 Inward Clearing Process TRN/650",
    },
    {
      DOC_NM: "Inward Clearing Process",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_inward_clearing_process                                                                           ",
      DOC_CRDR: "3",
      DOC_TYPE: "A   ",
      FAVOURITE: "N",
      DESCRIPTION: "Master Entry",
      SEQ_NO: "2",
      EXP_FLAG: "N",
      DOC_TITLE: "Inward Clearing Process",
      USER_DEFINED_DOC_TYPE: "A   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/650",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/550     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "TRN/650 Inward Clearing Process TRN/650",
    },
    {
      DOC_NM: "Inward Clearing Process",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_inward_clearing_process                                                                           ",
      DOC_CRDR: "3",
      DOC_TYPE: "A   ",
      FAVOURITE: "N",
      DESCRIPTION: "Master Entry",
      SEQ_NO: "2",
      EXP_FLAG: "N",
      DOC_TITLE: "Inward Clearing Process",
      USER_DEFINED_DOC_TYPE: "A   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/650",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/450     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "TRN/650 Inward Clearing Process TRN/650",
    },
    {
      DOC_NM: "Inward Clearing Process",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_inward_clearing_process                                                                           ",
      DOC_CRDR: "3",
      DOC_TYPE: "A   ",
      FAVOURITE: "N",
      DESCRIPTION: "Master Entry",
      SEQ_NO: "2",
      EXP_FLAG: "N",
      DOC_TITLE: "Inward Clearing Process",
      USER_DEFINED_DOC_TYPE: "A   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/650",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/670     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "TRN/650 Inward Clearing Process TRN/650",
    },
    {
      DOC_NM: "Inward Clearing Process",
      HREF: "",
      DOC_DESCRIPTION: "",
      FLAG: "N",
      WINDOW_NAME:
        "w_inward_clearing_process                                                                           ",
      DOC_CRDR: "3",
      DOC_TYPE: "A   ",
      FAVOURITE: "N",
      DESCRIPTION: "Master Entry",
      SEQ_NO: "2",
      EXP_FLAG: "N",
      DOC_TITLE: "Inward Clearing Process",
      USER_DEFINED_DOC_TYPE: "A   ",
      COMP_CD: "473 ",
      USER_DEFINE_CD: "TRN/650",
      VARIANTS: "Y ",
      DOC_ISO_NO: "-2",
      DOC_CD: "TRN/654     ",
      DOC_ICON_PATH: "TRN.gif",
      BRANCH_CD: "0002",
      INCLUDES_ADJUSTMENT: "Y",
      FAV: "",
      APPROVED: "N",
      IMG_PATH: "",
      WINDOW_PARM_NM: "",
      FULL_DOC_NM: "TRN/650 Inward Clearing Process TRN/650",
    },
  ];
};
