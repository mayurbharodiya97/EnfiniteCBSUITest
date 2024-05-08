import { utilFunction } from "components/utils";
import { getCourtMasterArea } from "../api";

export const CourtMasterFormMetadata = {
  form: {
    name: "courtMaster",
    label: "Court Master",
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
      txtTransform: "uppercase",
      placeholder: "Enter Code",
      isFieldFocused: true,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["Code is required."] }],
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
      label: "Court Name",
      maxLength: 100,
      placeholder: "Enter Court Name",
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
      name: "AREA_NM",
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
      dependentFields: ["AREA_NM"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        if (dependentFields["AREA_NM"]?.optionData?.[0]?.COUNTRY_NM) {
          return dependentFields["AREA_NM"]?.optionData?.[0]?.COUNTRY_NM;
        } else if (!dependentFields["AREA_NM"]?.optionData?.[0]?.COUNTRY_NM) {
          return "";
        }
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
        componentType: "textField",
      },
      name: "STATE_NM",
      label: "State",
      isReadOnly: true,
      dependentFields: ["AREA_NM"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        if (dependentFields["AREA_NM"]?.optionData?.[0]?.STATE_NM) {
          return dependentFields["AREA_NM"]?.optionData?.[0]?.STATE_NM;
        } else {
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
        componentType: "textField",
      },
      name: "DIST_NM",
      label: "District",
      isReadOnly: true,
      dependentFields: ["AREA_NM"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        if (dependentFields["AREA_NM"]?.optionData?.[0]?.DIST_NM) {
          return dependentFields["AREA_NM"]?.optionData?.[0]?.DIST_NM;
        } else {
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
        componentType: "textField",
      },
      name: "CITY_NM",
      label: "City",
      isReadOnly: true,
      dependentFields: ["AREA_NM"],
      runValidationOnDependentFieldsChange: true,
      setValueOnDependentFieldsChange: (dependentFields) => {
        if (dependentFields["AREA_NM"]?.optionData?.[0]?.CITY_NM) {
          return dependentFields["AREA_NM"]?.optionData?.[0]?.CITY_NM;
        } else {
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
        componentType: "numberFormat",
      },
      name: "PIN_CODE",
      label: "Pin Code",
      fullWidth: true,
      placeholder: "Enter Area Pin Code",
      maxLength: 6,
      FormatProps: {
        format: "######",
        isAllowed: (values) => {
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
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
      label: "Address 1",
      placeholder: "Enter Address",
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
      label: "Address 2",
      placeholder: "Enter Address",
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
      label: "Contact 1",
      placeholder: "Enter Contact Number",
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
      label: "Contact 2",
      placeholder: "Enter Contact Number",
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
      label: "Contact 3",
      placeholder: "Enter Contact Number",
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
