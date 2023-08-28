import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getDynMetadataGridConfigData = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGFROMCONFIGDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynFieldListData = async ({
  COMP_CD,
  BRANCH_CD,
  docCD,
  srcd,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGFROMFIELDDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      DOC_CD: docCD + "",
      SR_CD: srcd + "",
    });
  if (status === "0") {
    return data;
    // return data.map((item) => {
    //   return {
    //     ...item,
    //     MULTIPLE: item.MULTIPLE === "Y" ? true : false,
    //     ROWDOUBLECLICK: item.ROWDOUBLECLICK === "Y" ? true : false,
    //     ALWAYSAVAILABLE: item.ALWAYSAVAILABLE === "Y" ? true : false,
    //     ISNODATATHENSHOW: item.ISNODATATHENSHOW === "Y" ? true : false,
    //   };
    // });
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynFormPopulateData = async (inputdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGFROMFIELDPOPULATE", {
      DOC_CD: inputdata?.DOC_CD,
      COMP_CD: inputdata?.COMP_CD,
      BRANCH_CD: inputdata?.BRANCH_CD,
    });
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getGridFieldComponentData = async (reqdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETFORMFIELDPROPS", reqdata);
  if (status === "0") {
    return data;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const dynamiFormMetadataConfigDML = async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOFORMCONFIGDATA",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
