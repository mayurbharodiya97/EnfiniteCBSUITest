import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getUserDetails = async ({ userID }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETEMPLOYEEDTL", {
      USER_ID: userID,
    });
  if (status === "0") {
    const { BRANCH, BRANCH_NAME } = data[0];
    const DEFAULT_BRANCH = `${BRANCH} - ${BRANCH_NAME}`;

    let responseData = data[0];
    if (responseData?.ALLOW_RELEASE === "Y") {
      responseData.ALLOW_RELEASE = true;
    } else {
      responseData.ALLOW_RELEASE = false;
    }
    return { ...responseData, DEFAULT_BRANCH };
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getUserLoginDetails = async ({ userID }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERACTIVITY", {
      USER_ID: userID,
      // A_USER_NAME: userID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getUserAccessBranch = async ({ userID }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERACESSBRNCH", {
      USER_NAME: userID,
    });
  if (status === "0") {
    // return data;
    return data.map((item) => {
      return {
        ...item,
        LOGIN_ACCESS: item.LOGIN_ACCESS === "Y" ? true : false,
        REPORT_ACCESS: item.REPORT_ACCESS === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getUserAccessType = async ({ userID }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("GETUSERACESSTYPE", {
      USER_NAME: userID,
    });
  if (status === "0") {
    // return data;
    return data.map((item) => {
      return {
        ...item,
        ACCESS: item.ACCESS === "Y" ? true : false,
      };
    });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
// export const getUserAccess = async ({ userID }) => {
//   const { status, data, message, messageDetails } =
//     await AuthSDK.internalFetcher("GETUSERACTIVITY", {
//       USER_ID: userID,
//       // A_USER_NAME: userID,
//     });
//   if (status === "0") {
//     return data;
//   } else {
//     throw DefaultErrorObject(message, messageDetails);
//   }
// };

export const changeEmployeePassword = async ({
  userID,
  currentPassword,
  password,
}) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("CHANGEPASSWORD", {
      USER_ID: userID,
      OLD_PASSWORD: currentPassword,
      NEW_PASSWORD: password,
      // NEW_PASSWORD: "123",
      // USER_ID: "bhavyata",
      // OLD_PASSWORD: "1",
      // USERNAME: userID,
    });
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
// changeEmployeePassword()
export const updateUserProfilePic = async ({ userID, imageData, blob }) => {
  const { status, data, message, messageDetails } =
    await AuthSDK.internalFetcher("UPDATEPROFILEPIC", {
      PROFILE_DATA: imageData,
      USER_NAME: userID,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};

export const getquickView = async ({ userID }) => {
  // const { status, data, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETUSERACTIVITY", {
  //     USER_ID: userID,
  //     // A_USER_NAME: userID,
  //   });
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NAME: "VIJAY S SHARMA",
      ACCT_NO: "1234123412351234",
      CUST_ID: "1234",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1678D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45462564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45465164",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45546564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "454867564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45469564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45466564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45246564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45416564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45463564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
  ];
};
export const getdashboardData = async () => {
  // const { status, data, message, messageDetails } =
  //   await AuthSDK.internalFetcher("GETUSERACTIVITY", {
  //     USER_ID: userID,
  //     // A_USER_NAME: userID,
  //   });
  // if (status === "0") {
  //   return data;
  // } else {
  //   throw DefaultErrorObject(message, messageDetails);
  // }
  return [
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NAME: "VIJAY S SHARMA",
      ACCT_NO: "1234123412351234",
      CUST_ID: "123",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1678D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45461564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45462564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45346564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45465464",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45465564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "454677564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
    {
      ACCT_STATUS: "JOINT",
      STATUS: "OPEN",
      ACCT_NO: "9999999999999",
      ACCT_NAME: "MAULIK R BAJAJ",
      CUST_ID: "45466564",
      MOB_NO: "423864384628",
      PAN_NO: "SHDKL1L78D",
      OPENIND_DT: "21/06/2023",
      CLOSE_DT: "04/09/2037",
    },
  ];
};
