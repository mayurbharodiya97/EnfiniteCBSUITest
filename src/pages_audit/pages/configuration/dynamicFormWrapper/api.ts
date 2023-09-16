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
      const matchingProp = data[0]?.PROP.find(
        (prop) => prop.LINE_ID === one.LINE_ID
      );
      if (matchingProp) {
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
          ...{ [matchingProp.PROPS_ID]: matchingProp.PROPS_VALUE },
          // schemaValidation: {
          //   type: "string",
          //   rules: [
          //     { name: "required", params: ["Screen Name is required."] },
          //     { name: "SCREEN_NAME", params: ["Please enter Screen Name."] },
          //   ],
          // },
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

          // schemaValidation: {
          //   type: "string",
          //   rules: [
          //     { name: "required", params: ["Screen Name is required."] },
          //     { name: "SCREEN_NAME", params: ["Please enter Screen Name."] },
          //   ],
          // },
        };
      }
    });

    let result = {
      DOC_CD: data[0]?.DOC_CD,
      form: {
        name: data[0]?.FORM_NAME,
        label: data[0]?.FORM_LABEL,
        resetFieldOnUnmount: data[0]?.RESETFIELDONUNMOUNT,
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
    return result;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
export const getDynamicFormData = () => async (formData: any) => {
  const { status, message, messageDetails } = await AuthSDK.internalFetcher(
    "FORMDML",
    formData
  );
  if (status === "0") {
    return message;
  } else {
    throw DefaultErrorObject(message, messageDetails);
  }
};
