import { MetaDataType } from "components/dyanmicForm";

// if using FormWrapper

export const exportReportFormMetaData: MetaDataType = {
  form: {
    name: "exportReportForm",
    label: "Export Report form",
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
        componentType: "select",
      },
      name: "export_type",
      label: "Select file type",
      required: true,
      defaultValue: "EXCEL",
      defaultOptionLabel: "Select file tye",
      options: [
        { label: "EXCEL (.xlsx)", value: "EXCEL" },
        { label: "CSV (.csv)", value: "CSV" },
        { label: "PDF (.pdf)", value: "PDF" },
        { label: "PLAIN TEXT (.txt)", value: "TEXT" },
        { label: "XML (.xml)", value: "XML" },
        { label: "HTML (.html)", value: "HTML" },
      ],
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["File type is required."] }],
      },
      GridProps: {
        xs: 6,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      // __EDIT__: { isReadOnly: true },
      // __NEW__: { isReadOnly: false, isFieldFocused: true },
    },
    {
      render: {
        componentType: "select",
      },
      name: "page_size",
      label: "Select page size",
      defaultValue: "a4",
      defaultOptionLabel: "Select page size",
      dependentFields: ["export_type"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.export_type?.value === "PDF") {
          return false;
        }
        return true;
      },
      options: [
        { label: "A3", value: "a3" },
        { label: "A4", value: "a4" },
        { label: "A5", value: "a5" },
        { label: "A6", value: "a6" },
        { label: "Letter", value: "letter" },
        { label: "Legal", value: "legal" },
      ],
      GridProps: {
        xs: 6,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "orientation",
      label: "Select orientation",
      defaultValue: "portrait",
      defaultOptionLabel: "Select orientation",
      dependentFields: ["export_type"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (dependentFieldsValues?.export_type?.value === "PDF") {
          return false;
        }
        return true;
      },
      options: [
        { label: "Portrait", value: "portrait" },
        { label: "Landscape", value: "landscape" },
      ],
      GridProps: {
        xs: 6,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "checkbox",
      },
      name: "show_header",
      label: "Show Header",
      defaultValue: true,
      GridProps: { xs: 6, md: 3, sm: 3, xl: 3 },
      fullWidth: true,
      dependentFields: ["export_type"],
      shouldExclude: (_, dependentFieldsValues, __) => {
        if (
          dependentFieldsValues?.export_type?.value !== "XML" &&
          dependentFieldsValues?.export_type?.value !== "TEXT" &&
          dependentFieldsValues?.export_type?.value !== "CSV"
        ) {
          return false;
        }
        return true;
      },
    },
  ],
};
