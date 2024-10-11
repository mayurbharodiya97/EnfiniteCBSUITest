import * as API from "./api";

export const impsEntryMetadata = {
  form: {
    name: "imps-Entry-etadata",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    hideHeader: true,
    submitAction: "home",
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
          spacing: 1,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      fullWidth: true,
      label: "CustomerId",
      isFieldFocused: true,
      required: true,
      placeholder: "Enter Customer Id",
      dependentFields: [
        "PARA_602",
        "PARA_946",
        "RETRIEVE_DATA",
        "ROWDATA_LENGTH",
        "OLD_CUST_ID",
      ],
      isReadOnly: (fieldData, dependentFields) => {
        if (dependentFields?.RETRIEVE_DATA?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependent
      ) => {
        if (
          field?.value &&
          formState?.FORM_MODE === "add" &&
          dependent?.OLD_CUST_ID?.value !== field?.value
        ) {
          let postData = await API.validateCustId({
            SCREEN_REF: "MST/843",
            CUST_ID: field?.value,
          });
          if (postData?.length) {
            let message = postData?.[0]?.MSG?.[0];
            if (message.O_STATUS !== "0") {
              let buttonName = await formState.MessageBox({
                messageTitle: "ValidationAlert",
                message: message?.O_MESSAGE,
                defFocusBtnName: "Ok",
              });
              if (buttonName === "Ok") {
                formState.initialDataRef.current = {};
                formState?.setRowData([]);
                formState?.setIsData((old) => ({
                  ...old,
                  uniqueNo: Date.now(),
                }));
                return {
                  CUSTOMER_ID: { value: "", isFieldFocused: true },
                  ORGINAL_NM: { value: "" },
                  UNIQUE_ID: { value: "" },
                  MOB_NO: { value: "" },
                  PAN_NO: { value: "" },
                  OLD_CUST_ID: { value: "" },
                  POPULATE: { value: "N" },
                  CONFIRMED: { value: "" },
                };
              }
            } else if (message?.O_STATUS === "0") {
              formState.initialDataRef.current = {
                CUSTOMER_ID: field?.value,
                ORGINAL_NM: postData?.[0]?.ORIGINAL_NM,
                UNIQUE_ID: postData?.[0]?.UNIQUE_ID,
                MOB_NO: postData?.[0]?.MOB_NO,
                PAN_NO: postData?.[0]?.PAN_NO,
                OLD_CUST_ID: field?.value,
                CONFIRMED: postData?.[0]?.CONFIRMED,
              };
              formState?.setRowData([]);
              formState?.setIsData((old) => ({
                ...old,
                uniqueNo: Date.now(),
              }));
              return {
                CUSTOMER_ID: {
                  value: field?.value,
                  ignoreUpdate: true,
                  isFieldFocused: false,
                },
                ORGINAL_NM: { value: postData?.[0]?.ORIGINAL_NM },
                UNIQUE_ID: { value: postData?.[0]?.UNIQUE_ID },
                MOB_NO: { value: postData?.[0]?.MOB_NO },
                PAN_NO: { value: postData?.[0]?.PAN_NO },
                CONFIRMED: { value: postData?.[0]?.CONFIRMED },
                OLD_CUST_ID: { value: field?.value },
                COMP_CD: { value: authState?.companyID },
                POPULATE: { value: "Y" },
              };
            }
          }
        } else if (!field?.value) {
          if (dependent?.ROWDATA_LENGTH?.value > 0) {
            formState.initialDataRef.current = {};
            formState?.setRowData([]);
            formState?.setIsData((old) => ({
              ...old,
              uniqueNo: Date.now(),
            }));
          }
          return {
            ORGINAL_NM: { value: "" },
            UNIQUE_ID: { value: "" },
            MOB_NO: { value: "" },
            PAN_NO: { value: "" },
            CONFIRMED: { value: "" },
            OLD_CUST_ID: { value: "" },
            POPULATE: { value: "N" },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,

      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "OLD_CUST_ID",
      // defaultValue: "007",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ORGINAL_NM",
      label: "AcctOrignalName",
      fullWidth: true,
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 4.5,
        sm: 4.5,
        lg: 4.5,
        xl: 4.5,
      },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "MOB_NO",
      label: "MobileNo",
      maxLength: 10,
      placeholder: "MobileNo",
      type: "string",
      fullWidth: true,
      required: true,
      isReadOnly: true,
      // startsIcon: Mobile_Number_Svg,
      startsIcon: "PhoneAndroidSharp",
      iconStyle: {
        color: "var(--theme-color3)",
        height: 20,
        width: 20,
      },
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length <= 0) {
          return "";
        } else if (columnValue.value.length >= 11) {
          return "The length of your Mobile Number is greater than 10 character";
        } else if (columnValue.value.length <= 9) {
          return "The length of your Mobile Number is less than 10 character";
        }
        return "";
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
    },

    {
      render: {
        componentType: "aadharCard",
      },
      name: "UNIQUE_ID",
      label: "UIDAadhaar",
      fullWidth: true,
      placeholder: "0000 0000 0000",
      isReadOnly: true,
      maxLength: 12,
      GridProps: { xs: 12, md: 2.5, sm: 2.5, lg: 2.5, xl: 2.5 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "", params: [""] }],
      },
    },

    {
      render: {
        componentType: "panCardOptional",
      },
      name: "PAN_NO",
      label: "PanNo",
      fullWidth: true,
      // placeholder: "AAAAA0000A",
      isReadOnly: true,
      txtTransform: "uppercase",
      GridProps: { xs: 12, md: 2.5, sm: 2.5, lg: 2.5, xl: 2.5 },

      // validate: (columnValue, allField, flag) => API.validatePAN(columnValue, allField, flag),
      // maxLength: 10,
    },
    {
      render: {
        componentType: "datetimePicker",
      },
      name: "REG_DATE",
      label: "Activation Date",
      format: "dd/MM/yyyy HH:mm:ss",
      fullWidth: true,
      isReadOnly: true,
      GridProps: { xs: 12, md: 2.5, sm: 2.5, lg: 2.5, xl: 2.5 },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CONFIRMED",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_COMP_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ENTERED_BRANCH_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "TRAN_CD",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "RETRIEVE_DATA",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ROWDATA_LENGTH",
    },

    {
      render: {
        componentType: "checkbox",
      },
      name: "ACTIVE",
      label: "Active",
      fullWidth: true,
      dependentFields: ["RETRIEVE_DATA"],
      shouldExclude: (field, dependent) => {
        if (dependent?.RETRIEVE_DATA?.value === "Y") {
          return false;
        }
        return true;
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DEACTIVE_DT",
      fullWidth: true,
      isReadOnly: true,
      isWorkingDate: true,
      label: "DeActive Date",
      dependentFields: ["ACTIVE", "RETRIEVE_DATA"],
      shouldExclude: (_, dependent, __) => {
        if (
          !Boolean(dependent?.ACTIVE?.value) &&
          dependent?.RETRIEVE_DATA?.value === "Y"
        ) {
          return false;
        }
        return true;
      },
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },

    {
      render: {
        componentType: "formbutton",
      },
      name: "POPULATE",
      label: "Populate",
      __VIEW__: {
        render: {
          componentType: "hidden",
        },
      },
      dependentFields: ["RETRIEVE_DATA", "CUSTOMER_ID"],
      shouldExclude: (field, dependentFields) => {
        if (
          field?.value === "Y" ||
          dependentFields?.RETRIEVE_DATA?.value === "Y"
        ) {
          return false;
        }
        return true;
      },
      GridProps: {
        xs: 12,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 1,
      },
    },

    {
      render: {
        componentType: "arrayField",
      },
      name: "accMapping",
      // displayCountName: "Account Mapping",
      //   disagreeButtonName: "No",
      //   agreeButtonName: "Yes",
      //   errorTitle: "Are you Sure you want to delete this row?",
      //   removeRowFn: "deleteFormArrayFieldData",
      fixedRows: true,
      // isScreenStyle: true,
      // isRemoveButton: false,

      dependentFields: ["ROWDATA_LENGTH"],
      shouldExclude: (field, dependent) => {
        if (dependent?.ROWDATA_LENGTH?.value > 0) {
          return false;
        }
        return true;
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        lg: 12,
        xl: 12,
        sx: {
          "& .MuiPaper-root": {
            height: "calc(100vh - 370px)",
            overflow: "scroll",
          },
        },
      },
      _fields: [
        {
          render: {
            componentType: "typography",
          },
          name: "FULL_ACCT_NO_NM",
          label: "",
          shouldExclude: (field) => {
            if (field?.value) {
              return false;
            }
            return true;
          },
          TypographyProps: { variant: "subtitle1", fontWeight: 500 },
          GridProps: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
            pt: "6px !important",
          },
        },
        {
          render: { componentType: "datePicker" },
          name: "REG_DT",
          type: "date",
          label: "Reg. Date",
          required: true,
          isReadOnly: true,
          isWorkingDate: true,
          GridProps: {
            xs: 12,
            md: 2,
            sm: 2,
            lg: 2,
            xl: 2,
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["This field is required"] }],
          },
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "COMP_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "BRANCH_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "ACCT_TYPE",
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "ACCT_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "ACCT_NM",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TRAN_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "ENTERED_BRANCH_CD",
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "IFT",
          label: "IFT",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },

        {
          render: { componentType: "amountField" },
          name: "PERDAY_IFT_LIMIT",
          type: "text",
          label: "IFT/Daily Limit",
          dependentFields: ["IFT"],
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          // required: true,
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["This field is required"] }],
          // },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IFT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "IFT_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["IFT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IFT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "RTGS",
          label: "RTGS",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_RTGS_LIMIT",
          type: "text",
          label: "RTGS/Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["RTGS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.RTGS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "RTGS_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["RTGS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.RTGS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "NEFT",
          label: "NEFT",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_NEFT_LIMIT",
          type: "text",
          label: "NEFT/Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["NEFT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.NEFT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "NEFT_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["NEFT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.NEFT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },

        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "OWN_ACT",
          label: "Own A/c",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_OWN_LIMIT",
          type: "text",
          label: "OWN/Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["OWN_ACT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.OWN_ACT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "OWN_ACT_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["OWN_ACT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.OWN_ACT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "SPACER_ST",
          GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
          __VIEW__: {
            render: {
              componentType: "spacer",
            },
          },
        },

        {
          render: {
            componentType: "formbutton",
          },
          name: "JOINT_DETAILS",
          label: "Joint Details",
          __VIEW__: {
            render: {
              componentType: "hidden",
            },
          },
          GridProps: {
            xs: 12,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
          },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "PHOTO_SIGN",
          label: "Photo/sign",
          __VIEW__: {
            render: {
              componentType: "hidden",
            },
          },
          GridProps: {
            xs: 12,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
          },
        },

        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "BBPS",
          label: "BBPS",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_BBPS_LIMIT",
          type: "text",
          label: "BBPS/Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["BBPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.BBPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "BBPS_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",

          label: " ",
          dependentFields: ["BBPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.BBPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "PG_TRN",
          defaultValue: false,
          label: "Payment Gateway",
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_PG_AMT",
          type: "text",
          label: "P.Gateway/Daily Limit",
          GridProps: { xs: 12, md: 2, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["PG_TRN"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.PG_TRN"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "PG_TRN_LIMIT_SPACER",
          GridProps: { xs: 12, md: 2, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["PG_TRN"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.PG_TRN"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "IMPS",
          label: "IMPS",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_P2P_LIMIT",
          type: "text",
          label: "IMPS P2P Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["IMPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IMPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "IMPS_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["IMPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IMPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_P2A_LIMIT",
          type: "text",
          label: "IMPR P2A Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["IMPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IMPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "IMPS_LIMIT_SPACER2",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["IMPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IMPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "ALLLOW_DELETE",
          label: "Delete",
          dependentFields: ["REG_DATE", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
          __VIEW__: {
            render: {
              componentType: "hidden",
            },
          },
          GridProps: {
            xs: 12,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
          },
        },
      ],
    },
  ],
};
export const impsRegDetails = {
  form: {
    name: "imps-RegDetails",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    hideHeader: true,
    submitAction: "home",
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
          spacing: 1,
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
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      name: "accMapping",
      // displayCountName: "Account Mapping",
      //   disagreeButtonName: "No",
      //   agreeButtonName: "Yes",
      //   errorTitle: "Are you Sure you want to delete this row?",
      //   removeRowFn: "deleteFormArrayFieldData",
      fixedRows: true,
      // isScreenStyle: true,
      // isRemoveButton: false,
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
        lg: 12,
        xl: 12,
      },
      _fields: [
        {
          render: {
            componentType: "typography",
          },
          name: "FULL_ACCT_NO_NM",
          label: "",
          shouldExclude: (field) => {
            if (field?.value) {
              return false;
            }
            return true;
          },
          TypographyProps: { variant: "subtitle1", fontWeight: 500 },
          GridProps: {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
            pt: "6px !important",
          },
        },
        {
          render: { componentType: "datePicker" },
          name: "REG_DATE",
          type: "date",
          label: "Reg. Date",
          required: true,
          isReadOnly: true,
          isWorkingDate: true,
          GridProps: {
            xs: 12,
            md: 2,
            sm: 2,
            lg: 2,
            xl: 2,
          },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["This field is required"] }],
          },
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "BRANCH_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "ACCT_TYPE",
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "ACCT_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "ACCT_NM",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "TRAN_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "ENTERED_BRANCH_CD",
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "IFT",
          label: "IFT",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },

        {
          render: { componentType: "amountField" },
          name: "PERDAY_IFT_LIMIT",
          type: "text",
          label: "IFT/Daily Limit",
          dependentFields: ["IFT"],
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          // required: true,
          // schemaValidation: {
          //   type: "string",
          //   rules: [{ name: "required", params: ["This field is required"] }],
          // },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IFT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "IFT_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["IFT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IFT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "RTGS",
          label: "RTGS",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_RTGS_LIMIT",
          type: "text",
          label: "RTGS/Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["RTGS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.RTGS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "RTGS_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["RTGS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.RTGS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "NEFT",
          label: "NEFT",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_NEFT_LIMIT",
          type: "text",
          label: "NEFT/Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["NEFT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.NEFT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "NEFT_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["NEFT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.NEFT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },

        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "OWN_ACT",
          label: "Own A/c",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_OWN_LIMIT",
          type: "text",
          label: "OWN/Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["OWN_ACT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.OWN_ACT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "OWN_ACT_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["OWN_ACT"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.OWN_ACT"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },

        {
          render: {
            componentType: "hidden",
          },
          name: "SPACER_ST",
          GridProps: { xs: 12, md: 2, sm: 2, lg: 2, xl: 2 },
          __VIEW__: {
            render: {
              componentType: "spacer",
            },
          },
        },

        {
          render: {
            componentType: "formbutton",
          },
          name: "JOINT_DETAILS",
          label: "Joint Details",
          __VIEW__: {
            render: {
              componentType: "hidden",
            },
          },
          GridProps: {
            xs: 12,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
          },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "PHOTO_SIGN",
          label: "Photo/sign",
          __VIEW__: {
            render: {
              componentType: "hidden",
            },
          },
          GridProps: {
            xs: 12,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
          },
        },

        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "BBPS",
          label: "BBPS",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_BBPS_LIMIT",
          type: "text",
          label: "BBPS/Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["BBPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.BBPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "BBPS_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",

          label: " ",
          dependentFields: ["BBPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.BBPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "PG_TRN",
          defaultValue: false,
          label: "Payment Gateway",
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_PG_AMT",
          type: "text",
          label: "P.Gateway/Daily Limit",
          GridProps: { xs: 12, md: 2, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["PG_TRN"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.PG_TRN"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "PG_TRN_LIMIT_SPACER",
          GridProps: { xs: 12, md: 2, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["PG_TRN"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.PG_TRN"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "checkbox" },
          type: "checkbox",
          name: "IMPS",
          label: "IMPS",
          defaultValue: false,
          GridProps: { xs: 6, md: 1, sm: 1, lg: 1, xl: 1 },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_P2P_LIMIT",
          type: "text",
          label: "IMPS P2P Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["IMPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IMPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "IMPS_LIMIT_SPACER",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["IMPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IMPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: { componentType: "amountField" },
          name: "PERDAY_P2A_LIMIT",
          type: "text",
          label: "IMPR P2A Day Limit",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          FormatProps: {
            thousandSeparator: false,
            thousandsGroupStyle: "",
            allowNegative: false,
            allowLeadingZeros: false,
            decimalScale: 0,
            isAllowed: (values) => {
              if (values?.value?.length > 12) {
                return false;
              }
              if (values.floatValue === 0) {
                return false;
              }
              return true;
            },
          },
          dependentFields: ["IMPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IMPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return false;
            }
            return true;
          },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "IMPS_LIMIT_SPACER2",
          GridProps: { xs: 12, md: 3, sm: 4, lg: 2, xl: 1.5 },
          defaultValue: "",
          dependentFields: ["IMPS"],
          shouldExclude: (_, dependentFieldsValues, __) => {
            const dependentValue = dependentFieldsValues?.[
              "accMapping.IMPS"
            ]?.value
              .toString()
              .trim();
            if (dependentValue === "Y" || dependentValue === "true") {
              return true;
            }
            return false;
          },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "ALLLOW_DELETE",
          label: "Delete",
          dependentFields: ["REG_DATE", "BRANCH_CD", "ACCT_TYPE", "ACCT_CD"],
          __VIEW__: {
            render: {
              componentType: "hidden",
            },
          },
          GridProps: {
            xs: 12,
            sm: 1,
            md: 1,
            lg: 1,
            xl: 1,
          },
        },
      ],
    },
  ],
};
