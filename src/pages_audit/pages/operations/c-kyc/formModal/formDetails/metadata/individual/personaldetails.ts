import { GridMetaDataType } from "@acuteinfo/common-base";
import { differenceInYears } from "date-fns";
import * as API from "../../../../api";
export const personal_detail_prefix_data = {
  form: {
    name: "personal_detail_prefix_details_form",
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
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "divider",
        sequence: 1,
      },
      dividerText: "Prefix",
      name: "prefixDivider_ignoreField",
      label: "prefixDivider",
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 2,
      },
      name: "PREFIX_CD",
      label: "Prefix",
      // placeholder: "Prefix",
      options: () => API.GetDynamicSalutationData("Salutation"),
      _optionsKey: "PDPrefix",
      type: "text",
      required: true,
      // GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1 },
      GridProps: { xs: 12, sm: 4, md: 1, lg: 1, xl: 1 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      postValidationSetCrossFieldValues: (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field.value) {
          console.log("wefuuwiefwef", field?.optionData);
          return {
            // MOTHER_LAST_NM: {value: "", isFieldFocused:true},
            GENDER: { value: field?.optionData[0]?.SET_GENDER ?? "" },
            MARITAL_STATUS: {
              value: field?.optionData[0]?.SET_MARITIAL_STATUS ?? "",
            },
            // SURNAME: {value: "", isFieldFocused:true},
            // LAST_NM: {value: "", isFieldFocused:true},
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
      // GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:0.5},
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "textField",
        sequence: 3,
      },
      name: "FIRST_NM",
      label: "FirstName",
      // placeholder: "First Name",
      type: "text",
      txtTransform: "uppercase",
      maxLength: 50,
      // GridProps: {xs:4, sm:2},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 4,
      },
      name: "LAST_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
    },
    {
      render: {
        componentType: "textField",
        sequence: 6,
      },
      name: "SURNAME",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
    },
    {
      render: {
        componentType: "textField",
        sequence: 7,
      },
      name: "ACCT_NM",
      isReadOnly: true,
      label: "FullName",
      placeholder: "",
      dependentFields: ["FIRST_NM", "LAST_NM", "SURNAME"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let full_name = `${dependentFields?.FIRST_NM?.value} ${dependentFields?.LAST_NM?.value} ${dependentFields?.SURNAME?.value}`;
        return full_name;
      },
      type: "text",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 2.8, xl: 3 },
    },
    {
      render: {
        componentType: "formbutton",
        sequence: 7,
      },
      name: "SEARCH_BTN_ignoreField",
      label: "Search",
      endsIcon: "Search",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      dependentFields: ["ACCT_NM"],
      GridProps: { lg: 1, xl: 1 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 7,
      },
      name: "GENDER",
      label: "Gender",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      dependentFields: ["PREFIX_CD"],
      disableCaching: true,
      options: (dependentValue) => API.getGenderOp(dependentValue),
      _optionsKey: "genderOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 7,
      },
      name: "MARITAL_STATUS",
      label: "MaritalStatus",
      required: true,
      dependentFields: ["PREFIX_CD"],
      disableCaching: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      placeholder: "",
      options: (dependentValue) => API.getPMISCData("Marital", dependentValue),
      _optionsKey: "maritalStatus",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 8,
      },
      dividerText: "MaidenName",
      name: "maidenHeaderdivider_ignoreField",
      label: "maidenHeaderDivider",
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 9,
      },
      name: "MAIDEN_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDMaidenSalutation",
      defaultValue: "Miss",
      // placeholder: "Prefix",
      type: "text",
      // GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1},
      GridProps: { xs: 12, sm: 4, md: 1, lg: 1, xl: 1 },
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "textField",
        sequence: 10,
      },
      accessor: "MAIDEN_FIRST_NM",
      name: "MAIDEN_FIRST_NM",
      label: "FirstName",
      maxLength: 50,
      // placeholder: "First Name",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      // schemaValidation: {
      //     type: "string",
      //     rules: [
      //         {name: "required", params: ["field is required"]},
      //     ]
      // }
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 11,
      },
      name: "MAIDEN_MIDDLE_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      type: "text",
      txtTransform: "uppercase",
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 12,
      },
      name: "MAIDEN_LAST_NM",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      type: "text",
      txtTransform: "uppercase",
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
      },
      name: "SPACER",
      sequence: 14,
      GridProps: {
        xs: 12,
        //   sm: 12,
        //   md: 12,
      },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 14,
      },
      name: "FATHER_SPOUSE",
      label: "FatherOrSpuuseName",
      defaultValue: "01",
      options: [
        { label: "Father", value: "01" },
        { label: "Spouse", value: "02" },
      ],
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 2, lg: 1.5, xl: 2 },
      postValidationSetCrossFieldValues: (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field?.value == "01") {
          return { fatherHeaderDivider: { value: "Father Name" } };
        }
        if (field?.value == "02") {
          return { fatherHeaderDivider: { value: "Spouse Name" } };
        }
        return {};
      },
      runPostValidationHookAlways: true,
    },

    {
      render: {
        componentType: "divider",
        sequence: 15,
      },
      dividerText: "FatherName",
      name: "fatherHeaderDivider_ignoreField",
      label: "fatherHeaderDivider",
      dependentFields: ["FATHER_SPOUSE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        console.log(
          "setvalue divider",
          dependentFields?.FATHER_SPOUSE?.optionData[0]?.label
        );
        let dividerText = dependentFields?.FATHER_SPOUSE?.optionData[0]?.label
          ? `${dependentFields?.FATHER_SPOUSE?.optionData[0]?.label} Name`
          : null;
        return dividerText;
      },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 16,
      },
      name: "FATHER_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDFatherSalutation",
      defaultValue: "Mr",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 1, lg: 1, xl: 1 },
      // GridProps: {{xs:12, sm:4, md: 3, lg: 2.4, xl:2}},
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "textField",
        sequence: 17,
      },
      name: "FATHER_FIRST_NM",
      label: "FirstName",
      maxLength: 50,
      // placeholder: "First Name",
      type: "text",
      txtTransform: "uppercase",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 18,
      },
      name: "FATHER_MIDDLE_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 19,
      },
      name: "FATHER_LAST_NM",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 20,
      },
      dividerText: "MotherName",
      name: "motherHeaderDivider_ignoreField",
      label: "motherHeaderDivider",
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 21,
      },
      name: "MOTHER_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDMotherSalutation",
      defaultValue: "Mrs",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 1, lg: 1, xl: 1 },
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "textField",
        sequence: 22,
      },
      name: "MOTHER_FIRST_NM",
      label: "FirstName",
      maxLength: 50,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      // placeholder: "First Name",
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 23,
      },
      name: "MOTHER_MIDDLE_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 24,
      },
      name: "MOTHER_LAST_NM",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      validate: (columnValue, allField, flag) =>
        API.TrimSpaceValidation(columnValue, allField, flag),
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};
export const personal_other_detail_meta_data = {
  form: {
    name: "personal_other_details_form",
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
        componentType: "datePicker",
      },
      name: "BIRTH_DT",
      label: "DateOfBirth",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      // placeholder: "",
      // type: "datePicker",
      // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      maxDate: new Date(),
      format: "dd/MM/yyyy",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "AGE",
      label: "Age",
      isReadOnly: true,
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      dependentFields: ["BIRTH_DT"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let age = differenceInYears(
          new Date(),
          dependentFields?.BIRTH_DT?.value
        );
        if (Boolean(age)) {
          return age;
        } else return "";
      },
    },
    {
      render: {
        componentType: "select",
      },
      options: [
        { label: "Minor", value: "M" },
        { label: "Major", value: "J" },
      ],
      isReadOnly: true,
      dependentFields: ["BIRTH_DT"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        if (dependentFields?.BIRTH_DT?.value) {
          let age = differenceInYears(
            new Date(),
            dependentFields?.BIRTH_DT?.value
          );
          return Boolean(age) && age > 18 ? "J" : "M";
        } else return "";
      },
      name: "LF_NO",
      label: "Minor/Major",
      placeholder: "",
      type: "text",
      // GridProps: {xs: 4, sm:3},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "BLOOD_GRP_CD",
      label: "BloodGroup",
      placeholder: "",
      options: () => API.getPMISCData("Blood"),
      _optionsKey: "bloodGroup",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "NATIONALITY",
      label: "Nationality",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      placeholder: "",
      options: (dependentValue, formState, _, authState) =>
        API.getCountryOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "countryOptions",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "RESIDENCE_STATUS",
      label: "ResidenceStatus",
      required: true,
      placeholder: "",
      options: () => API.getPMISCData("RESIDE_STATUS"),
      _optionsKey: "ResisdenceStatus",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "TRADE_CD",
      label: "Occupation",
      options: (dependentValue, formState, _, authState) =>
        API.getOccupationDTL(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "occupationOp",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "GROUP_CD",
      label: "Group",
      placeholder: "",
      options: (dependentValue, formState, _, authState) =>
        API.getCustomerGroupOptions(
          authState?.companyID,
          authState?.user?.branchCode
        ),
      _optionsKey: "GroupOptions",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "COMMU_CD",
      label: "Religion",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      options: (dependentValue, formState, _, authState) =>
        API.getCommunityList(authState?.companyID, authState?.user?.branchCode),
      _optionsKey: "CommunityOptions",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "CASTE_CD",
      label: "Caste",
      placeholder: "",
      options: () => API.getPMISCData("CASTE_CD"),
      _optionsKey: "casteCD",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "KYC_REVIEW_DT",
      label: "KycRevisedDate",
      required: true,
      maxDate: new Date(),
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      // placeholder: "",
      // type: "datePicker",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "select",
      },
      options: () => API.getPMISCData("CKYC_RISK_CATEG"),
      _optionsKey: "ckycRiskCategOptions",
      name: "RISK_CATEG",
      label: "RiskCategory",
      // isReadOnly: true,
      // required: true,
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};

// controlling person  - individual details - view
export const personal_individual_detail_metadata = {
  form: {
    name: "personal_detail_controlling_form",
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
      Divider: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "divider",
        sequence: 1,
      },
      dividerText: "Prefix",
      name: "prefixDivider_ignoreField",
      label: "prefixDivider",
    },
    {
      render: {
        componentType: "select",
        sequence: 2,
      },
      name: "PREFIX_CD",
      label: "Prefix",
      // placeholder: "Prefix",
      options: () => API.GetDynamicSalutationData("Salutation"),
      _optionsKey: "PDPrefix",
      type: "text",
      // GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1 },
      GridProps: { xs: 12, sm: 4, md: 1, lg: 1, xl: 1 },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      postValidationSetCrossFieldValues: (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field.value) {
          return {
            GENDER: { value: field?.optionData[0]?.SET_GENDER ?? "" },
            MARITAL_STATUS: {
              value: field?.optionData[0]?.SET_MARITIAL_STATUS ?? "",
            },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
      // GridProps: {xs:12, sm:2, md: 1, lg: 1, xl:0.5},
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "textField",
        sequence: 3,
      },
      name: "FIRST_NM",
      label: "FirstName",
      // placeholder: "First Name",
      type: "text",
      maxLength: 50,
      // GridProps: {xs:4, sm:2},
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 4,
      },
      name: "LAST_NM",
      label: "MiddleName",
      maxLength: 50,
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 6,
      },
      name: "SURNAME",
      label: "LastName",
      maxLength: 50,
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 7,
      },
      name: "ACCT_NM",
      isReadOnly: true,
      label: "FullName",
      placeholder: "",
      dependentFields: ["FIRST_NM", "LAST_NM", "SURNAME"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let full_name = `${dependentFields?.FIRST_NM?.value} ${dependentFields?.LAST_NM?.value} ${dependentFields?.SURNAME?.value}`;
        return full_name;
      },
      type: "text",
      GridProps: { xs: 12, sm: 5, md: 4, lg: 2.8, xl: 3 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 7,
      },
      name: "GENDER",
      label: "Gender",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      dependentFields: ["PREFIX_CD"],
      disableCaching: true,
      options: (dependentValue) => API.getGenderOp(dependentValue),
      _optionsKey: "genderOp",
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 7,
      },
      name: "MARITAL_STATUS",
      label: "MaritalStatus",
      required: true,
      dependentFields: ["PREFIX_CD"],
      disableCaching: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      placeholder: "",
      options: (dependentValue) => API.getPMISCData("Marital", dependentValue),
      _optionsKey: "maritalStatus",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 8,
      },
      dividerText: "MaidenName",
      name: "maidenHeaderdivider_ignoreField",
      label: "maidenHeaderDivider",
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 9,
      },
      name: "MAIDEN_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDMaidenSalutation",
      defaultValue: "Miss",
      // placeholder: "Prefix",
      type: "text",
      // GridProps: {xs:12, sm:2.5, md: 2.5, lg: 1.5, xl: 1},
      GridProps: { xs: 12, sm: 4, md: 1, lg: 1, xl: 1 },
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "textField",
        sequence: 10,
      },
      accessor: "MAIDEN_FIRST_NM",
      name: "MAIDEN_FIRST_NM",
      label: "FirstName",
      // placeholder: "First Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
      // schemaValidation: {
      //     type: "string",
      //     rules: [
      //         {name: "required", params: ["field is required"]},
      //     ]
      // }
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 11,
      },
      name: "MAIDEN_MIDDLE_NM",
      label: "MiddleName",
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 12,
      },
      name: "MAIDEN_LAST_NM",
      label: "LastName",
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "spacer",
        sequence: 13,
      },
      sequence: 14,
      GridProps: {
        xs: 12,
        //   sm: 12,
        //   md: 12,
      },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 14,
      },
      name: "FATHER_SPOUSE",
      label: "FatherOrSpuuseName",
      defaultValue: "01",
      options: [
        { label: "Father", value: "01" },
        { label: "Spouse", value: "02" },
      ],
      placeholder: "",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 2, lg: 1.5, xl: 2 },
      postValidationSetCrossFieldValues: (
        field,
        __,
        ___,
        dependentFieldsValues
      ) => {
        if (field?.value == "01") {
          return { fatherHeaderDivider: { value: "Father Name" } };
        }
        if (field?.value == "02") {
          return { fatherHeaderDivider: { value: "Spouse Name" } };
        }
        return {};
      },
      runPostValidationHookAlways: true,
    },

    {
      render: {
        componentType: "divider",
        sequence: 15,
      },
      dividerText: "FatherName",
      name: "fatherHeaderDivider_ignoreField",
      label: "fatherHeaderDivider",
      // dependentFields: ["FATHER_SPOUSE"],
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //     console.log("setvalue divider", dependentFields?.FATHER_SPOUSE?.optionData[0]?.label)
      //     let dividerText = dependentFields?.FATHER_SPOUSE?.optionData[0]?.label ? `${dependentFields?.FATHER_SPOUSE?.optionData[0]?.label} Name` : null
      //     return dividerText;
      // },
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 16,
      },
      name: "FATHER_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDFatherSalutation",
      defaultValue: "Mr",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 1, lg: 1, xl: 1 },
      // GridProps: {{xs:12, sm:4, md: 3, lg: 2.4, xl:2}},
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "textField",
        sequence: 17,
      },
      name: "FATHER_FIRST_NM",
      label: "FirstName",
      // placeholder: "First Name",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 18,
      },
      name: "FATHER_MIDDLE_NM",
      label: "MiddleName",
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 19,
      },
      name: "FATHER_LAST_NM",
      label: "LastName",
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },

    {
      render: {
        componentType: "divider",
        sequence: 20,
      },
      dividerText: "MotherName",
      name: "motherHeaderDivider_ignoreField",
      label: "motherHeaderDivider",
    },
    {
      render: {
        componentType: "autocomplete",
        sequence: 21,
      },
      name: "MOTHER_PREFIX_CD",
      label: "Prefix",
      options: () => API.getPMISCData("Salutation"),
      _optionsKey: "PDMotherSalutation",
      defaultValue: "Mrs",
      // placeholder: "Prefix",
      type: "text",
      GridProps: { xs: 12, sm: 2.5, md: 1, lg: 1, xl: 1 },
      // dependentFields: ["DAILY_AMT"],
      // runValidationOnDependentFieldsChange: true,
      // validate: (currentField, dependentFields) => {
      //     if(Number(dependentFields?.DAILY_AMT?.value) >
      //     Number(currentField?.value)) {
      //         return "Weekly Limit should greater than or equal to Daily Limit";
      //     } else {
      //         return "";
      //     }
      // }
    },
    {
      render: {
        componentType: "textField",
        sequence: 22,
      },
      name: "MOTHER_FIRST_NM",
      label: "FirstName",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
      },
      // placeholder: "First Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
      // dependentFields: ["DAILY_AMT"],
    },
    {
      render: {
        componentType: "textField",
        sequence: 23,
      },
      name: "MOTHER_MIDDLE_NM",
      label: "MiddleName",
      // placeholder: "Middle Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
        sequence: 24,
      },
      name: "MOTHER_LAST_NM",
      label: "LastName",
      // placeholder: "Last Name",
      type: "text",
      GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
    },
  ],
};

// GRID METADATA
export const personal_document_details_data: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Customer Searching",
    rowIdColumn: "CUST_ID",
    defaultColumnConfig: {
      width: 150,
      maxWidth: 250,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: true,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [10, 20, 30],
    defaultPageSize: 10,
    containerHeight: {
      min: "42vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "DOCUMENT",
      columnName: "Document",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "IS_SUBMIT",
      columnName: "Submit",
      sequence: 3,
      alignment: "center",
      componentType: "editableCheckbox",
      isReadOnly: true,
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      accessor: "CUST_NAME",
      columnName: "Cust. Name",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "DOCUMENT_NO",
      columnName: "Document No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "VALID_TILL_DATE",
      columnName: "Valid till Date",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
  ],
};
export const DocumentGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Documents",
    rowIdColumn: "id",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableGlobalFilter: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "68vh",
      max: "68vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "DOCUMENT",
      columnName: "Document*",
      sequence: 2,
      alignment: "left",
      componentType: "editableSelect",
      // options: [{label: "label1", value: "value1"},{label: "label2", value: "value2"}],
      options: (dependentValue, formState, _, authState) => {
        // console.log("fwezzzzfeqw", dependentValue, formState, _, authState)
        // API.getDocumentTypes({COMP_CD: COMP_CD, CONSTITUTION: CONSTITUTION, CUST_TYPE: CUST_TYPE})
      },
      _optionsKey: "GetChargeTemplates",
      placeholder: "",
      width: 150,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "SUBMIT",
      columnName: "Submit",
      sequence: 3,
      alignment: "left",
      componentType: "editableCheckbox",
      placeholder: "",
      width: 100,
      minWidth: 150,
      maxWidth: 400,
    },
    {
      accessor: "DOCUMENT_NO",
      columnName: "Document No.",
      sequence: 4,
      alignment: "left",
      componentType: "editableTextField",
      placeholder: "",
      width: 200,
      minWidth: 100,
      maxWidth: 300,
      isReadOnly: true,
    },
    {
      accessor: "VALID_TILL_DATE",
      columnName: "Valid till Date",
      sequence: 8,
      alignment: "left",
      componentType: "editableDatePicker",
      dateFormat: "dd/MM/yyyy",
      defaultValue: new Date(),
      // options: () => GeneralAPI.GetChargeTemplates(),
      // options: [{label: "label1", value: "value1"},{label: "label2", value: "value2"}],
      // _optionsKey: "GetChargeTemplates",
      // placeholder: "",
      width: 250,
      minWidth: 250,
      maxWidth: 400,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 8,
      alignment: "left",
      componentType: "editableDatePicker",
      dateFormat: "dd/MM/yyyy",
      defaultValue: new Date(),
      placeholder: "",
      width: 250,
      minWidth: 250,
      maxWidth: 400,
    },
    {
      accessor: "BTN",
      columnName: "Action",
      componentType: "buttonRowCell",
      sequence: 9,
      buttonLabel: "Upload",
      isVisible: true,
      width: 140,
      minWidth: 140,
      maxWidth: 200,
      __EDIT__: { isVisible: true },
    },
    {
      columnName: "",
      componentType: "deleteRowCell",
      accessor: "SPECIAL_AMOUNT",
      sequence: 10,
      buttonLabel: "Special Amount",
      isVisible: true,
      width: 140,
      minWidth: 140,
      maxWidth: 200,
      // __EDIT__: { isVisible: true },
      // __VIEW__: { isVisible: true },
      // __NEW__: { isVisible: true },
    },
  ],
};

export const IdtpChargeConfigGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Documents",
    rowIdColumn: "SR_NO",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "68vh",
      max: "68vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "Sr.No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "DOCUMENT",
      columnName: "Document*",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 150,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "SUBMIT",
      columnName: "Submit",
      sequence: 3,
      alignment: "left",
      componentType: "editableCheckbox",
      placeholder: "",
      width: 100,
      minWidth: 150,
      maxWidth: 400,
    },
    {
      accessor: "DOCUMENT_NO",
      columnName: "Document No.",
      sequence: 4,
      alignment: "left",
      componentType: "editableTextField",
      placeholder: "",
      width: 200,
      minWidth: 100,
      maxWidth: 300,
      isReadOnly: true,
    },

    {
      accessor: "VALID_TILL_DATE",
      columnName: "Valid Till Date",
      sequence: 8,
      alignment: "left",
      componentType: "editableSelect",
      // options: () => GeneralAPI.GetChargeTemplates(),
      // _optionsKey: "GetChargeTemplates",
      placeholder: "",
      width: 170,
      minWidth: 80,
      maxWidth: 200,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 8,
      alignment: "left",
      componentType: "editableSelect",
      // options: () => GeneralAPI.GetChargeTemplates(),
      // _optionsKey: "GetChargeTemplates",
      placeholder: "",
      width: 170,
      minWidth: 80,
      maxWidth: 200,
    },
    // {
    //     accessor: "VAT_PERC",
    //     columnName: "VAT Percentage",
    //     sequence: 8,
    //     alignment: "left",
    //     componentType: "editableTextField",
    //     placeholder: "",
    //     width: 140,
    //     minWidth: 80,
    //     maxWidth: 200,
    // },
    {
      columnName: "Action",
      componentType: "deleteRowCell",
      accessor: "_hidden",
      sequence: 12,
    },
    {
      columnName: "",
      componentType: "buttonRowCell",
      accessor: "SPECIAL_AMOUNT",
      sequence: 11,
      buttonLabel: "Special Amount",
      isVisible: true,
      // __EDIT__: { isVisible: true },
    },
  ],
};
