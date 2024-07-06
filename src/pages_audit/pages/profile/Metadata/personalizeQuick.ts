import { GridMetaDataType } from "components/dataTableStatic";
import { GeneralAPI } from "registry/fns/functions";

export const PersonlizationQuickGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "QuickView",
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
      accessor: "DOC_CD",
      columnName: "Screen Name List",
      sequence: 2,
      alignment: "left",
      componentType: "editableAutocomplete",
      enableDefaultOption: true,
      options: GeneralAPI.getquickViewList,
      _optionsKey: "getquickViewList",
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
            if (item?.DOC_CD == "") {
              return ls_msg;
            }
            if (value === item?.DOC_CD) {
              lb_error = true;
              ls_msg = "Option is Already entered";
              return ls_msg;
            }
          });
          if (lb_error) {
            return ls_msg;
          }
        }
        return "";
      },
      width: 343,
      maxWidth: 450,
      minWidth: 300,
    },
  ],
};
