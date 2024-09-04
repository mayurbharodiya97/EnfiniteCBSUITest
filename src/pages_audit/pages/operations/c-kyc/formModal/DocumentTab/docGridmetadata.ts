import { GridMetaDataType } from "@acuteinfo/common-base";
import { MasterDetailsMetaData } from "@acuteinfo/common-base";

export const DocumentGridMetadata: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Documents",
    rowIdColumn: "TRANSR_CD",
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
    pageSizes: [15, 25, 50],
    defaultPageSize: 15,
    containerHeight: {
      min: "30vh",
      max: "50vh",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
    hiddenFlag: "_hidden",
  },
  filters: [],
  columns: [
    {
      accessor: "id",
      columnName: "Sr. No.",
      sequence: 1,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      isAutoSequence: true,
    },
    {
      accessor: "SR_CD",
      columnName: "Sr.CD.",
      sequence: 2,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      // isAutoSequence: true,
      isVisible: true,
    },
    {
      accessor: "TRAN_CD",
      columnName: "Tran CD",
      sequence: 3,
      alignment: "right",
      componentType: "default",
      width: 70,
      minWidth: 60,
      maxWidth: 120,
      // isAutoSequence: true,
      isVisible: true,
    },
    // {
    //   accessor: "TEMPLATE_CD",
    //   columnName: "TEMPLATE CD",
    //   sequence: 3,
    //   alignment: "right",
    //   componentType: "default",
    //   width: 70,
    //   minWidth: 60,
    //   maxWidth: 120,
    //   // isAutoSequence: true,
    //   isVisible: true,
    // },
    {
      accessor: "DOC_DESCRIPTION",
      columnName: "Document*",
      sequence: 4,
      alignment: "left",
      componentType: "default",
      isReadOnly: true,
      // options: [{label: "label1", value: "value1"},{label: "label2", value: "value2"}],
      //   options: (dependentValue, formState, _, authState) => {
      //       console.log("fwezzzzfeqw", dependentValue, formState, _, authState)
      //       // API.getDocumentTypes({COMP_CD: COMP_CD, CONSTITUTION: CONSTITUTION, CUST_TYPE: CUST_TYPE})
      //   },
      // options: [
      //   {label: "option1", value: "option1"},
      //   {label: "option2", value: "option2"},
      //   {label: "option3", value: "option3"},
      // ],
      // _optionsKey: "GetChargeTemplates",
      placeholder: "",
      width: 150,
      minWidth: 100,
      maxWidth: 250,
    },
    {
      accessor: "SUBMIT",
      columnName: "Submit",
      sequence: 5,
      alignment: "left",
      componentType: "editableCheckbox",
      isReadOnly: true,
      placeholder: "",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
    },
    {
      accessor: "DOC_NO",
      columnName: "Document No.",
      sequence: 6,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 200,
      minWidth: 120,
      maxWidth: 130,
      isReadOnly: true,
    },
    {
      accessor: "VALID_UPTO",
      // accessor: "VALID_TILL_DATE",
      columnName: "Valid till Date",
      sequence: 7,
      alignment: "left",
      componentType: "date",
      dateFormat: "dd/MM/yyyy",
      defaultValue: new Date(),
      // options: () => GeneralAPI.GetChargeTemplates(),
      // options: [{label: "label1", value: "value1"},{label: "label2", value: "value2"}],
      // _optionsKey: "GetChargeTemplates",
      // placeholder: "",
      width: 120,
      minWidth: 110,
      maxWidth: 120,
    },
    {
      accessor: "DOC_WEIGHTAGE",
      columnName: "Document Weightage",
      sequence: 8,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 150,
      minWidth: 150,
      maxWidth: 150,
      isReadOnly: true,
    },
    {
      columnName: "Action",
      componentType: "buttonRowCell",
      accessor: "VIEW_DTL",
      buttonLabel: "View/Edit",
      sequence: 9,
      width: 120,
      minWidth: 100,
      maxWidth: 130,
      isVisibleInNew: true,
    },
    {
      columnName: "Action",
      buttonLabel: "Delete",
      componentType: "buttonRowCell",
      accessor: "_hidden",
      // componentType: "deleteRowCell",
      // accessor: "_hidden",
      // buttonLabel: "Submit",
      shouldExclude: (initialValue, original, prevRows, nextRows) => {
        // console.log("originalasesesdwed", original)
        // if(!Boolean(original?.IS_MANDATORY)) {
        //   return false;
        // }
        if (
          Object.hasOwn(original, "IS_MANDATORY") &&
          original?.IS_MANDATORY === "Y"
        ) {
          return true;
        } else {
          return false;
        }
      },
      isVisibleInNew: true,
      sequence: 10,
      width: 100,
      minWidth: 100,
      maxWidth: 150,
      // shouldExclude: () => {

      // },
      // isVisible: false,
      // __EDIT__: { isVisible: true },
    },
    {
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 11,
      alignment: "left",
      componentType: "default",
      placeholder: "",
      width: 2250,
      minWidth: 200,
      maxWidth: 400,
      isReadOnly: true,
    },
    // {
    //   accessor: "VALID_DT_APPLICABLE",
    //   columnName: "VALID DATE APPLICABLE",
    //   componentType: "hidden",
    //   sequence: 7,
    // },
    // {
    //   accessor: "SUBMIT_BTN",
    //   columnName: "Action",
    //   componentType: "buttonRowCell",
    //   sequence: 4,
    //   buttonLabel: "EDIT/VIEW",
    //   isVisible: true,
    //   width: 140,
    //   minWidth: 140,
    //   maxWidth: 200,
    //   __EDIT__: { isVisible: true },
    // },
    // {
    //   accessor: "DEL_BTN",
    //   componentType: "buttonRowCell",
    //   columnName: "Delete",
    //   sequence: 9,
    //   shouldExclude:(initialValue,original,prevRows,nextRows)=>{
    //     // console.log("originalasesesdwed", original)
    //     if(!Boolean(original?.IS_MANDATORY)) {
    //       return false;
    //     }
    //     if(original?.IS_MANDATORY !=='Y'){
    //       return false;
    //     }
    //     return true;
    //   },
    //   width: 100,
    //   minWidth: 80,
    //   maxWidth: 400,
    //   // isVisible: false,
    //   // __EDIT__: { isVisible: true },
    // },
    {
      accessor: "DOC_IMAGE",
      columnName: "Document Image",
      componentType: "icondefault",
      sequence: 12,
      width: 100,
      minWidth: 80,
      maxWidth: 400,
      isVisible: false,
    },
    {
      accessor: "DOC_OBJ",
      columnName: "Document Image",
      componentType: "icondefault",
      sequence: 13,
      width: 100,
      minWidth: 80,
      maxWidth: 400,
      isVisible: false,
    },
  ],
};
