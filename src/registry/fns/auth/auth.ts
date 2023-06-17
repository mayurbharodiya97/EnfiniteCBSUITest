import { CommonFetcherPreLoginResponse, CommonFetcherResponse } from "../type";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { GetAPIURLFromAction } from "./apiMapping";
import { utilFunction } from "components/utils/utilFunctions";
const authAPI = () => {
  let baseURL: URL | null = null;
  let PackageName: string = "";
  let loginuserDetailsData: any = {};
  let browserFingerPrint = "";
  let accessToken: any | null = null;
  let displayLanguage = "en";
  const inititateAPI = (APIURL: string, PACKAGE_NAME: string) => {
    baseURL = new URL(APIURL);
    PackageName = PACKAGE_NAME;
    GetBrowserFingerPrint();
  };

  const Getfingerprintdata = async () => {
    let retvalue = browserFingerPrint;
    if (!Boolean(browserFingerPrint)) {
      retvalue = await GetBrowserFingerPrint();
    }
    return retvalue;
  };
  const GetBrowserFingerPrint = async () => {
    let fingerprintdata = "";

    await FingerprintJS.load()
      .then((Fingerprint) => Fingerprint.get())
      .then((result) => {
        fingerprintdata = result.visitorId;
      })
      .catch((e) => console.log(e));

    browserFingerPrint = fingerprintdata;
    return fingerprintdata;
  };
  const setDisplayLanguage = (code) => {
    displayLanguage = code;
  };
  const loginUserDetails = ({ role, user: { id, branchCode } }) => {
    loginuserDetailsData = {
      USERNAME: id,
      USERROLE: role,
      BROWSER_FINGERPRINT: browserFingerPrint,
      MACHINE_NAME: "Auto",
      BRANCH_CD: branchCode,
    };
  };
  const setToken = (argaccessToken) => {
    accessToken = argaccessToken;
  };
  const removeToken = () => {
    accessToken = null;
  };
  const getToken = () => {
    return accessToken;
  };
  const internalFetcherPreLogin = async (
    url: string,
    payload: any,
    header: any = {},
    timeout: number | null = null
  ): Promise<CommonFetcherPreLoginResponse> => {
    if (baseURL === null) {
      return {
        status: "999",
        message: "API not inititated",
        messageDetails: "",
        data: [],
      };
    }
    try {
      //*** Set Api Url */
      let apiurl = GetAPIURLFromAction(url, PackageName);

      if (!Boolean(timeout)) {
        timeout = 120000;
      }
      let response = await fetchWithTimeout(new URL(apiurl, baseURL).href, {
        method: "POST",
        headers: {
          DISPLAY_LANGUAGE: displayLanguage,
          ...header,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ACTION: "",
          DISPLAY_LANGUAGE: displayLanguage,
          BROWSER_FINGERPRINT: browserFingerPrint,
          LOGINUSERDETAILS: {
            USERNAME: payload.USER_ID ?? loginuserDetailsData?.USERNAME ?? "",
            USERROLE: loginuserDetailsData?.USERROLE ?? "role",
            BROWSER_FINGERPRINT: browserFingerPrint,
            MACHINE_NAME_FRONT: "",
            BRANCH_CD: loginuserDetailsData?.BRANCH_CD ?? "",
          },
          ...payload,
        }),
        timeout: timeout,
      });
      if (String(response.status) === "200") {
        let data = await response.json();
        if (Array.isArray(data)) {
          data = data[0];
        }
        return {
          status: String(data.STATUS),
          message: data?.MESSAGE ?? "",
          data: data?.RESPONSE ?? [],
          messageDetails: data?.RESPONSEMESSAGE ?? "",
          responseType: data?.RESPONSE?.[0]?.RESPONSE_TYPE ?? "",
          access_token: data?.ACCESS_TOKEN ?? data,
        };
      } else {
        return {
          status: "999",
          message: await GetStatusMessage(response),
          data: [],
          messageDetails: GetDetailsMessage(
            response.status,
            response?.statusText ?? "",
            new URL(apiurl, baseURL).href
          ),
        };
      }
    } catch (e) {
      return {
        status: "999",
        data: [],
        message: String(e),
        messageDetails: "",
      };
    }
  };
  const internalFetcher = async (
    url: string,
    payload: any,
    header: any = {},
    timeout: number | null = null
  ): Promise<CommonFetcherResponse> => {
    if (baseURL === null) {
      return {
        status: "999",
        message: "API not inititated",
        messageDetails: "",
        data: [],
      };
    }
    try {
      //*** Set Api Url */
      let apiurl = GetAPIURLFromAction(url, PackageName);

      if (!Boolean(timeout)) {
        timeout = 120000;
      }

      let localbaseURL = baseURL;
      // if (
      //   apiurl ===
      //   "./adminPanelCommonServiceAPI/DMLOPRATION/SERVICE_CHARGE_OPERATION"
      // ) {
      //   localbaseURL = new URL("http://localhost:8088/");
      // }
      let response = await fetchWithTimeout(
        new URL(apiurl, localbaseURL).href,
        {
          method: "POST",
          headers: {
            DISPLAY_LANGUAGE: displayLanguage,
            ...header,
            "Content-Type": "application/json",
            Authorization: utilFunction.getAuthorizeTokenText(
              accessToken?.access_token,
              accessToken?.token_type
            ),
            UniqueID: browserFingerPrint,
            USER_ID: loginuserDetailsData?.USERNAME,
          },
          body: JSON.stringify({
            ACTION: "",
            DISPLAY_LANGUAGE: displayLanguage,
            LOGINUSERDETAILS: loginuserDetailsData,
            ...payload,
          }),
          timeout: timeout,
        }
      );

      if (String(response.status) === "200") {
        let data = await response.json();
        if (Array.isArray(data)) {
          data = data[0];
        }
        return {
          status: String(data.STATUS),
          message: data?.MESSAGE ?? "",
          data: data?.RESPONSE ?? [],
          messageDetails: data?.RESPONSEMESSAGE ?? "",
          isPrimaryKeyError:
            String(data.STATUS) === "0"
              ? false
              : (data?.RESPONSEMESSAGE ?? "").indexOf(
                  "ORA-00001: unique constraint"
                ) >= 0
              ? true
              : false,
        };
      } else if (String(response.status) === "401" && url !== "LOGOUTUSER") {
        //@ts-ignore
        if (typeof window.__logout === "function") {
          //@ts-ignore
          window.__logout();
        }
        return {
          status: "999",
          message: await GetStatusMessage(response),
          data: [],
          messageDetails: GetDetailsMessage(
            response.status,
            response?.statusText ?? "",
            new URL(apiurl, baseURL).href
          ),
        };
      } else {
        return {
          status: "999",
          message: await GetStatusMessage(response),
          data: [],
          messageDetails: GetDetailsMessage(
            response.status,
            response?.statusText ?? "",
            new URL(apiurl, baseURL).href
          ),
        };
      }
    } catch (e) {
      return {
        status: "999",
        data: [],
        message: String(e),
        messageDetails: "",
      };
    }
  };
  const fetchWithTimeout = async (resource, options?: any) => {
    const { timeout = 90000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    let response;
    await fetch(resource, {
      ...options,
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(id);
        response = res;
      })
      .catch((err) => {
        clearTimeout(id);
        if (err.name === "AbortError") {
          throw "Timeout : Your request has been timed out or has been cancelled by the user.";
        } else {
          throw err;
        }
      });
    //clearTimeout(id);
    return response;
  };
  const GetStatusMessage = async (response) => {
    let responsedata = await response?.json();

    if (response.status === 404 && process.env.NODE_ENV !== "production") {
      return "'भटकने वाले सभी खो नहीं जाते' वाह, यह काफी गहरा है! सिवाय ... इस बार डेवलपर निश्चित रूप से विचलित है, क्योंकि यह समापन बिंदु नहीं मिला है!";
    } else if (Boolean(responsedata)) {
      let message = Array.isArray(responsedata)
        ? responsedata?.[0]?.MESSAGE
        : "";
      if (Boolean(message)) {
        return message;
      } else {
        return "Something went to wrong ! Please try after some time.";
      }
    } else {
      return "Something went to wrong ! Please try after some time.";
    }
  };
  const GetDetailsMessage = (status, statusMessage, url) => {
    if (status === 404 && process.env.NODE_ENV !== "production") {
      return (
        "API URL : " +
        url +
        (Boolean(statusMessage) ? " Status Message :" + statusMessage : "")
      );
    }
    return "";
  };
  return {
    inititateAPI,
    internalFetcher,
    loginUserDetails,
    internalFetcherPreLogin,
    setToken,
    removeToken,
    getToken,
    Getfingerprintdata,
    setDisplayLanguage,
  };
};

export const AuthSDK = authAPI();
