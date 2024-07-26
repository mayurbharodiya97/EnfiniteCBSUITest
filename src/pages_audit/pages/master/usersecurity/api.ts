import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";

export const getSecurityUserGrid = async () => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETSECMSTRETRIVE", {});
    if (status === "0") {
      // return data;
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  export const saveuserdata = async ({ form, grid1, grid2, grid3, grid4 ,grid5}) => {
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "USERACCESSDATADML",
      {
        USER_DTL: form,
        APPLICATION_ACCESS_DTL: grid1,
        BRANCH_TYPE_ACCESS_DTL: grid2,
        ACCT_TYPE_ACCESS_DTL: grid3,
        USER_SHIFT_DTL: grid4,
        BIOMETRIC_DATA_DTL:grid5,
      }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };
  export const UpdateDMLData = async ({ form, grid1, grid2, grid3, grid4,grid5 }) => {
    const grids = [grid1, grid2, grid3,grid4,grid5];
  const requestData = {
    USER_DTL: form,
    // USER_SHIFT_DTL: grid4,
  };
  
  grids.forEach((grid, index) => {
    const gridKey = ['APPLICATION_ACCESS_DTL', 'BRANCH_TYPE_ACCESS_DTL', 'ACCT_TYPE_ACCESS_DTL' , 'USER_SHIFT_DTL', 'BIOMETRIC_DATA_DTL'][index];
    const gridConditions = ['isNewRow', 'isDeleteRow', 'isUpdatedRow'];
  
    if (gridConditions.some(condition => grid?.[condition]?.length > 0)) {
      requestData[gridKey] = { DETAILS_DATA: grid };
    }
  });
    const { status, message, messageDetails } = await AuthSDK.internalFetcher(
      "USERACCESSDATADML",
     {
      ...requestData
     }
    );
    if (status === "0") {
      return message;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

  export const getAduserParavalue = async ({comp_cd,branch_cd}) => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("GETSECUSERPARAS", {
        COMP_CD : comp_cd,
        BRANCH_CD:branch_cd
      });
    if (status === "0") {
      // return data;
      return data;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

  export const confirmSecurityUserData = async ({confirm,usera_name}) => {
    const { status, data, message, messageDetails } =
      await AuthSDK.internalFetcher("CONFIRMUSERADATA", {
        CONFIRMED : confirm,
        USER_NAME : usera_name,
      });
    if (status === "0") {
      return message;
    } else {
      console.log("message",message)
      console.log("messageDetails",messageDetails)
      throw DefaultErrorObject(message, messageDetails);
    }
  };