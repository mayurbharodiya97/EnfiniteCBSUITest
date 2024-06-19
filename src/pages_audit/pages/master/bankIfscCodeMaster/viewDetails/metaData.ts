import { textTransform } from "@mui/system";

export const metaData = {
  form: {
    name: "Bank Ifsc Code Master(EMST/142)",
    label: "Bank Ifsc Code Master(EMST/142)",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
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
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "IFSC_CODE",
      label: "IFSC Code",
      placeholder: "IFSC Code",  
      maxLength: 11,
      txtTransform:"uppercase",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["IFSC Code is Required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 6, lg: 3, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_NM",
      label: "Bank Name",
      txtTransform:"uppercase",
      placeholder: "Bank Name",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Bank Name is Required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 12 },
    },
       {
      render: { componentType: "select" },
      name: "FACILITY",
      placeholder: "select parent type",
      label: "Facility",
      options: [
        { label: "Both ", value: "Y"},
        { label: "RTGS", value: "R"},
        { label: "NEFT ", value: "N"},
        { label: "None ", value: "I"},
      ],
      defaultValue:"Y",
      type: "text",
      GridProps: {  xs: 12, sm: 12, md: 6, lg: 3, xl:6 },
      fullWidth: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MICR_CODE",
      label: "MICR Code",
      placeholder: "MICR Code",
      maxLength: 16,
      type: "text",
      txtTransform:"uppercase",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 3, xl: 12 },
    },   {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_NM",
      label: "Branch Name",
      txtTransform:"uppercase",
      placeholder: "Branch Name",
      type: "text",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 3, xl: 12 },
    },   {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Add 1",
      txtTransform:"uppercase",
      placeholder: "Adddress 1",
      type: "text",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 12 },
    },   {
      render: {
        componentType: "textField",
      },
      name: "CONTACT_DTL",
      label: "Contact Detail",
      txtTransform:"uppercase",
      placeholder: "Contact Detail",
      maxLength: 10,
      type: "text",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 12 },
    },   {
      render: {
        componentType: "textField",
      },
      name: "CENTRE_NM",
      label: "Centre Name",
      placeholder: "Centre Name",
      txtTransform:"uppercase",
      type: "text",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 12 },
    },   {
      render: {
        componentType: "textField",
      },
      name: "DISTRICT_NM",
      label: "District Name",
      placeholder: "District Name",
      txtTransform:"uppercase",
      type: "text",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 12 },
    },   {
      render: {
        componentType: "textField",
      },
      name: "STATE_NM",
      label: "State Name",
      txtTransform:"uppercase",
      placeholder: "State Name",
      type: "text",
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 12 },
    },
  ],
};
