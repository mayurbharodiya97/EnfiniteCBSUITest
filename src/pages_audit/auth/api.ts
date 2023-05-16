import { utilFunction } from "components/utils/utilFunctions";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";
import { AuthStateType } from "./type";
import { DefaultErrorObject } from "components/utils";

export const getLoginImageData = async () => {
  // const { data, status, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETLOGINIMGDATA", {});
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      CMMI_TXT: "",
      APP_NM: "Welcome to CBS-Enfinity",
      NOTE: "It is an enterprise browser-based multi-channel banking solution that enables full range of banking services and customers with different user profiles, efficiently and reliable.",
      DASHBOARD_APP_LOGO:
        "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",
      COPYRIGHT_TXT: "",
      COMP_NM: "THE RAJKOT COMMERCIAL CO-OPERATIVE BANK LTD",
      AEM_SESSIONS_LIM: "2",
      COMP_LOGO:
        "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",
    },
  ];
};
// console.log("sdfsdf", getLoginImageData());

export const veirfyUsernameandPassword = async (
  username: any,
  password: any
) => {
  //console.log(CryptoSDK.GetEncryptData(password));
  // const { data, status, message, messageDetails, responseType, access_token } =
  //   await AuthSDK.internalFetcherPreLogin("LOGIN", {
  //     USER_ID: username,
  //     PASSWORD: password,
  //   });
  // if (status === "0") {
  //   return {
  //     data: data[0],
  //     status,
  //     message,
  //     messageDetails,
  //     responseType,
  //     access_token,
  //   };
  // } else {
  //   return { status, data, message, messageDetails };
  // }

  return {
    data: {
      REQUEST_CD: "110432",
      VERIFY_THROUGH: "O",
    },
    status: "0",
    message: "OTP Sent successfully.",
    messageDetails: "OTP Sent successfully.",
    responseType: "D",
    access_token: {
      access_token: "7cf0b9ce-a9bc-490a-923d-82bf56e2e285",
      token_type: "bearer",
      expires_in: "299",
    },
  };
};
export const verifyOTP = async (
  transactionId,
  username,
  otpnumber,
  access_token,
  token_type
) => {
  //console.log(transactionId, username, otpnumber);
  // const {
  //   data,
  //   status,
  //   message,
  //   messageDetails,
  //   access_token: accesstoken,
  // } = await AuthSDK.internalFetcherPreLogin(
  //   "VERIFYOTP",
  //   {
  //     USER_ID: username,
  //     REQUEST_CD: transactionId,
  //     OTP: otpnumber,
  //   },
  //   {
  //     Authorization: utilFunction.getAuthorizeTokenText(
  //       access_token,
  //       token_type
  //     ),
  //   }
  // );
  let {
    data,
    status,
    message,
    messageDetails,
    access_token: accesstoken,
  } = {
    data: [
      {
        USER_SUB_TYPE: "DBR",
        COMPANYNAME: "Demo Bank",
        COMPANYID: "001 ",
        USER_ROLE: "ADMIN",
        USER: {
          BRANCH: "Demo Bank Back Office Configuration",
          LASTLOGINDATE: "02/05/2023 11:21:58",
          BRANCHCODE: "001 ",
          ID: "admin",
          NAME: "ADMIN",
        },
        USER_LEVEL: "4",
        ACCESS: {},
      },
    ],
    status: "0",
    message: "",
    messageDetails: "",
    access_token: {
      access_token: "9b0a0c1f-599c-42a5-8171-36ca8323d2e4",
      refresh_token: "93cfaba6-055b-4e75-aed6-9556b02809d0",
      scope: "read write trust",
      token_type: "bearer",
      expires_in: "299",
    },
  };
  if (status === "0") {
    let transformData = transformAuthData(data[0], {
      generateTime: utilFunction.getCurrentDateinLong(),
      ...accesstoken,
    });
    let {
      status: statusa,
      data: dataa,
      message: messagea,
      messageDetails: messageDetailsa,
    } = await GetMenuData({
      userID: transformData?.user?.id,
      COMP_CD: transformData?.companyID,
      BRANCH_CD: transformData?.user?.branchCode,
      GROUP_NAME: transformData?.roleName,
      fulldata: transformData,
    });
    if (statusa === "0") {
      transformData.menulistdata = dataa;
      return {
        data: transformData,
        status,
        message,
        messageDetails,
      };
    } else {
      return {
        status: statusa,
        data: dataa,
        message: messagea,
        messageDetails: messageDetailsa,
      };
    }
  } else {
    return { status, data, message, messageDetails };
  }
};

export const RefreshTokenData = async (refreshToken) => {
  const { status, access_token } = await AuthSDK.internalFetcherPreLogin(
    "LOGIN",
    {
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }
  );
  //console.log(status, !Boolean(status), typeof status, typeof access_token);
  if (Boolean(status) && status === "0") {
    return {
      generateTime: utilFunction.getCurrentDateinLong(),
      ...access_token,
    };
  } else if (!Boolean(status) || status === "undefined") {
    return {
      generateTime: utilFunction.getCurrentDateinLong(),
      ...access_token,
    };
  } else {
    return null;
  }
};
export const LogoutAPI = async ({ userID }) => {
  const { message } = await AuthSDK.internalFetcher("LOGOUTADMIN", {
    USER_NAME: userID,
    MACHINE_IP: "",
  });
  //if (status === "0") {
  return message;
  //} else {
  //  throw DefaultErrorObject(message, messageDetails);
  //}
};
export const GetMenuData = async ({
  userID,
  COMP_CD,
  BRANCH_CD,
  GROUP_NAME,
  fulldata,
}) => {
  // await AuthSDK.Getfingerprintdata();
  // AuthSDK.loginUserDetails(fulldata);
  // AuthSDK.setToken(fulldata.access_token);
  // const { status, data, message, messageDetails } =
  //   await AuthSDK.internalFetcher("MENULIST", {
  //     USER_NM: userID,
  //     MACHINE_IP: "",
  //     COMP_CD: COMP_CD,
  //     BASE_BRANCH_CD: BRANCH_CD,
  //     BRANCH_CD: BRANCH_CD,
  //     ENTERED_DATE: format(new Date(), "dd/MMM/yyyy"),
  //     GROUP_NAME: GROUP_NAME,
  //     IMG_PATH: "",
  //     FLAG: "ALL_SCREENS",
  //     APP_TRAN_CD: "1",
  //   });
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
// export const verifyPasswordAndLogin = async (
//   transactionId,
//   username,
//   password
// ) => {
//   const { data, status } = await AuthSDK.internalFetcher(
//     `./los/employee/login`,
//     {
//       body: JSON.stringify({
//         request_data: {
//           transactionId: transactionId,
//           password: password,
//           userId: username,
//         },
//         channel: "W",
//       }),
//     }
//   );
//   if (status === "success") {
//     return {
//       status,
//       data: transformAuthData(data?.response_data),
//     };
//   } else {
//     return { status, data: data?.error_data };
//   }
// };

// export const verifyToken = async (token) => {
//   const { data, status } = await AuthSDK.internalFetcher(
//     `./los/employee/token/verify`,
//     {
//       body: JSON.stringify({
//         request_data: {
//           tokenID: token,
//         },
//         channel: "W",
//       }),
//     }
//   );
//   if (status === "success") {
//     return { status, data: data?.response_data };
//   } else {
//     return { status, data: data instanceof Error ? data : data?.error_data };
//   }
// };

const transformAuthData = (data: any, access_token: any): AuthStateType => {
  return {
    access_token: access_token,
    role: data?.USER_LEVEL,
    roleName: data?.USER_ROLE,
    isLoggedIn: false,
    companyName: data?.COMPANYNAME,
    companyID: data?.COMPANYID,
    menulistdata: [],
    user: {
      branch: data?.USER?.BRANCH,
      branchCode: data?.USER?.BRANCHCODE,
      lastLogin: data?.USER?.LASTLOGINDATE,
      name: data?.USER?.NAME,
      //type: data?.user?.flag,
      // firstName: data?.user?.firstName,
      // lastName: data?.user?.lastName,
      // middleName: data?.user?.middleName,
      id: data?.USER?.ID,
    },
    access: {},
  };
};

// const transformRoles = (data: any[]) => {
//   if (!Array.isArray(data)) {
//     return {};
//   }
//   let result = data.reduce((prev, current) => {
//     let products = current.accessCategory as any[];
//     products.reduce((prev, current) => {
//       return (prev[current.categoryCode] = current.categoryName);
//     }, {});

//     return (prev[current?.branchCode] = { ...current, products });
//   }, {});
//   console.log(result);
//   return result;
// };

// const transformRoles = (data: any[]) => {
//   if (!Array.isArray(data)) {
//     return { entities: {}, products: [] };
//   }
//   let products;
//   let result = data.reduce((prev, current) => {
//     let { entityType, accessCategory, ...others } = current;
//     products = accessCategory;
//     if (Array.isArray(prev[entityType])) {
//       prev[entityType].push(others);
//     } else {
//       prev[entityType] = [others];
//     }
//     return prev;
//   }, {});
//   return { entities: result, products: products };
// };
export const capture = async () => {
  var MFS100Request = {
    Quality: 60,
    TimeOut: 10,
  };
  var jsondata = JSON.stringify(MFS100Request);
  const rawResponse = await fetch("http://localhost:8004/mfs100/capture", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: jsondata,
  });
  const content = await rawResponse.json();
  return content;
};
export const verifyUserFinger = async (username, token) => {
  const { data, status } = await AuthSDK.internalFetcher(
    `./cbs/employee/verifyFinger`,
    {
      body: JSON.stringify({
        requestData: {
          userID: username,
        },
        channel: "W",
      }),
    },
    token
  );
  if (status === "success") {
    return { status, data: data?.responseData };
  } else {
    return { status, data: data?.errorData };
  }
};

export const biometricStatusUpdate = async (username, token, verifyStatus) => {
  const { data, status } = await AuthSDK.internalFetcher(
    `./cbs/employee/updateBiometricStatus`,
    {
      body: JSON.stringify({
        requestData: {
          userID: username,
          status: verifyStatus,
        },
        channel: "W",
      }),
    },
    token
  );
  return { status, data };
};
