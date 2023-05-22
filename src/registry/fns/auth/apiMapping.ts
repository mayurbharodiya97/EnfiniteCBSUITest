export const ActionWiseAPIConfiguration = {
  LOGIN: {
    url: "authenticationServiceAPI/AUTH/LOGIN",
    packageName: "",
  },
  VERIFYOTP: {
    url: "authenticationServiceAPI/POSTLOGIN/VERIFYOTP",
    packageName: "",
  },
  DOUPDATEPASSWORD: {
    url: "userRegistrationServiceAPI/DOUPDATEPASSWORD",
    packageName: "",
  },
  LOGOUTADMIN: {
    url: "adminPanelCommonServiceAPI/GETDYNAMICDATA/LOGOUTADMIN",
    packageName: "",
  },
  MENULIST: {
    url: "adminPanelCommonServiceAPI/GETMENULIST",
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
  RECENT_FAVORITE: {
    url: "enfinityCommonServiceAPI/GETMENULIST",
    packageName: "",
  },
  TRANS_SUMMARY_CARD: {
    url: "adminPanelCommonServiceAPI/DashBoard/GETTRANSACTIONSUMMARY",
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
