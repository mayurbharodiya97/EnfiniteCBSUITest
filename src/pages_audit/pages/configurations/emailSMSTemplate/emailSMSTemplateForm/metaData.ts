import { GetEmailAcctConfigDD } from "./api";

export const EmailSMSTemplateFormMetadata = {
  form: {
    name: "emailSMSTemplateForm",
    label: "Email/SMS Template Configuration",
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
      name: "USER_MSG_TXT",
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
      name: "TRAN_CD",
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
      name: "COMP_CD",
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
      name: "MAIL_MSG",
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
      name: "MAIL_TYPE",
      label: "Tran. Type",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      required: true,
      GridProps: {
        xs: 12,
        md: 2,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "Description",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Description is required."] },
          { name: "DATATYPE_CD", params: ["Description Branch Name."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "EFFECTIVE_FROM_DT",
      label: "Effective From",
      format: "dd/MM/yyyy",
      placeholder: "dd/mm/yyyy",
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
      name: "MAIL_SUBJECT",
      label: "Mail Subject",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Mail Subject is required."] },
          { name: "MAIL_SUBJECT", params: ["Please enter Mail Subject."] },
        ],
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 9,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "SENDER_ID",
      label: "Sender Mail ID",
      placeholder: "",
      required: true,
      type: "text",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Sender Mail ID is required."] },
          { name: "email", params: ["Invalid Mail Sender Mail ID."] },
        ],
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CC_MAIL_ID",
      label: "CC Mail ID",
      placeholder: "",
      type: "text",
      autocomplate: "off",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 8,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DISPLAY_SENDER_NM",
      label: "Display Sender Name",
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
        componentType: "select",
      },
      name: "MAIL_SERVER",
      label: "Mail Server",
      placeholder: "",
      type: "text",
      options: "GetEmailAcctConfigDD",
      _optionsKey: "GetEmailAcctConfigDropDown",
      disableCaching: true,
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
      name: "MSG_FILE_PATH",
      label: "Mail Content File",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        md: 3,
        sm: 4,
      },
    },
  ],
};
