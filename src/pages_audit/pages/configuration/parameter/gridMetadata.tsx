import { GridMetaDataType } from "components/dataTableStatic";
export const ParametersGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Parameter Master",
    rowIdColumn: "PARA_CD",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableSorting: false,
    hideHeader: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [20, 30, 50],
    defaultPageSize: 20,
    containerHeight: {
      min: "67vh",
      max: "67vh",
    },
    allowFilter: true,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
  },
  filters: [
    {
      accessor: "PARA_CD",
      columnName: "Code",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "PARA_NM",
      columnName: "Description",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "DIS_DATATYPE_CD",
      columnName: "Datatype",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      accessor: "PARA_VALUE",
      columnName: "Value",
      filterComponentType: "valueFilter",
      gridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
  ],
  columns: [
    {
      accessor: "id",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 150,
      isAutoSequence: true,
    },
    {
      accessor: "PARA_CD",
      columnName: "Code",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 50,
      maxWidth: 150,
      //isAutoSequence: true,
    },
    {
      accessor: "PARA_NM",
      columnName: "Description",
      sequence: 2,
      alignment: "left",
      componentType: "default",
      width: 400,
      minWidth: 200,
      maxWidth: 600,
    },
    {
      accessor: "DIS_DATATYPE_CD",
      columnName: "Datatype",
      sequence: 3,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 120,
      maxWidth: 200,
    },
    {
      accessor: "PARA_VALUE",
      columnName: "Value",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      width: 200,
      minWidth: 250,
      maxWidth: 300,
    },
    {
      accessor: "CONFIRM_STATUS",
      columnName: "Confirm Status",
      sequence: 7,
      alignment: "left",
      componentType: "default",
      color: (val, data) => {
        let confirmed = data?.original?.CONFIRMED ?? "";
        return confirmed === "N"
          ? "red"
          : confirmed === "R"
          ? "rgb(128, 0, 0)"
          : "inherit";
      },
      width: 230,
      minWidth: 220,
      maxWidth: 300,
    },
    {
      accessor: "LAST_ENTERED_BY",
      columnName: "Modified By",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      width: 150,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      accessor: "LAST_MODIFIED_DATE",
      columnName: "Modified Date",
      sequence: 9,
      alignment: "center",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      width: 120,
      minWidth: 120,
      maxWidth: 150,
    },
  ],
};
export const ParaDetailMetadata = {
  form: {
    name: "paraDetail",
    label: "Parameter Master",
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
    //   name: "AUTHVIEW",
    //   label: "Loan Approval Request Details",
    //   GridProps: {
    //     xs: 12,
    //     md: 12,
    //     sm: 12,
    //   },
    // },
    {
      render: {
        componentType: "hidden",
      },
      name: "COMP_CD",
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARA_CD",
      label: "Code",
      placeholder: "",
      type: "text",
      isReadOnly: true,
      GridProps: {
        xs: 12,
        xl:6,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARA_NM",
      label: "Description",
      placeholder: "",
      type: "text",
      required: true,
      isReadOnly: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Description is required."] },
          { name: "DATATYPE_CD", params: ["Please enter Description."] },
        ],
      },
      GridProps: {
        xs: 12,
        xl:6,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "DATATYPE_CD",
      label: "Data Type",
      placeholder: "",
      options: [
        { label: "NUM/DECIMAL", value: "N" },
        { label: "CHARACTER/STRING", value: "C" },
        { label: "DATE", value: "D" },
      ],
      isReadOnly: true,
      defaultValue: "",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Data Type is required."] },
          { name: "DATATYPE_CD", params: ["Please select Data Type."] },
        ],
      },
      GridProps: {
        xs: 12,
        xl:6,
        md: 3,
        sm: 3,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "PARA_VALUE",
      label: "Value",
      placeholder: "",
      type: "text",
      required: true,
      schemaValidation: {
        type: "string",
        rules: [
          { name: "required", params: ["Value is required."] },
          { name: "PARA_VALUE", params: ["Please enter Value."] },
        ],
      },
      GridProps: {
        xs: 12,
        xl:6,
        md: 3,
        sm: 3,
      },
    },
  ],
};
