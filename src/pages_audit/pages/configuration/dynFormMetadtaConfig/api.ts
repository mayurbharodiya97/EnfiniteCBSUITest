import { AuthSDK } from "registry/fns/auth";
import { DefaultErrorObject } from "components/utils";

export const getDynMetadataGridConfigData = async ({ COMP_CD, BRANCH_CD }) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGFROMCONFIGDATA", {
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
    });
  if (status === "0") {
    // return data;
    return data.map((item) => {
      return {
        ...item,
        RESETFIELDONUNMOUNT: item.RESETFIELDONUNMOUNT === "Y" ? true : false,
      };
    });
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
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynFormPopulateData = async (inputdata) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETTBGFROMFIELDPOPULATE", {
      DOC_CD: inputdata?.DOC_CD.trim(),
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
    return data.map((item) => {
      return {
        ...item,
        _isNewRow: item["NEWROW_STATUS"] === "N" ? false : true,
      };
    });
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
export const dynamiPropsConfigDML = async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "DOFORMPROPDATA",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
