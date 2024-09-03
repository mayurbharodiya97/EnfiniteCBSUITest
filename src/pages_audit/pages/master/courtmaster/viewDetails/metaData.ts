import { t } from "i18next";
import { getCourtMasterArea } from "../api";

export const CourtMasterFormMetadata = {
  form: {
    name: "courtMaster",
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
          lg: 12,
          xl: 12,
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
      numberFormat: {
        fullWidth: true,
      },
      autocomplete: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "textField",
      },
      name: "COURT_CD",
      label: "Code",
      required: true,
      maxLength: 4,
      placeholder: "EnterCode",
      isFieldFocused: true,
      preventSpecialCharInput: true,
      validate: (columnValue, ...rest) => {
        // Duplication validation

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
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["CodeisRequired"] }],
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COURT_NAME",
      label: "CourtName",
      maxLength: 100,
      placeholder: "EnterCourtName",
      validate: (columnValue, ...rest) => {
        // Duplication validation
        const gridData = rest[1]?.gridData;
        const accessor: any = columnValue.fieldKey.split("/").pop();
        const fieldValue = columnValue.value?.trim().toLowerCase();
        const rowColumnValue = rest[1]?.rows?.[accessor]?.trim().toLowerCase();
        if (Boolean(columnValue?.value?.trim())) {
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
        }
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "autocomplete",
      },
      name: "AREA_CD",
      label: "Area",
      options: getCourtMasterArea,
      _optionsKey: "getCourtMasterArea",
      __VIEW__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "COUNTRY_NM",
      label: "Country",
      dependentFields: ["AREA_CD"],
      ignoreUpdate: true,
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields["AREA_CD"]?.optionData?.[0]?.COUNTRY_NM
          ? dependentFields["AREA_CD"]?.optionData?.[0]?.COUNTRY_NM
          : "";
      },
      isReadOnly: true,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "COUNTRY_CD",
      dependentFields: ["AREA_CD"],
      ignoreUpdate: true,

      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields["AREA_CD"]?.optionData?.[0]?.COUNTRY_CD
          ? dependentFields["AREA_CD"]?.optionData?.[0]?.COUNTRY_CD
          : "";
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "STATE_NM",
      label: "State",
      isReadOnly: true,
      ignoreUpdate: true,
      dependentFields: ["AREA_CD"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields["AREA_CD"]?.optionData?.[0]?.STATE_NM
          ? dependentFields["AREA_CD"]?.optionData?.[0]?.STATE_NM
          : "";
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "STATE_CD",
      dependentFields: ["AREA_CD"],
      ignoreUpdate: true,

      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields["AREA_CD"]?.optionData?.[0]?.STATE_CD
          ? dependentFields["AREA_CD"]?.optionData?.[0]?.STATE_CD
          : "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "DIST_NM",
      label: "District",
      isReadOnly: true,
      ignoreUpdate: true,
      dependentFields: ["AREA_CD"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields["AREA_CD"]?.optionData?.[0]?.DIST_NM
          ? dependentFields["AREA_CD"]?.optionData?.[0]?.DIST_NM
          : "";
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DIST_CD",
      dependentFields: ["AREA_CD"],
      ignoreUpdate: true,

      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields["AREA_CD"]?.optionData?.[0]?.DISTRICT_CD
          ? dependentFields["AREA_CD"]?.optionData?.[0]?.DISTRICT_CD
          : "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CITY_NM",
      label: "City",
      isReadOnly: true,
      ignoreUpdate: true,
      dependentFields: ["AREA_CD"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields["AREA_CD"]?.optionData?.[0]?.CITY_NM
          ? dependentFields["AREA_CD"]?.optionData?.[0]?.CITY_NM
          : "";
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CITY_CD",
      dependentFields: ["AREA_CD"],
      ignoreUpdate: true,

      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        return dependentFields["AREA_CD"]?.optionData?.[0]?.CITY_CD
          ? dependentFields["AREA_CD"]?.optionData?.[0]?.CITY_CD
          : "";
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PIN_CODE",
      label: "PinCode",
      fullWidth: true,
      placeholder: "EnterPinCode",

      validate: async (currentField, ...rest) => {
        if (rest?.[1]?.PinCode) {
          if (currentField?.value === "") {
            return "PincodeRequired";
          }
        }
        return "";
      },
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD1",
      label: "Address1",
      placeholder: "EnterAddress",
      maxLength: 100,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "ADD2",
      label: "Address2",
      placeholder: "EnterAddress",
      maxLength: 100,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT1",
      label: "Contact1",
      placeholder: "EnterContactNumber",
      maxLength: 20,
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT2",
      label: "Contact2",
      placeholder: "EnterContactNumber",
      maxLength: 20,
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "CONTACT3",
      label: "Contact3",
      placeholder: "EnterContactNumber",
      maxLength: 20,
      fullWidth: true,
      GridProps: {
        xs: 12,
        sm: 4,
        md: 3,
        lg: 3,
        xl: 3,
      },
    },
  ],
};
