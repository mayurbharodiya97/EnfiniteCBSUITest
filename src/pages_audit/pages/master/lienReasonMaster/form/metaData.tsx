import { t } from "i18next";

export const LienReasonMstFormMetaData = {
  form: {
    name: "lienReasonMaster",
    label: "LienReasonMaster",
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
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "REASON_CD",
      label: "Code",
      placeholder: "EnterCode",
      maxLength: 4,
      required: true,
      type: "text",
      autoComplete: "off",
      preventSpecialCharInput: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Codeisrequired"] }],
      },
      validate: (columnValue, ...rest) => {
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
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "REASON_NM",
      label: "Description",
      placeholder: "EnterDescription",
      maxLength: 50,
      required: true,
      type: "text",
      autoComplete: "off",
      txtTransform: "uppercase",
      preventSpecialCharInput: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Descriptionisrequired"] }],
      },
      validate: (columnValue, ...rest) => {
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
      GridProps: { xs: 12, sm: 12, md: 12, lg: 12, xl: 12 },
    },
  ],
};
