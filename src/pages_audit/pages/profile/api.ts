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
      console.log(item.LOGIN_ACCESS, ">>>>item");
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
      USER_ID: userID,
      IMAGE_DATA: imageData,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
