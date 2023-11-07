import { GeneralAPI } from "registry/fns/functions";
export const jointViewDetailMetaData = {
  form: {
    name: "footerForm",
    label: "footer form1",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",

    render: {
      ordering: "sequence",
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
        componentType: "typography",
      },
      name: "reference",
      label: "Reference",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CustType",
      label: "CustType",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "date",
      label: "Date",
      placeholder: "",

      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor ",
      label: "Introductor A/C",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor2",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor3",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor4",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    //member
    {
      render: {
        componentType: "typography",
      },
      name: "memberShip",
      label: "Membership",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor6 ",
      label: "Introductor A/C",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor8",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor90",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Introductor32",
      label: "",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Share",
      label: "Share%",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    //personal
    {
      render: {
        componentType: "typography",
      },
      name: "personal",
      label: "Personal Details",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Person21",
      label: "Person Name",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Gender",
      label: "Gender",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Designation",
      label: "Designation",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Designation11",
      label: "Line1",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Designation32",
      label: "Line2",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Designation123",
      label: "Line3",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Mobile1",
      label: "Mobile No.",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Phone1",
      label: "Phone",
      placeholder: "",
      type: "text",
      fullWidth: false,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "UniqueId",
      label: "Unique ID",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "form",
      label: "Form 60/61",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "din",
      label: "DIN",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    //remarks
    {
      render: {
        componentType: "typography",
      },
      name: "remarks",
      label: "",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Remarks1",
      label: "Remarks",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CKYC",
      label: "CKYC No",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    //mortgage
    {
      render: {
        componentType: "typography",
      },
      name: "mortgage",
      label: "Mortgage/Hypothication/Security Detail",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Descriptionr4",
      label: "Description",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Mort",
      label: "Mort Type",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "cost",
      label: "Cost/Value",
      placeholder: "",
      type: "text",
      required: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Security",
      label: "Security Type",
      placeholder: "",
      type: "text",
      fullWidth: false,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "Security1",
      label: "Security ",
      placeholder: "",
      type: "text",
      fullWidth: false,
      isReadOnly: true,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    //valuer
    {
      render: {
        componentType: "typography",
      },
      name: "valuer",
      label: "Valuer",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Name456",
      label: "Name",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "Valuation_date",
      // sequence: 9,
      label: "Valuation Date",
      placeholder: "",

      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "value2",
      label: "Value",
      placeholder: "",
      type: "text",
      fullWidth: false,
      // required: true,
      // maxLength: 2,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    //clearance
    {
      render: {
        componentType: "typography",
      },
      name: "clearance",
      label: "Clearance",
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "Advocate",
      label: "Advocate",
      placeholder: "",
      type: "text",
      fullWidth: false,
      width: "xs",
      // isReadOnly: true,
      // required: true,
      // maxLength: 1,
      GridProps: { xs: 12, sm: 2.5, md: 2.5, lg: 1.5, xl: 2 },
    },
    // {
    //   render: { componentType: "formbutton", group: 0 },
    //   name: "ok",
    //   sequence: 4,
    //   label: "ok",
    //   maxLength: 20,
    //   GridProps: { xs: 12, md: 2, sm: 2 },
    //   fullWidth: true,
    //   // __VIEW__: { isReadOnly: true },
    //   // __EDIT__: { isReadOnly: false },
    // },
    // {
    //   render: { componentType: "formbutton", group: 0 },
    //   name: "cancel",
    //   sequence: 4,
    //   label: "cancel",
    //   maxLength: 20,
    //   GridProps: { xs: 12, md: 2, sm: 2 },
    //   fullWidth: true,
    //   // __VIEW__: { isReadOnly: true },
    //   // __EDIT__: { isReadOnly: false },
    // },
  ],
};
