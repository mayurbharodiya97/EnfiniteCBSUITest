import { utilFunction } from "components/utils/utilFunctions";
import { format } from "date-fns";
import { AuthSDK } from "registry/fns/auth";
import { AuthStateType } from "./type";

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
