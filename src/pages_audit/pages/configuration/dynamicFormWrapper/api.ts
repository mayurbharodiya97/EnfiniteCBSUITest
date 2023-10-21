import { DefaultErrorObject } from "components/utils";
import { AuthSDK } from "registry/fns/auth";
import { filters } from "components/report";

export const getDynamicFormMetaData = async ({
  DOC_CD,
  COMP_CD,
  BRANCH_CD,
  SR_CD,
}) => {
  const { data, status, message, messageDetails } =
    await AuthSDK.internalFetcher("GETDYNFORMGRIDMETADATA", {
      DOC_CD: DOC_CD,
      COMP_CD: COMP_CD,
      BRANCH_CD: BRANCH_CD,
      SR_CD: SR_CD,
    });

  if (status === "0") {
    const field = data[0]?.FIELD?.map((one) => {
      const matchingProps = data[0]?.PROP.filter(
        (prop) => prop.LINE_ID === one.LINE_ID
      );
      // Initialize an object to store all the matching props
      const matchingPropsObject = {};
      // Iterate over matchingProps and add them to the object
      const arrayObjectRegExp = /^\[\{.*\}\]$/;

      matchingProps.forEach(async (matchingProp) => {
        if (
          matchingProp.PROPS_ID === "options" &&
          arrayObjectRegExp.test(matchingProp.PROPS_VALUE)
        ) {
          // Apply specific condition for the "options" PROPS_ID with the array of objects format

          const parsedValue = JSON.parse(matchingProp.PROPS_VALUE);
          matchingPropsObject[matchingProp.PROPS_ID] = parsedValue;
        } else {
          matchingPropsObject[matchingProp.PROPS_ID] = matchingProp.PROPS_VALUE;
        }
        // For that Dyanmic SQL Function call for api calling purpose
        const regex = /^[A-Z]+$/;
        if (
          matchingProp.PROPS_ID === "options" &&
          regex.test(matchingProp.PROPS_VALUE)
        ) {
          matchingPropsObject[matchingProp.PROPS_ID] =
            createChargeTemplateFetcher(
              matchingProp.PROPS_VALUE,
              matchingProp.DISPLAY_VALUE,
              matchingProp.DATA_VALUE
            );
        }
        // value get in string so convert to boolean
        if (matchingProp.PROPS_VALUE === "true") {
          matchingPropsObject[matchingProp.PROPS_ID] = true;
        } else if (matchingProp.PROPS_VALUE === "false") {
          matchingPropsObject[matchingProp.PROPS_ID] = false;
        }
      });
      if (matchingProps.length > 0) {
        return {
          render: {
            componentType: one?.COMPONENT_TYPE,
          },
          name: one?.FIELD_NAME,
          label: one?.FIELD_LABEL,
          // type: "text",
          //@ts-ignore
          required: one?.FIELD_REQUIRED,
          GridProps: {
            xs: one?.XS,
            sm: one?.SM,
            md: one?.MD,
            lg: one?.LG,
            xl: one?.XL,
          },
          ...matchingPropsObject, // Spread all matching props into the object
        };
      } else {
        return {
          render: {
            componentType: one?.COMPONENT_TYPE,
          },
          name: one?.FIELD_NAME,
          label: one?.FIELD_LABEL,
          type: "text",
          //@ts-ignore
          required: one?.FIELD_REQUIRED,

          GridProps: {
            xs: one?.XS,
            sm: one?.SM,
            md: one?.MD,
            lg: one?.LG,
            xl: one?.XL,
          },
        };
      }
    });

    let result = {
      DOC_CD: data[0]?.DOC_CD,
      form: {
        name: data[0]?.FORM_NAME,
        label: data[0]?.FORM_LABEL,
        // always set false value otherwsie re render form
        resetFieldOnUnmount:
          data[0]?.RESETFIELDONUNMOUNT === "Y" ? true : false,
        validationRun: data[0]?.VALIDATIONRUN,
        submitAction: data[0]?.SUBMITACTION,
        // allowColumnHiding: true,
        render: {
          ordering: "auto",
          renderType: "simple",
          gridConfig: {
            item: {
              xs: 12,
              sm: 4,
              md: 4,
            },
            container: {
              direction: "row",
              spacing: 2,
            },
          },
        },
        componentProps: {
          textField: {
            fullWidth: true,
          },
          select: {
            fullWidth: true,
          },
          datePicker: {
            fullWidth: true,
          },
          numberFormat: {
            fullWidth: true,
          },
          inputMask: {
            fullWidth: true,
          },
          datetimePicker: {
            fullWidth: true,
          },
        },
      },

      fields: field,
      // fields: filter,
    };
    console.log("result", result);
    return result;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynamicFormData = (DocID) => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    `/commonMasterServiceAPI/DOFORMDML/${DocID}`,
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
const createChargeTemplateFetcher = (
  PROPS_VALUE,
  DISPLAY_VALUE,
  DATA_VALUE
) => {
  const GetChargeTemplates = async (_, __, ___, dependent) => {
    const { data, status, message, messageDetails } =
      await AuthSDK.internalFetcher(
        `/enfinityCommonServiceAPI/GETDYNAMICDATA/${PROPS_VALUE}`,
        {}
      );
    if (status === "0") {
      console.log("data", data);
      let responseData = data;
      if (Array.isArray(responseData)) {
        responseData = responseData.map(
          ({ DATA_VALUE, DISPLAY_VALUE, ...other }) => {
            return {
              value: DATA_VALUE,
              label: DISPLAY_VALUE,
              ...other,
            };
          }
        );
      }
      return responseData;
    } else {
      throw DefaultErrorObject(message, messageDetails);
    }
  };

  return GetChargeTemplates;
};
