import { GridMetaDataType } from "components/dataTableStatic";
import { getdashboxData } from "../api";

export const PersonlizationDashboardGridData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "DashboardDataCards",
    rowIdColumn: "ID",
    defaultColumnConfig: {
      width: 400,
      maxWidth: 450,
      minWidth: 300,
    },
    allowColumnReordering: true,
    disableGlobalFilter: true,
    disableSorting: false,
    hideHeader: false,
    hideFooter: true,
    disableGroupBy: true,
    allowRowSelection: false,
    containerHeight: {
      min: "43vh",
      max: "43vh",
    },
  },
  // filters: [],
  columns: [
    {
      accessor: "SR_NO",
      columnName: "SrNo",
      sequence: 1,
      alignment: "center",
      componentType: "default",
      width: 80,
      minWidth: 40,
      maxWidth: 80,
      isAutoSequence: true,
    },
    {
      accessor: "DASH_TRAN_CD",
      columnName: "Dashbox Card",
      sequence: 2,
      alignment: "left",
      componentType: "editableAutocomplete",
      enableDefaultOption: true,
      options: getdashboxData,
      _optionsKey: "getdashboxData",
      width: 300,
      maxWidth: 400,
      minWidth: 250,
      validation: (value, data, prev, next) => {
        // if (!Boolean(value)) {
        //   return "This field is required";
        // }
        if (Array.isArray(prev)) {
          let lb_error = false;
          let ls_msg = "";
          prev.forEach((item, index) => {
            if (lb_error) {
              return ls_msg;
            }
            if (item?.DASH_TRAN_CD == "") {
              return ls_msg;
            }
            if (value === item?.DASH_TRAN_CD) {
              lb_error = true;
              // ls_msg = "Option is Already entered at Line " + (index + 1);
              ls_msg = "Option is Already entered  ";
              return ls_msg;
            }
          });
          if (lb_error) {
            return ls_msg;
          }
        }
        return "";
      },
    },
  ],
};
