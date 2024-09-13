import { t } from "i18next";

export const AdvocateMstFormMetaData = {
  form: {
    name: "advocateMaster",
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
      phoneNumberOptional: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "CODE",
      label: "Code",
      placeholder: "EnterCode",
      type: "text",
      required: true,
      maxLength: 4,
      autoComplete: "off",
      isFieldFocused: true,
      __EDIT__: { isReadOnly: true },
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CodeisRequired"] }],
      },
      validate: (columnValue, ...rest) => {
        let regex = /^[^~`!@#$%^&*()\-+_=\\"';:?/<>,.{}[\]|]+$/;
        if (columnValue.value && !regex.test(columnValue.value)) {
          return "Specialcharacterisnotallowed";
        }
        const gridData = rest[1]?.gridData;
        const accessor: any = columnValue.fieldKey.split("/").pop();
        const fieldValue = columnValue.value?.trim().toLowerCase();
        const rowColumnValue = rest[1]?.rows?.[accessor]?.trim().toLowerCase();
        if (fieldValue === rowColumnValue) {
          return "";
        }
        if (gridData) {
          for (let i = 0; i < gridData.length; i++) {
            const ele = gridData[i];
            const trimmedColumnValue = ele?.[accessor]?.trim().toLowerCase();

            if (trimmedColumnValue === fieldValue) {
              return `${t(`DuplicateValidation`, {
                fieldValue: fieldValue,
                rowNumber: i + 1,
              })}`;
            }
          }
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DESCRIPTION",
      label: "AdvocateName",
      placeholder: "EnterAdvocateName",
      type: "text",
      autoComplete: "off",
      required: true,
      maxLength: 100,
      preventSpecialCharInput: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["AdvocateNameisrequired"] }],
      },
      validate: (columnValue, ...rest) => {
        const gridData = rest[1]?.gridData;
        console.log("grid", rest);
        const accessor: any = columnValue.fieldKey.split("/").pop();
        const fieldValue = columnValue.value?.trim().toLowerCase();
        const rowColumnValue = rest[1]?.rows?.[accessor]?.trim().toLowerCase();
        if (fieldValue === rowColumnValue) {
          return "";
        }
        if (gridData) {
          for (let i = 0; i < gridData.length; i++) {
            const ele = gridData[i];
            const trimmedColumnValue = ele?.[accessor]?.trim().toLowerCase();

            if (trimmedColumnValue === fieldValue) {
              return `${t(`DuplicateValidation`, {
                fieldValue: fieldValue,
                rowNumber: i + 1,
              })}`;
            }
          }
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "CONTACT1",
      label: "MobileNo",
      placeholder: "EnterMobileNo",
      required: true,
      maxLength: 10,
      fullWidth: true,
      autoComplete: "off",
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["MobileNoisRequired"] }],
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length <= 9) {
          return "The length of your Mobile Number is less than 10 character.";
        }
        return "";
      },
      GridProps: { xs: 12, sm: 4, md: 4, lg: 4, xl: 4 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Address",
      placeholder: "EnterAddress",
      autoComplete: "off",
      type: "text",
      maxLength: 100,
      preventSpecialCharInput: true,
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "EMAIL",
      label: "EmailID",
      placeholder: "EnterEmailID",
      type: "text",
      autoComplete: "off",
      preventSpecialCharInput: true,
      maxLength: 200,
      schemaValidation: {
        type: "string",
        rules: [{ name: "email", params: ["InvalidEmailID"] }],
      },
      GridProps: { xs: 12, sm: 12, md: 6, lg: 6, xl: 6 },
    },
  ],
};
