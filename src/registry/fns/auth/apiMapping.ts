export const ActionWiseAPIConfiguration = {
  LOGIN: {
    url: "authenticationServiceAPI/AUTH/LOGIN",
    packageName: "",
  },
  VERIFYOTP: {
    url: "authenticationServiceAPI/POSTLOGIN/VERIFYOTP",
    packageName: "",
  },
  LOGOUTUSER: {
    url: "/enfinityCommonServiceAPI/LOGOUTUSER",
    packageName: "",
  },
  MENULIST: {
    url: "enfinityCommonServiceAPI/GETMENULIST",
    packageName: "",
  },
  GETMISCVALUE: {
    url: "adminPanelCommonServiceAPI/GETMISCVALUE",
    packageName: "",
  },
  GETLOGINIMGDATA: {
    url: "enfinityCommonServiceAPI/GETLOGINIMGDATA",
    packageName: "",
  },
  GETQUICKACCESS: {
    url: "dashboardServiceAPI/GETQUICKACCESS",
    packageName: "",
  },
  BRANCHLIST: {
    url: "enfinityCommonServiceAPI/BRANCHLIST",
    packageName: "",
  },
  TRANS_SUMMARY_CARD: {
    url: "enfinityCommonServiceAPI/GETTRANSACTIONSUMMARY",
    packageName: "",
  },
  GETEMPPROFILEPHOTO: {
    url: "enfinityCommonServiceAPI/GETDYNAMICDATA/GETEMPPROFILEPHOTO",
    packageName: "",
  },
  GETEMPLOYEEDTL: {
    url: "enfinityCommonServiceAPI/GETDYNAMICDATA/GETEMPLOYEEDTL",
    packageName: "",
  },
  GETCHEQUEBOOK: {
    url: "enfinityCommonServiceAPI/GETDYNAMICDATA/GETCHEQUEBOOK",
    packageName: "",
  },
  GETPENDINGREQUEST: {
    url: "enfinityCommonServiceAPI/DashBoard/GETPENDINGREQUEST",
    packageName: "",
  },
  GETTRANSACTIONDETAILS: {
    url: "dashboardServiceAPI/GETTRANSACTIONDETAILS",
    packageName: "",
  },
  BANKPROFILEPICK: {
    url: "enfinityCommonServiceAPI/GETDYNAMICDATA/BANKPROFILEPICK",
    packageName: "",
  },
  GETQUICKACCESSVIEW: {
    url: "dashboardServiceAPI/GETQUICKACCESSVIEW",
    packageName: "",
  },
  GETANNOUNCEMENT: {
    url: "dashboardServiceAPI/GETANNOUNCEMENT",
    packageName: "",
  },
  GETTIPSDETAILS: {
    url: "dashboardServiceAPI/GETTIPSDETAILS",
    packageName: "",
  },
  GETNOTESDETAILSELECT: {
    url: "dashboardServiceAPI/GETNOTESDETAILSELECT",
    packageName: "",
  },
  GETALERTDTL: {
    url: "dashboardServiceAPI/GETALERTDTL",
    packageName: "",
  },
  GETDASHBOARDDATA: {
    url: "dashboardServiceAPI/GETDASHBOARDDATA",
    packageName: "",
  },
  GETACCOUNTSTATUS: {
    url: "dashboardServiceAPI/GETACCOUNTSTATUS",
    packageName: "",
  },
  RESETPASSWORD: {
    url: "authenticationServiceAPI/AUTH/RESETPASSWORD",
    packageName: "",
  },
  CHANGEPASSWORD: {
    url: "/authenticationServiceAPI/AUTH/CHANGEPASSWORD",
    packageName: "",
  },
  GETACCTINQUIRY: {
    url: "/accountServiceAPI/GETACCTINQUIRY",
    packageName: "",
  },
  GETUSERACTIVITY: {
    url: "enfinityCommonServiceAPI/GETDYNAMICDATA/GETUSERACTIVITY",
    packageName: "",
  },
  GETUSERACESSBRNCH: {
    url: "/enfinityCommonServiceAPI/GETDYNAMICDATA/GETUSERACESSBRNCH",
    packageName: "",
  },
  GETUSERACESSTYPE: {
    url: "/enfinityCommonServiceAPI/GETDYNAMICDATA/GETUSERACESSTYPE",
    packageName: "",
  },
  GETTRANSCROLLDETAIL: {
    url: "enfinityCommonServiceAPI/GETDYNAMICDATA/GETTRANSCROLLDETAIL",
    packageName: "",
  },
  UPDATEPROFILEPIC: {
    url: "/enfinityCommonServiceAPI/UPDATEPROFILEPIC",
    packageName: "",
  },
  GETUSRQUICKVIEW: {
    url: "/enfinityCommonServiceAPI/GETDYNAMICDATA/GETUSRQUICKVIEW",
    packageName: "",
  },
  GETUSRDOCLIST: {
    url: "/enfinityCommonServiceAPI/GETDYNAMICDATA/GETUSRDOCLIST",
    packageName: "",
  },
  GETDASHBOX: {
    url: "/enfinityCommonServiceAPI/GETDYNAMICDATA/GETDASHBOX",
    packageName: "",
  },
  GETUSRDASHBOX: {
    url: "/enfinityCommonServiceAPI/GETDYNAMICDATA/GETUSRDASHBOX",
    packageName: "",
  },
  FORGOTPASSWORD: {
    url: "/enfinityCommonServiceAPI/FORGOTPASSWORD",
    packageName: "",
  },
  FORGOTPWDOTPVERIFY: {
    url: "/enfinityCommonServiceAPI/FORGOTPWDOTPVERIFY",
    packageName: "",
  },
  UPDATEFORGETNEWPASSWORD: {
    url: "/enfinityCommonServiceAPI/UPDATEFORGETNEWPASSWORD",
    packageName: "",
  },
  GETECIRCULARDETAIL: {
    url: "enfinityCommonServiceAPI/GETDYNAMICDATA/GETECIRCULARDETAIL",
    packageName: "",
  },
  DOTNOTESDML: {
    url: "dashboardServiceAPI/DOTNOTESDML",
    packageName: "",
  },
};

export const GetAPIURLFromAction = (action, pname) => {
  let UrlData = ActionWiseAPIConfiguration[action];
  let url = action;
  let PackageName = pname;
  if (Boolean(UrlData)) {
    if (Boolean(UrlData?.url)) {
      url = UrlData?.url;
    }
    PackageName = UrlData?.packageName ?? PackageName;
    //console.log(url, PackageName, Boolean(PackageName));
  }
  let apiurl = Boolean(PackageName)
    ? "./" +
      PackageName +
      (url.startsWith("./")
        ? url.substring(1)
        : url.startsWith("/")
        ? url
        : "/" + url)
    : url.startsWith(".")
    ? url
    : url.startsWith("/")
    ? "." + url
    : "./" + url;
  //console.log(apiurl);
  return apiurl;
};
