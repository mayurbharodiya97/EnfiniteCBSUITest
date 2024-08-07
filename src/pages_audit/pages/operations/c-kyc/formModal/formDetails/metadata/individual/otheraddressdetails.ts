import * as API from "../../../../api";

export const other_address_meta_data = {
  form: {
    name: "other_address_details_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
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
      datetimePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      name: "OTHER_ADDRESS",
      // fixedRows: 1,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "divider",
          },
          dividerText: "CurrentAddress",
          name: "CurrentAddressDivider_ignoreField",
          label: "CurrentAddressDivider",
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "ADDRESS_TYPE",
          label: "AddressType",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
          options: () => API.getPMISCData("ADDRESS_TYPE"),
          _optionsKey: "currentAddType",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD1",
          label: "Line1",
          required: true,
          maxLength: 50,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
          },
          validate: (columnValue, allField, flag) =>
            API.AlphaNumericValidate(columnValue),
          placeholder: "",
          type: "text",
          txtTransform: "uppercase",
          GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD2",
          label: "Line2",
          placeholder: "",
          maxLength: 50,
          validate: (columnValue, allField, flag) =>
            API.AlphaNumericValidate(columnValue),
          type: "text",
          txtTransform: "uppercase",
          GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ADD3",
          label: "Line3",
          placeholder: "",
          maxLength: 50,
          validate: (columnValue, allField, flag) =>
            API.AlphaNumericValidate(columnValue),
          type: "text",
          txtTransform: "uppercase",
          GridProps: { xs: 12, sm: 5, md: 3.2, lg: 3.2, xl: 3.3 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PIN_CODE",
          label: "PIN",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
          },
          maxLength: 6,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 6) {
                return false;
              }
              return true;
            },
          },
          validate: (columnValue) => {
            const PIN = columnValue?.value;
            if (Boolean(PIN) && PIN.length < 6) {
              return "Pin code should be of six digits";
            }
          },
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          runPostValidationHookAlways: false,
          name: "AREA_CD",
          label: "SubArea",
          dependentFields: ["PIN_CODE"],
          disableCaching: true,
          options: (dependentValue, formState, _, authState) =>
            API.getOptionsOnPinParentAreaOtherAdd(
              dependentValue,
              formState,
              _,
              authState
            ),
          _optionsKey: "indSubareaOp",
          isReadOnly: (fieldValue, dependentFields, formState) => {
            const pin_code = dependentFields?.["OTHER_ADDRESS.PIN_CODE"]?.value;
            if (!Boolean(pin_code)) {
              return true;
            } else if (Boolean(pin_code) && pin_code.length < 6) {
              return true;
            }
            return false;
          },
          setValueOnDependentFieldsChange: (dependentFields) => {
            const pincode = dependentFields?.["OTHER_ADDRESS.PIN_CODE"]?.value;
            if (Boolean(pincode)) {
              if (pincode.length < 6) {
                return "";
              }
            } else return null;
          },
          postValidationSetCrossFieldValues: (
            field,
            __,
            ___,
            dependentFieldsValues
          ) => {
            // console.log("siudbcsiudbcisbdc postValidationSetCrossFieldValues called", field.value)
            // console.log("sdhaiuwqidquwdqwe", dependentFieldsValues)
            if (field?.value) {
              let values = {
                CITY_CD: {
                  value: field?.optionData[0]?.CITY_CD
                    ? field?.optionData[0]?.CITY_CD
                    : "",
                },
                CITY_ignoreField: {
                  value: field?.optionData[0]?.CITY_NM
                    ? field?.optionData[0]?.CITY_NM
                    : "",
                },
                // CITY_CD: {value: (field?.optionData[0]?.CITY_CD || field?.optionData[0]?.CITY_NM) ? `${field?.optionData[0]?.CITY_NM} - ${field?.optionData[0]?.CITY_CD}` : ""},
                DISTRICT_CD: {
                  value: field?.optionData[0]?.DISTRICT_CD
                    ? field?.optionData[0]?.DISTRICT_CD
                    : "",
                },
                DISTRICT_ignoreField: {
                  value: field?.optionData[0]?.DISTRICT_NM
                    ? field?.optionData[0]?.DISTRICT_NM
                    : field?.optionData[0]?.DISTRICT_CD
                    ? field?.optionData[0]?.DISTRICT_CD
                    : "",
                },
                STATE: { value: field?.optionData[0]?.STATE_NM ?? "" },
                COUNTRY: { value: field?.optionData[0]?.COUNTRY_NM ?? "" },
                STATE_CD: { value: field?.optionData[0]?.STATE_CD ?? "" },
                COUNTRY_CD: { value: field?.optionData[0]?.COUNTRY_CD ?? "" },
              };
              return values;
            }
            return {};
          },
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CITY_ignoreField",
          label: "City",
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
          },
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS.AREA_CD"]?.optionData;
            if (Array.isArray(optionData) && optionData.length > 0) {
              return optionData[0]?.CITY_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "CITY_CD",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS.AREA_CD"]?.optionData;
            if (Array.isArray(optionData) && optionData.length > 0) {
              return optionData[0]?.CITY_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "DISTRICT_ignoreField",
          label: "District Name",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS.AREA_CD"]?.optionData;
            if (Array.isArray(optionData) && optionData.length > 0) {
              return optionData[0]?.DISTRICT_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "DISTRICT_CD",
          label: "hidden district",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS.AREA_CD"]?.optionData;
            if (Array.isArray(optionData) && optionData.length > 0) {
              return optionData[0]?.DISTRICT_CD;
            } else return "";
          },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "STATE",
          label: "State",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS.AREA_CD"]?.optionData;
            if (Array.isArray(optionData) && optionData.length > 0) {
              return optionData[0]?.STATE_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "COUNTRY",
          label: "Country",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS.AREA_CD"]?.optionData;
            if (Array.isArray(optionData) && optionData.length > 0) {
              return optionData[0]?.COUNTRY_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "STATE_CD",
          label: "UnionTerritoriesCode",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS.AREA_CD"]?.optionData;
            if (Array.isArray(optionData) && optionData.length > 0) {
              return optionData[0]?.STATE_CD;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "COUNTRY_CD",
          label: "CountryCode",
          isReadOnly: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["OTHER_ADDRESS.AREA_CD"]?.optionData;
            if (Array.isArray(optionData) && optionData.length > 0) {
              return optionData[0]?.COUNTRY_CD;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "divider",
          },
          dividerText: "Contact",
          name: "ContactDivider_ignoreField",
          label: "ContactDivider",
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "STD_1",
          label: "PhoneO",
          placeholder: "",
          type: "text",
          maxLength: 5,
          GridProps: { xs: 12, sm: 4.5, md: 0.9, lg: 0.8, xl: 0.6 },
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 5) {
                return false;
              }
              return true;
            },
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CONTACT1",
          label: "",
          placeholder: "",
          maxLength: 20,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "SPACER",
          GridProps: {
            xs: 0,
            sm: 0.2,
            md: 0.1,
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "STD_2",
          label: "PhoneR",
          placeholder: "",
          maxLength: 5,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 5) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          GridProps: { xs: 12, sm: 4.5, md: 0.9, lg: 0.8, xl: 0.6 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CONTACT2",
          label: "",
          placeholder: "",
          maxLength: 20,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "SPACER",
          GridProps: {
            xs: 0,
            sm: 0.2,
            md: 0.1,
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "STD_3",
          label: "MobileNo",
          required: true,
          placeholder: "",
          maxLength: 3,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 3) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          GridProps: { xs: 12, sm: 4.5, md: 0.9, lg: 0.8, xl: 0.6 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CONTACT3",
          label: "",
          required: true,
          placeholder: "",
          maxLength: 20,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "spacer",
          },
          name: "SPACER",
          GridProps: {
            xs: 0,
            sm: 0.2,
            md: 0.1,
          },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "STD_4",
          label: "Fax",
          placeholder: "",
          maxLength: 5,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 5) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          GridProps: { xs: 12, sm: 4.5, md: 0.9, lg: 0.8, xl: 0.6 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CONTACT4",
          label: "",
          placeholder: "",
          maxLength: 20,
          FormatProps: {
            isAllowed: (values) => {
              if (values?.value?.length > 20) {
                return false;
              }
              return true;
            },
          },
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "E_MAIL_ID",
          label: "EmailId",
          placeholder: "",
          type: "text",
          txtTransform: "lowercase",
          maxLength: 60,
          validate: (columnValue, allField, flag) => {
            let emailRegex =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (columnValue?.value && !emailRegex.test(columnValue?.value)) {
              return "Please enter valid Email ID";
            }
            return "";
          },
          GridProps: { xs: 12, sm: 4, md: 3, lg: 3, xl: 3 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
          label: "Sr. No.",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 3, xl: 3 },
        },
      ],
    },
  ],
};
