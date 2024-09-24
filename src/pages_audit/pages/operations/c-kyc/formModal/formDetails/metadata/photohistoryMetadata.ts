import { GridMetaDataType } from "@acuteinfo/common-base";
export const PhotoHistoryMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Photo & Signature History",
    rowIdColumn: "SR_CD",
    defaultColumnConfig: {
      width: 100,
      maxWidth: 100,
      minWidth: 100,
    },
    allowColumnReordering: true,
    disableSorting: false,
    disableGroupBy: true,
    enablePagination: true,
    pageSizes: [15, 25, 35],
    defaultPageSize: 15,
    containerHeight: {
      min: "40vh",
      max: "40vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  columns: [
    {
      accessor: "SR_NO",
      isAutoSequence: true,
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "left",
      componentType: "default",
      width: 70,
      minWidth: 70,
      maxWidth: 120,
    },
    // {
    //   accessor: "CARD_BIN",
    //   columnName: "Card Bin",
    //   sequence: 2,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 150,
    //   minWidth: 100,
    //   maxWidth: 200,
    // },
    // {
    //   accessor: "IS_BANGLA_QR",
    //   columnName: "Allow Bangla QR",
    //   sequence: 2,
    //   alignment: "left",
    //   componentType: "editableCheckbox",
    //   width: 130,
    //   minWidth: 100,
    //   maxWidth: 200,
    //   isReadOnly: true,
    // },
    // {
    //   accessor: "CARD_IMAGE ",
    //   columnName: "",
    //   sequence: 4,
    //   isVisible: false,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 100,
    //   minWidth: 100,
    //   maxWidth: 150,
    // },
    {
      //   accessor: "IMAGE_PATH",
      accessor: "CUST_PHOTO",
      columnName: "Photo Image",
      sequence: 5,
      alignment: "left",
      componentType: "icondefault",
      width: 100,
      minWidth: 50,
      maxWidth: 200,
      //   isImageURL: true,
    },
    {
      accessor: "CUST_SIGN",
      columnName: "Sign Image",
      sequence: 5,
      alignment: "left",
      componentType: "icondefault",
      width: 100,
      minWidth: 50,
      maxWidth: 200,
      //   isImageURL: true,
    },
    {
      accessor: "ENTERED_BY",
      columnName: "Entered By",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 200,
      //   isImageURL: true,
    },
    {
      accessor: "ENTERED_DATE",
      columnName: "Entered Date",
      sequence: 5,
      alignment: "left",
      componentType: "date",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
      //   isImageURL: true,
    },
    {
      accessor: "VERIFIED_BY",
      columnName: "Verified By",
      sequence: 5,
      alignment: "left",
      componentType: "default",
      width: 100,
      minWidth: 50,
      maxWidth: 200,
      //   isImageURL: true,
    },
    {
      accessor: "VERIFIED_DATE",
      columnName: "Verified Date",
      sequence: 5,
      alignment: "left",
      componentType: "date",
      width: 150,
      minWidth: 100,
      maxWidth: 200,
      //   isImageURL: true,
    },
    // {
    //   accessor: "ACTIVE_STATUS",
    //   columnName: "Active Status",
    //   sequence: 6,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 150,
    //   minWidth: 100,
    //   maxWidth: 300,
    // },
    // {
    //   accessor: "ACTIVE",
    //   columnName: "User Status",
    //   sequence: 7,
    //   alignment: "left",
    //   isVisible: false,
    //   componentType: "default",
    //   width: 150,
    //   minWidth: 100,
    //   maxWidth: 300,
    // },
    // {
    //   accessor: "CONFIRMED",
    //   columnName: "Mobile No",
    //   sequence: 9,
    //   isVisible: false,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 150,
    //   minWidth: 100,
    //   maxWidth: 400,
    // },
    // {
    //   accessor: "ENTERED_BY",
    //   columnName: "Entered By",
    //   sequence: 14,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 120,
    //   minWidth: 120,
    //   maxWidth: 200,
    // },
    // {
    //   accessor: "ENTERED_DATE",
    //   columnName: "Entry Date",
    //   sequence: 15,
    //   alignment: "center",
    //   componentType: "date",
    //   dateFormat: "dd/MM/yyyy HH:mm:ss",
    //   width: 150,
    //   minWidth: 130,
    //   maxWidth: 170,
    // },
    // {
    //   accessor: "LAST_ENTERED_BY",
    //   columnName: "Modified By",
    //   sequence: 14,
    //   alignment: "left",
    //   componentType: "default",
    //   width: 120,
    //   minWidth: 120,
    //   maxWidth: 200,
    // },
    // {
    //   accessor: "LAST_MODIFIED_DATE",
    //   columnName: "Modified Date",
    //   sequence: 15,
    //   alignment: "center",
    //   componentType: "date",
    //   dateFormat: "dd/MM/yyyy HH:mm:ss",
    //   width: 150,
    //   minWidth: 130,
    //   maxWidth: 170,
    // },
  ],
};
