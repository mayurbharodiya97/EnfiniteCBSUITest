import { getCIBStatus } from "./api";
export const cibDetailMetadata = {
  form: {
    name: "cibDetail",
    label: "CIB Loan Request Check",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
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
      datetimePicker: {
        fullWidth: true,
      },
    },
  },
  fields: [
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
      name: "USER_NAME",
    },
    {
      render: {
        componentType: "typography",
      },
      name: "CIBVIEW",
      label: "CIB Calculation | View",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "LOAN_AMOUNT",
      label: "Applied Loan amount",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "amountField",
      },
      name: "EMI_AMOUNT",
      label: "Proposed EMI amount",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "LOAN_TENURE",
      label: "Applied Tenor",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "GENDER",
      label: "Gender",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "BIRTH_DATE",
      label: "DOB",
      placeholder: "",
      //type: "text",
      format: "dd/MM/yyyy",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BIRTH_PLACE",
      label: "District of Birth",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "NID_NO",
      label: "NID",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "E_TIN_NO",
      label: "E-TIN Number",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "APPLICANT_NM",
      label: "Applicant Name",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "FATHER_NAME",
      label: "Father Name",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MOBNO",
      label: "Mobile Number",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SMART_CARD_NO",
      label: "Smart Card Number",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SPOUSE_NAME",
      label: "Spouse Name",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MOTHER_NAME",
      label: "Mother Name",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PERMANENT_ADD",
      label: "Permanent Address",
      placeholder: "",
      isReadOnly: true,
      multiline: true,
      minRows: 2,
      maxRows: 2,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PRESENT_ADDRESS",
      label: "Present Address",
      placeholder: "",
      isReadOnly: true,
      multiline: true,
      minRows: 2,
      maxRows: 2,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "CIBINFO",
      label: "CIB User Information",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "CIB_STATUS",
      label: "CIB Status",
      placeholder: "Please select status",
      options: () => getCIBStatus(),
      defaultValue: "",
      required: true,
      //validate: "getValidateValue",
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["CIB Status is required."] },
          { name: "CIB_STATUS", params: ["Please select CIB Status."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "FILE_NAME",
      label: "Upload File",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      // required: true,
      // schemaValidation: {
      //   type: "string",
      //   rules: [{ name: "required", params: ["Upload File is required."] }],
      // },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CIB_REMARKS",
      label: "Description",
      placeholder: "Description",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is required."] }],
      },
      multiline: true,
      minRows: 2,
      maxRows: 2,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 8,
      },
    },
  ],
};
