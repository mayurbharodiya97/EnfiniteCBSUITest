import { getChargeAllow, GetChargeTemplates } from "../api";

export const DynBillerChargeMetadata = {
  form: {
    name: "billerChargeForm",
    label: "Dynamic Biller Charge Configuration",
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
      name: "CATEGORY_ID",
      label: "Category ID",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Category ID is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Category ID."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 4,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SUB_CATEGORY_ID",
      label: "Sub Category ID",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Sub Category ID is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Sub Category ID."] },
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
        componentType: "textField",
      },
      name: "BILLER_ID",
      label: "Biller ID",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Biller ID is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Sub Biller ID."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
    {
      render: { componentType: "select" },
      name: "CHARGE_ALLOW",
      sequence: 2,
      label: "Charge",
      placeholder: "",
      GridProps: { xs: 12, md: 3, sm: 4 },
      fullWidth: true,
      //   required: true,
      //   validate: "getValidateValue",
      disableCaching: true,
      options: () => getChargeAllow(),
      _optionsKey: "getChargeAllow",
    },
    {
      render: { componentType: "select" },
      name: "CHRG_TEMP_TRAN_CD",
      sequence: 2,
      label: "Service Charge Template",
      placeholder: "",
      GridProps: { xs: 12, md: 3, sm: 4 },
      fullWidth: true,
      //   required: true,
      //   validate: "getValidateValue",
      disableCaching: true,
      options: () => GetChargeTemplates(),
      _optionsKey: "GetChargeTemplates",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "POOl_ACCT_NO",
      label: "Finacle Pool Account",
      placeholder: "",
      type: "text",
      maxLength: 20,
      // required: true,
      // schemaValidation: {
      //   type: "string",
      //   rules: [
      //     { name: "required", params: ["Biller ID is required."] },
      //     { name: "DATATYPE_CD", params: ["Please enter Sub Biller ID."] },
      //   ],
      // },
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
      name: "ABABIL_POOl_ACCT_NO",
      label: "Ababil Pool Account",
      placeholder: "",
      type: "text",
      maxLength: 20,
      // required: true,
      // schemaValidation: {
      //   type: "string",
      //   rules: [
      //     { name: "required", params: ["Biller ID is required."] },
      //     { name: "DATATYPE_CD", params: ["Please enter Sub Biller ID."] },
      //   ],
      // },
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
      name: "MERCHANT_ID",
      label: "Merchant ID",
      placeholder: "",
      type: "text",
      maxLength: 20,
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
      name: "TERMINAL_ID",
      label: "Terminal ID",
      placeholder: "",
      type: "text",
      maxLength: 20,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
  ],
};
