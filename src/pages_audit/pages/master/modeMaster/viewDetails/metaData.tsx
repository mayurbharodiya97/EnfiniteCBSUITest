import { DefaultValue } from "recoil";

export const metaData = {
  form: {
    name: "Mode Master",
    label: "Mode Master",
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
      name: "MODE_CD",
      label: "Mode",
      placeholder: "Mode",  
      maxLength: 4,
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Mode is Required"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 12, lg: 6, xl: 6 },
      __EDIT__: {isReadOnly:true},
    },
    {
      render: {
        componentType: "textField",
      },
      name: "MODE_NM",
      label: "Description",
      placeholder: "Description",
      maxLength: 50,
      type: "text",
      required: true,
      txtTransform:"uppercase",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Description is Required"] }],
      },
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 6, xl:6 },
     
    }, 
     {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromLeft",
      name: "MIN_NO_OF_JOINT",
      label: "Minimum No. of Joints",
      placeholder: "Minimum No. of Joints-",
      defaultValue:"00",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 6, xl:6 },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      className: "textInputFromLeft",
      name: "MAX_NO_OF_JOINT",
      label: "Maximum No. of Joints",
      placeholder: "Maximum No. of Joints-",
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: false,
        isAllowed: (values) => {
          if (values?.value?.length > 3) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
      GridProps: {  xs: 12, sm: 12, md: 12, lg: 6, xl:6 },
      
    },
  
  ],
};
