import * as API from "../api";
import {
  AlphaNumericValidate,
  getOptionsOnPinParentArea,
} from "../../c-kyc/api";

export const guarantorjoint_tab_metadata = {
  form: {
    name: "guarantorjoint_tab_form",
    label: "",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "sequence",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 6,
        },
        container: {
          direction: "row",
          spacing: 0.5,
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
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "arrayField",
      },
      name: "JOINT_GUARANTOR_DTL",
      // fixedRows: 1,
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
      _fields: [
        {
          render: {
            componentType: "hidden",
          },
          name: "SR_CD",
          ignoreInSubmit: false,
          __NEW__: {
            ignoreInSubmit: true,
          },
        },
        {
          render: {
            componentType: "hidden",
          },
          defaultValue: "G   ",
          name: "J_TYPE",
        },
        {
          render: {
            componentType: "divider",
          },
          name: "referenceDivider_ignoreField",
          label: "Reference",
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "CUSTOMER_ID",
          label: "Customer ID",
          validate: (columnValue, allField, flag) => {
            if (!Boolean(columnValue?.value)) {
              return "this field is required";
            } else return "";
          },
          GridProps: { xs: 12, sm: 2, md: 2, lg: 2, xl: 2 },
          postValidationSetCrossFieldValues: async (
            field,
            formState,
            authState,
            dependentFieldsValues
          ) => {
            if (Boolean(field?.value)) {
              const data = await API.getCustomerData({
                CUSTOMER_ID: field.value,
                ACCT_TYPE: formState?.ACCT_TYPE ?? "",
                COMP_CD: authState?.companyID ?? "",
                SCREEN_REF: "MST/002",
              });
              let response_messages: any[] = [];
              if (data && data?.[0]?.MSG && Array.isArray(data?.[0]?.MSG)) {
                response_messages = data?.[0]?.MSG;
              }
              if (response_messages?.length > 0) {
                const messagebox = async (
                  msgTitle,
                  msg,
                  buttonNames,
                  status
                ) => {
                  let buttonName = await formState.MessageBox({
                    messageTitle: msgTitle,
                    message: msg,
                    buttonNames: buttonNames,
                    icon:
                      status === "9"
                        ? "WARNING"
                        : status === "99"
                        ? "CONFIRM"
                        : status === "999"
                        ? "ERROR"
                        : status === "0" && "SUCCESS",
                  });
                  return { buttonName, status };
                };

                for (let i = 0; i < response_messages?.length; i++) {
                  if (response_messages[i]?.O_STATUS !== "0") {
                    let btnName = await messagebox(
                      response_messages[i]?.O_STATUS === "999"
                        ? "ValidationFailed"
                        : response_messages[i]?.O_STATUS === "99"
                        ? "Confirmation"
                        : "Alert",
                      response_messages[i]?.O_MESSAGE,
                      response_messages[i]?.O_STATUS === "99"
                        ? ["Yes", "No"]
                        : ["Ok"],
                      response_messages[i]?.O_STATUS
                    );
                    if (
                      btnName?.status === "999" ||
                      btnName?.buttonName === "No"
                    ) {
                      return {
                        CUSTOMER_ID: { value: "" },
                      };
                    }
                  } else {
                    if (data?.[0]?.ACCOUNT_DTL) {
                      const CustomerData = data?.[0]?.ACCOUNT_DTL;
                      return {
                        REMARKS: { value: CustomerData?.REMARKS },
                        PIN_CODE: { value: CustomerData?.PIN_CODE },
                        COUNTRY_CD: { value: CustomerData?.COUNTRY_CD },
                        AREA_CD: { value: CustomerData?.AREA_CD },
                        // CUSTOMER_ID: {value: CustomerData?.CUSTOMER_ID},
                        CITY_CD: { value: CustomerData?.CITY_CD },
                        MEM_ACCT_TYPE: { value: CustomerData?.MEM_ACCT_TYPE },
                        ACCT_NM: { value: CustomerData?.ACCT_NM },
                        UNIQUE_ID: { value: CustomerData?.UNIQUE_ID },
                        ADD3: { value: CustomerData?.ADD3 },
                        ADD1: { value: CustomerData?.ADD1 },
                        ADD2: { value: CustomerData?.ADD2 },
                        STATE_CD: { value: CustomerData?.STATE_CD },
                        MEM_ACCT_CD: { value: CustomerData?.MEM_ACCT_CD },
                        DIST_CD: { value: CustomerData?.DISTRICT_CD },
                        GENDER: { value: CustomerData?.GENDER },
                        DIN_NO: { value: CustomerData?.DIN_NO },
                        FORM_60: { value: CustomerData?.FORM_60 },
                        PAN_NO: { value: CustomerData?.PAN_NO },
                      };
                    }
                  }
                }
              }
            } else {
              return {
                REMARKS: { value: "" },
                PIN_CODE: { value: "" },
                COUNTRY_CD: { value: "" },
                AREA_CD: { value: "" },
                // CUSTOMER_ID: {value: ""},
                CITY_CD: { value: "" },
                MEM_ACCT_TYPE: { value: "" },
                ACCT_NM: { value: "" },
                UNIQUE_ID: { value: "" },
                ADD3: { value: "" },
                ADD1: { value: "" },
                ADD2: { value: "" },
                STATE_CD: { value: "" },
                MEM_ACCT_CD: { value: "" },
                DIST_CD: { value: "" },
                GENDER: { value: "" },
                DIN_NO: { value: "" },
                FORM_60: { value: "" },
                PAN_NO: { value: "" },
              };
            }
          },
        },
        // {
        //     render: {
        //         componentType: "typography"
        //     },
        //     name: "INTRODUCTOR",
        //     label: "Introductor A/C"
        // },
        // {
        //     render: {
        //         componentType: "autocomplete"
        //     },
        //     name: "NG_RELATION",
        //     label: "Guardian Relation",
        //     options: [], //api
        //     _optionsKey: "",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "checkbox"
        //     },
        //     name: "ACTIVE",
        //     label: "Active",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "datePicker"
        //     },
        //     name: "EVENT_DT",
        //     label: "Date",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "numberFormat"
        //     },
        //     name: "NG_CUSTOMER_ID",
        //     label: "Guardian Customer Id",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "textField"
        //     },
        //     name: "NG_NAME",
        //     label: "Guardian Name",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        {
          render: {
            componentType: "divider",
          },
          name: "introductorDivider_ignoreField",
          label: "Introductor",
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_COMP_CD",
          label: "A/C No.",
          placeholder: "COMP CD",
          maxLength: 4,
          GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_BRANCH_CD",
          label: "",
          placeholder: "BRANCH CD",
          maxLength: 4,
          GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_ACCT_TYPE",
          label: "",
          placeholder: "A/C Type",
          maxLength: 4,
          GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_ACCT_CD",
          label: "",
          placeholder: "A/C No.",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
          },
          maxLength: 8,
          GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "divider",
          },
          name: "MembershipDivider_ignoreField",
          label: "Membership",
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "MEM_ACCT_TYPE",
          label: "A/C No.",
          placeholder: "COMP CD",
          maxLength: 4,
          GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "MEM_ACCT_CD",
          label: "",
          placeholder: "BRANCH CD",
          maxLength: 4,
          GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "SHARE_ACCT_TYPE",
          label: "",
          placeholder: "A/C Type",
          maxLength: 4,
          GridProps: { xs: 12, sm: 2, md: 1, lg: 1, xl: 1 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "SHARE_ACCT_CD",
          label: "",
          placeholder: "A/C No.",
          maxLength: 8,
          GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "ACCT_NM",
          label: "",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 3, md: 2, lg: 2, xl: 1.5 },
        },
        {
          render: {
            componentType: "formbutton",
          },
          name: "CRDT_WORTHINESS_ignoreField",
          label: "Credit Worthiness",
          type: "text",
          GridProps: { lg: 1, xl: 1 },
        },

        {
          render: {
            componentType: "divider",
          },
          name: "PersonaldtlDivider_ignoreField",
          label: "",
          GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REF_PERSON_NAME",
          label: "Person Name",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "dob",
          },
          name: "BIRTH_DATE",
          label: "Birth Date",
          maxDate: new Date(),
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "GENDER",
          label: "Gender",
          options: [
            { label: "MALE", value: "M" },
            { label: "FEMALE", value: "F" },
            { label: "OTHER", value: "O" },
            { label: "TRANSGENDER", value: "T" },
          ],
          // dependentFields: ["PREFIX_CD"],
          // disableCaching: true,
          // // options: (dependentValue) => API.getGenderOp(dependentValue),
          // _optionsKey: "genderOp",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "DESIGNATION",
          label: "Designation/Relation",
          options: (dependentValue, formState, _, authState) =>
            API.getGuardianorRelationTypeOp({
              COMP_CD: authState?.companyID,
              BRANCH_CD: authState?.user?.branchCode,
            }),
          _optionsKey: "designGuarantorOp",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
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
            AlphaNumericValidate(columnValue),
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
            AlphaNumericValidate(columnValue),
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
            AlphaNumericValidate(columnValue),
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
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
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
            const PIN = columnValue.value;
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
            componentType: "select",
          },
          runPostValidationHookAlways: false,
          name: "AREA_CD",
          label: "SubArea",
          dependentFields: ["PIN_CODE"],
          disableCaching: true,
          options: (dependentValue, formState, _, authState) =>
            getOptionsOnPinParentArea(
              _?.["JOINT_GUARANTOR_DTL.PIN_CODE"]?.value,
              formState,
              _,
              authState
            ),
          _optionsKey: "indSubareaMaiwejfjwefnOpjoint",
          setValueOnDependentFieldsChange: (dependentFields) => {
            const pincode = dependentFields["JOINT_GUARANTOR_DTL.PIN_CODE"];
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
            if (field.value) {
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
                DIST_CD: {
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
              dependentFields?.["JOINT_GUARANTOR_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].CITY_NM;
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
              dependentFields?.["JOINT_GUARANTOR_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].CITY_CD;
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
              dependentFields?.["JOINT_GUARANTOR_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].DISTRICT_NM;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "hidden",
          },
          name: "DIST_CD",
          label: "hidden district",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_GUARANTOR_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].DISTRICT_CD;
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
          ignoreInSubmit: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_GUARANTOR_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].STATE_NM;
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
          ignoreInSubmit: true,
          placeholder: "",
          type: "text",
          dependentFields: ["AREA_CD"],
          setValueOnDependentFieldsChange: (dependentFields) => {
            const optionData =
              dependentFields?.["JOINT_GUARANTOR_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].COUNTRY_NM;
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
              dependentFields?.["JOINT_GUARANTOR_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].STATE_CD;
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
              dependentFields?.["JOINT_GUARANTOR_DTL.AREA_CD"].optionData;
            if (optionData && optionData.length > 0) {
              return optionData[0].COUNTRY_CD;
            } else return "";
          },
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "CKYC_NUMBER",
          label: "CKYC No",
          isReadOnly: true,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "MOBILE_NO",
          label: "Mobile No.",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          // maxLength: 20,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "numberFormat",
          },
          name: "PHONE",
          label: "Phone",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          // maxLength: 20,
          GridProps: { xs: 12, sm: 4, md: 2.4, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "aadharCard",
          },
          name: "UNIQUE_ID",
          label: "UIDAadhaar",
          placeholder: "1111 1111 1111",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          required: true,
          type: "text",
          maxLength: 12,
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
          },
          // validate: (columnValue, allField, flag) => API.validateUniqueId(columnValue, allField, flag),
          // disableCaching: true,
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "FORM_60",
          label: "Form6061",
          placeholder: "",
          defaultValue: "N",
          type: "text",
          // isFieldFocused: true,
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
          options: [
            { label: "Form 61", value: "F" },
            { label: "No", value: "N" },
          ],
        },
        {
          render: {
            componentType: "panCard",
          },
          name: "PAN_NO",
          label: "PanNo",
          placeholder: "AAAAA1111A",
          type: "text",
          txtTransform: "uppercase",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          required: true,
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
          schemaValidation: {
            type: "string",
            rules: [
              { name: "required", params: ["ThisFieldisrequired"] },
              {
                name: "pancard",
                params: ["Please Enter Valid PAN Number"],
              },
            ],
          },
          // validate: (columnValue, allField, flag) => API.validatePAN(columnValue, allField, flag),
          maxLength: 10,
        },
        {
          render: {
            componentType: "textField",
          },
          name: "REMARKS",
          label: "Remarks",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          maxLength: 300,
          GridProps: { xs: 12, sm: 6, md: 6, lg: 4.7, xl: 4 },
        },
        // {
        //     render: {
        //         componentType: "datePicker"
        //     },
        //     name: "",
        //     label: "Date of Death",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        // },

        // {
        //     render:  {
        //         componentType: "Divider",
        //     },
        //     dividerText: "Mortgage/Hypothication/Security Detail",
        //     name: "MortgageDivider_ignoreField",
        //     label: "MortgageDivider"
        // },
        // {
        //     render: {
        //         componentType: "textField"
        //     },
        //     name: "mort_description",
        //     label: "Description",
        //     maxLength: 200,
        //     GridProps: {xs:12, sm:6, md: 6, lg: 4.7, xl:4}
        // },
        // {
        //     render: {
        //     componentType: "formbutton",
        //     },
        //     name: "PROPERTY_ignoreField",
        //     label: "PROPERTY",
        //     type: "text",
        //     GridProps: {lg: 1, xl:1},
        // },
        // {
        //     render: {
        //         componentType: "autocomplete"
        //     },
        //     name: "MORT_TYPE",
        //     label: "Mort. Type",
        //     options: [],
        //     _optionsKey: "",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "autocomplete"
        //     },
        //     name: "SECURITY_TYPE",
        //     label: "Security Type",
        //     options: [
        //         {label: "Prime", value: "P"},
        //         {label: "Collateral", value: "C"},
        //     ],
        //     _optionsKey: "",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "autocomplete"
        //     },
        //     name: "SECURITY_CD",
        //     label: "Security",
        //     options: [],
        //     _optionsKey: "",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //     componentType: "formbutton",
        //     },
        //     name: "OTHRSECURITY_ignoreField",
        //     label: "OTHER SECURITY",
        //     type: "text",
        //     GridProps: {lg: 1, xl:1},
        // },
        // {
        //     render: {
        //         componentType: "numberFormat"
        //     },
        //     name: "MORT_AMT",
        //     label: "Cost/Value",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render:  {
        //         componentType: "Divider",
        //     },
        //     dividerText: "Valuer",
        //     name: "ValuerDivider_ignoreField",
        //     label: "ValuerDivider"
        // },
        // {
        //     render: {
        //         componentType: "autocomplete"
        //     },
        //     name: "VALUER_CODE",
        //     label: "Name",
        //     options: [],
        //     _optionsKey: "",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "datePicker"
        //     },
        //     name: "VALUATION_DT",
        //     label: "Valuation Date",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        // },
        // {
        //     render: {
        //     componentType: "formbutton",
        //     },
        //     name: "MACHINERY_ignoreField",
        //     label: "MACHINERY",
        //     type: "text",
        //     GridProps: {lg: 1, xl:1},
        // },
        // {
        //     render: {
        //         componentType: "numberFormat"
        //     },
        //     name: "VALUE_AMT",
        //     label: "Value",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render:  {
        //         componentType: "Divider",
        //     },
        //     dividerText: "Title Clearance",
        //     name: "TitleClearanceDivider_ignoreField",
        //     label: "TitleClearanceDivider"
        // },
        // {
        //     render: {
        //         componentType: "autocomplete"
        //     },
        //     name: "ADVOCATE_CODE",
        //     label: "Advocate",
        //     options: [],
        //     _optionsKey: "",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2}
        // },
        // {
        //     render: {
        //         componentType: "datePicker"
        //     },
        //     name: "TITLE_CLEAR_DT",
        //     label: "Clearance Date",
        //     GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        // },
      ],
    },
  ],
};
