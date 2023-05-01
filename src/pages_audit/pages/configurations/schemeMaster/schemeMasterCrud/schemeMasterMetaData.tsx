import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { getSchemeSource } from "registry/fns/functions/calculation";
import { GetLeafTemplateDD, GetParentTypeDD } from "../api";

export const schemeMasterDetailsMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "addSchemeMaster",
      label: "Scheme Master",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
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
    },
    fields: [
      {
        render: { componentType: "hidden" },
        name: "TRAN_CD",
      },
      {
        render: {
          componentType: "select",
        },
        name: "PARENT_TYPE",
        label: "Parent Type",
        placeholder: "Please select Parent Type",
        options: () => GetParentTypeDD(),
        _optionsKey: "GetParentTypeDD",
        defaultValue: "",
        required: true,
        fullWidth: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Parent Type is required."] },
            { name: "PARENT_TYPE", params: ["Please select Parent Type."] },
          ],
        },
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
        name: "APP_INDICATOR",
        label: "Source",
        placeholder: "",
        type: "text",
        isReadOnly: true,
        fullWidth: true,
        dependentFields: ["PARENT_TYPE"],
        setValueOnDependentFieldsChange: getSchemeSource,
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
        },
      },

      {
        render: { componentType: "textField" },
        name: "SCHEME_CD",
        label: "Scheme Code",
        placeholder: "Enter Scheme Code",
        required: true,
        maxLength: 300,
        showMaxLength: false,
        GridProps: { xs: 12, md: 3, sm: 3 },
        fullWidth: true,
        validate: "getValidateValue",
        autoComplete: "off",
      },
      {
        render: {
          componentType: "select",
        },
        name: "LEAF_TEMPLATE",
        label: "Leaves Template",
        placeholder: "Please select Leaves Template",
        options: () => GetLeafTemplateDD(),
        _optionsKey: "GetLeafTemplateDD",
        defaultValue: "",
        required: true,
        fullWidth: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Leaves Template is required."] },
            { name: "PARENT_TYPE", params: ["Please select Leaves Template."] },
          ],
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 3,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Service Charge Details",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      enablePagination: false,
      containerHeight: { min: "55vh", max: "55vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Serial No",
        componentType: "default",
        sequence: 1,
        alignment: "right",
        width: 100,
        maxWidth: 150,
        minWidth: 70,
      },
      {
        accessor: "SERVICE_CD",
        columnName: "Service",
        componentType: "disableSelect",
        placeholder: "0.00",
        options: "GetMiscValue",
        _optionsKey: "GetMiscValue",
        requestProps: "TRAN_TYPE",
        required: true,
        validation: (value, data) => {
          if (!Boolean(value)) {
            return "This field is required.";
          }
          return "";
        },
        sequence: 2,
        alignment: "right",
        width: 250,
        maxWidth: 350,
        minWidth: 200,
      },
      {
        accessor: "CHRG_TEMP_TRAN_CD",
        columnName: "Charges",
        componentType: "editableSelect",
        options: "GetChargeTemplates",
        _optionsKey: "GetChargeTemplates",
        sequence: 2,
        width: 250,
        maxWidth: 350,
        minWidth: 200,
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 11,
      },
    ],
  },
};
