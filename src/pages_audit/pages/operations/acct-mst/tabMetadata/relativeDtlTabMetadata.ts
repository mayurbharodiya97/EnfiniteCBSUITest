import {
  DuplicationValidate,
  getPMISCData,
  getRangeOptions,
} from "../../c-kyc/api";
import * as API from "../api";

export const relativeDtl_tab_metadata = {
  form: {
    name: "relativeDtl_tab_form",
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
      name: "RELATIVE_DTL",
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
            componentType: "textField",
          },
          name: "NAME_OF_THE_FIRM",
          label: "Relative /Firm Name",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
          },
          GridProps: { xs: 12, sm: 4, md: 2, lg: 2, xl: 2 },
        },
        {
          render: {
            componentType: "dob",
          },
          name: "DATE_OF_BIRTH",
          label: "Birth Date",
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
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
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
          options: () => API.getMaritalStatusOP(),
          _optionsKey: "maritalMainOp",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          required: true,
          disableCaching: true,
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
            componentType: "textField",
          },
          name: "EDUCATIONAL_QUALIFICATION",
          label: "EduQualification",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "RELATIVE_CD",
          label: "Relationship",
          options: (dependentValue) =>
            getPMISCData("RELATIONSHIP", dependentValue),
          _optionsKey: "relationshipCurrentOp",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "checkbox",
          },
          defaultValue: false,
          name: "SALARIED",
          label: "Salaried",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "PASSPORT_NO",
          label: "Passport No.",
          placeholder: "",
          maxLength: 20,
          type: "text",
          txtTransform: "uppercase",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          validate: (columnValue, allField, flag) =>
            DuplicationValidate(columnValue, allField, flag, {
              PASSPORT_NO: columnValue.value,
            }),
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "EMAIL",
          label: "EmailId",
          isReadOnly: (fieldValue, dependentFields, formState) =>
            API.isReadOnlyonParam320({ formState }),
          placeholder: "",
          required: true,
          schemaValidation: {
            type: "string",
            rules: [{ name: "required", params: ["ThisFieldisrequired"] }],
          },
          maxLength: 60,
          // validate: (columnValue, allField, flag) => API.validateEmailID(columnValue),
          validate: (columnValue, allField, flag) => {
            let emailRegex =
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (columnValue.value && !emailRegex.test(columnValue.value)) {
              return "Please enter valid Email ID";
            }
            return "";
          },
          type: "text",
          txtTransform: "lowercase",
          GridProps: { xs: 12, sm: 4, md: 4, lg: 2.4, xl: 3 },
        },
        {
          render: {
            componentType: "checkbox",
          },
          defaultValue: false,
          name: "SELF_EMPLOYED",
          label: "Self Employed",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
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
          name: "NAME_OF_THE_EMPLOYER",
          label: "Employer Name",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "autocomplete",
          },
          name: "MONTHLY_HOUSEHOLD_INCOME",
          label: "Monthly Household Income",
          options: (dependentValue, formState, _, authState) =>
            getRangeOptions(authState?.companyID, authState?.user?.branchCode),
          _optionsKey: "monIncomeMainOp",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
        {
          render: {
            componentType: "textField",
          },
          name: "SELF_EMPLOYEED_DETAILS",
          label: "Self Emp. Details",
          placeholder: "",
          type: "text",
          GridProps: { xs: 12, sm: 4, md: 3, lg: 2.4, xl: 2 },
        },
      ],
    },
  ],
};
