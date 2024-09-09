import { textTransform } from "@mui/system";

export const metaData = {
  form: {
    name: "",
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
      label: "IFSCCode",
      placeholder: "IFSCCode",

      txtTransform: "uppercase",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["IFSCCodeisRequired"] }],
      },
      maxLength: 11,
      preventSpecialCharInput: true,
      // validationRun: "all",
      validate: (columnValue, ...rest) => {
        console.log(columnValue.value.length);

        if (columnValue.value.length < 11 || columnValue.value.length > 11) {
          return "IfscValidate"
        }
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BANK_NM",
      label: "BankName",
      txtTransform: "uppercase",
      placeholder: "BankName",
      type: "text",
      required: true,
      maxLength: 250,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["BankNameisRequired"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    },
    {
      render: { componentType: "select" },
      name: "FACILITY",
      placeholder: "Facility",
      label: "Facility",
      options: [
        { label: "Both ", value: "Y" },
        { label: "RTGS", value: "R" },
        { label: "NEFT ", value: "N" },
        { label: "None ", value: "I" },
      ],
      defaultValue: "Y",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
      fullWidth: true,
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MICR_CODE",
      label: "MICRCode",
      placeholder: "MICRCode",
      maxLength: 16,
      type: "text",
      txtTransform: "uppercase",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_NM",
      label: "BranchName",
      txtTransform: "uppercase",
      placeholder: "BranchName",
      maxLength: 110,
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Add1",
      txtTransform: "uppercase",
      placeholder: "Add1",
      maxLength: 500,
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    }, {
      render: {
        componentType: "phoneNumber",
      },
      name: "CONTACT_DTL",
      label: "ContactDetail",
      txtTransform: "uppercase",
      placeholder: "ContactDetail",
      maxLength: 10,
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "CENTRE_NM",
      label: "CentreName",
      placeholder: "CentreName",
      txtTransform: "uppercase",
      maxLength: 115,
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "DISTRICT_NM",
      label: "DistrictName",
      placeholder: "DistrictName",
      txtTransform: "uppercase",
      maxLength: 50,
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "STATE_NM",
      label: "StateName",
      txtTransform: "uppercase",
      placeholder: "StateName",
      maxLength: 50,
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    },
  ],
};
