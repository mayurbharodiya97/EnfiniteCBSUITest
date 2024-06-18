import { textTransform } from "@mui/system";

export const metaData = {
  form: {
    name: "Bank Ifsc Code Master(MST/142)",
    label: "Bank Ifsc Code Master(MST/142)",
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
      placeholder: "IFSC Code",

      txtTransform: "uppercase",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["IFSC Code is Required"] }],
      },
      validate: (columnValue, ...rest) => {
        const IFSC = columnValue.value;
        console.log(IFSC);
        if (IFSC.length < 11 || IFSC.length > 11) {
          return "IFSC code should be of eleven digits"
        }
        let specialChar = /^[^!&]*$/;
        if (columnValue?.value && !specialChar.test(columnValue.value)) {
          return "'!' and '&' not allowed";
        }
        return "";
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
      placeholder: "Bank Name",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Bank Name is Required"] }],
      },
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    },
    {
      render: { componentType: "select" },
      name: "FACILITY",
      placeholder: "select parent type",
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
      placeholder: "MICR Code",
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
      placeholder: "Branch Name",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 3, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Add1",
      txtTransform: "uppercase",
      placeholder: "Adddress 1",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "CONTACT_DTL",
      label: "ContactDetail",
      txtTransform: "uppercase",
      placeholder: "Contact Detail",
      maxLength: 10,
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "CENTRE_NM",
      label: "CentreName",
      placeholder: "Centre Name",
      txtTransform: "uppercase",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "DISTRICT_NM",
      label: "DistrictName",
      placeholder: "District Name",
      txtTransform: "uppercase",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    }, {
      render: {
        componentType: "textField",
      },
      name: "STATE_NM",
      label: "StateName",
      txtTransform: "uppercase",
      placeholder: "State Name",
      type: "text",
      GridProps: { xs: 12, sm: 6, md: 6, lg: 6, xl: 3 },
    },
  ],
};
