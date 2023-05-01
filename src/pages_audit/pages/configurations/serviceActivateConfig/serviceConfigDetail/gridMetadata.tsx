import { GridMetaDataType } from "components/dataTableStatic";
import { format } from "date-fns";
import {
  geaterThanDate,
  greaterThanInclusiveDate,
  lessThanDate,
} from "registry/rulesEngine";
export const ServiceConfigDetailGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Service Deactivation Configuration Details",
    rowIdColumn: "SR_NO",
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
    pageSizes: [20, 30, 40],
    defaultPageSize: 20,
    containerHeight: {
      min: "68vh",
      max: "68vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: true,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [
    {
      accessor: "id",
      columnName: "Sr. No.",
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
      accessor: "id1",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 100,
      isAutoSequence: true,
    },
    {
      accessor: "SUB_TRN_TYPE",
      columnName: "Service Name",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 140,
      minWidth: 120,
      maxWidth: 250,
      schemaValidation: {
        type: "string",
        rules: [{ name: "required", params: ["This field is required"] }],
      },
    },
    {
      accessor: "FROM_DT",
      columnName: "From Date",
      sequence: 6,
      alignment: "left",
      componentType: "editableDatetimePicker",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      mindate: new Date(),
      placeholder: "",
      width: 210,
      minWidth: 200,
      maxWidth: 280,
      validation: (value, data, prev) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        let fromDate = new Date(value);
        let toDate = new Date(data?.TO_DT);
        if (geaterThanDate(fromDate, toDate)) {
          return `From Date Should be Less Than To Date.`;
        }
        if (Array.isArray(prev)) {
          let returnMsg = "";
          prev.forEach((item) => {
            if (greaterThanInclusiveDate(new Date(item?.TO_DT), fromDate)) {
              returnMsg = `From Date Should Greater Than Previous To Date.`;
              return returnMsg;
            }
          });
          return returnMsg;
        }
        return "";
      },
      __EDIT__: { isReadOnly: true },
    },
    {
      accessor: "TO_DT",
      columnName: "To Date",
      sequence: 6,
      alignment: "left",
      componentType: "editableDatetimePicker",
      dateFormat: "dd/MM/yyyy HH:mm:ss",
      mindate: new Date(),
      placeholder: "",
      width: 210,
      minWidth: 200,
      maxWidth: 280,
      validation: (value, data) => {
        if (!Boolean(value)) {
          return "This field is required.";
        }
        let toDate = new Date(value);
        let fromDate = new Date(data?.FROM_DT);
        if (lessThanDate(toDate, fromDate)) {
          return `To Date Should be Greater Than From Date.`;
        }
        return "";
      },
      __EDIT__: { isReadOnly: true },
    },
    {
      accessor: "ACTIVE",
      columnName: "Active",
      sequence: 6,
      alignment: "left",
      componentType: "editableCheckbox",
      placeholder: "",
      width: 70,
      minWidth: 50,
      maxWidth: 100,
    },
    {
      accessor: "DISPLAY_MSG",
      columnName: "Service Stop Alert Message",
      sequence: 6,
      alignment: "left",
      componentType: "editableTextField",
      placeholder: "",
      width: 350,
      minWidth: 150,
      maxWidth: 500,
      maxLength: 1000,
    },
    {
      accessor: "CONFIG_TYPE",
      columnName: "CONFIG_TYPE",
      componentType: "default",
      sequence: 7,
      isVisible: false,
    },
    // {
    //   accessor: "MSG",
    //   columnName: "Service Stop Alert Message",
    //   sequence: 6,
    //   alignment: "left",
    //   componentType: "editableTextField",
    //   placeholder: "",
    //   width: 250,
    //   minWidth: 150,
    //   maxWidth: 400,
    //   schemaValidation: {
    //     type: "string",
    //     rules: [{ name: "required", params: ["This field is required"] }],
    //   },
    // },
  ],
};
