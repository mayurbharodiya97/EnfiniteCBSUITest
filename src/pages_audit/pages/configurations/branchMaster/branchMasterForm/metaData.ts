import { GetDistrictList } from "./api";

export const BranchMasterFormMetadata = {
  form: {
    name: "branchMSTForm",
    label: "Branch Master",
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
        componentType: "textField",
      },
      name: "BRANCH_CD",
      label: "Branch Code",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Branch Code is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Branch Code."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 1,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_NM",
      label: "Branch Name",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Branch Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Branch Name."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 5,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "BR_OPEN_DT",
      label: "Open Date",
      format: "dd/MM/yyyy",
      placeholder: "dd/mm/yyyy",
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
      name: "E_MAIL_ID",
      label: "E-Mail",
      placeholder: "",
      type: "text",
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
      name: "CONTACT1",
      label: "Phone(1)",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Phone(1) is required."] },
          { name: "PARA_VALUE", params: ["Please enter Phone(1)."] },
        ],
      },
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
      name: "CONTACT2",
      label: "Phone(2)",
      placeholder: "",
      type: "text",
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
      name: "LATITUDE",
      label: "Latitude",
      placeholder: "",
      type: "text",
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
      name: "LONGITUDE",
      label: "Longitude",
      placeholder: "",
      type: "text",
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
      name: "ADD1",
      label: "Address",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Address is required."] },
          { name: "PARA_VALUE", params: ["Please enter Address."] },
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
        componentType: "select",
      },
      name: "DIST_CD",
      label: "District",
      placeholder: "",
      type: "text",
      options: () => GetDistrictList(),
      _optionsKey: "GetDistrictList",
      required: true,
      disableCaching: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["District is required."] }],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "FD_ENABLED",
      label: "FD Allow",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "DPS_ENABLED",
      label: "DPS Allow",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "CHQ_BOOK_ENABLED",
      label: "Cheque Book Allow",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "PAY_ORDER_ENABLED",
      label: "Pay Order Allow",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "CONTACTPERSON",
      label: "Contact Person/Branch Manager Details",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT_PERSON",
      label: "Contact Person",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "MOBILE_NO",
      label: "Mobile Number",
      placeholder: "",
      type: "text",
      StartAdornment: "+00",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
      schemaValidation: {
        type: "string",
        rules: [{ name: "max", params: [11, "Mobile No should be 11 digit."] }],
      },
      validate: ({ value }) => {
        if (Boolean(value) && value.length < 11) {
          return "Mobile No should be 11 digit.";
        }
        return "";
      },
      FormatProps: {
        format: "###########",
        allowNegative: false,
        allowLeadingZeros: true,
        isNumericString: true,
        isAllowed: (values) => {
          if (values?.value?.length > 11) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "ACTIVE",
      label: "Active",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "COMP_CD",
      label: "Company Code",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
  ],
};

export const BranchMasterAddFormMetadata = {
  form: {
    name: "branchMSTForm",
    label: "Branch Master",
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
    // {
    //   render: {
    //     componentType: "typography",
    //   },
    //   name: "BRANCH",
    //   label: "Branch",
    //   GridProps: {
    //     xs: 12,
    //     md: 12,
    //     sm: 12,
    //   },
    // },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_CD",
      label: "Branch Code",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Branch Code is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Branch Code."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 1,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "BRANCH_NM",
      label: "Branch Name",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Branch Name is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Branch Name."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 5,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "BR_OPEN_DT",
      label: "Open Date",
      format: "dd/MM/yyyy",
      placeholder: "dd/mm/yyyy",
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
      name: "E_MAIL_ID",
      label: "E-Mail",
      placeholder: "",
      type: "text",
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
      name: "CONTACT1",
      label: "Phone(1)",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Phone(1) is required."] },
          { name: "PARA_VALUE", params: ["Please enter Phone(1)."] },
        ],
      },
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
      name: "CONTACT2",
      label: "Phone(2)",
      placeholder: "",
      type: "text",
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
      name: "LATITUDE",
      label: "Latitude",
      placeholder: "",
      type: "text",
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
      name: "LONGITUDE",
      label: "Longitude",
      placeholder: "",
      type: "text",
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
      name: "ADD1",
      label: "Address",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Address is required."] },
          { name: "PARA_VALUE", params: ["Please enter Address."] },
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
        componentType: "select",
      },
      name: "DIST_CD",
      label: "District",
      placeholder: "",
      type: "text",
      options: () => GetDistrictList(),
      _optionsKey: "GetDistrictList",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["District is required."] },
          { name: "PARA_VALUE", params: ["Please enter District."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "FD_ENABLED",
      label: "FD Allow",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "DPS_ENABLED",
      label: "DPS Allow",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "CHQ_BOOK_ENABLED",
      label: "Cheque Book Allow",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "PAY_ORDER_ENABLED",
      label: "Pay Order Allow",
      defaultValue: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 2,
      },
    },
    {
      render: {
        componentType: "typography",
      },
      name: "CONTACTPERSON",
      label: "Contact Person/Branch Manager Details",
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT_PERSON",
      label: "Contact Person",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "phoneNumber",
      },
      name: "MOBILE_NO",
      label: "Mobile Number",
      placeholder: "",
      type: "text",
      StartAdornment: "+88",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "min", params: [11, "Mobile No should be 11 digit."] },
          { name: "max", params: [11, "Mobile No should be 11 digit."] },
        ],
      },
    },
  ],
};
