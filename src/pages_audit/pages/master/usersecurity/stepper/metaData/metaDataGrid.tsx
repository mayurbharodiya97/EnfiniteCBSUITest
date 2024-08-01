import { GridMetaDataType } from "components/dataTableStatic";
export const applicationAccess: GridMetaDataType = {
    gridConfig: {
        dense: true,
        gridLabel: "Application Access Rights",
        rowIdColumn: "APP_NM",
        defaultColumnConfig: {
            width: 400,
            maxWidth: 450,
            minWidth: 300,
        },
        hideHeader: false,
        hideFooter: false,
        disableGroupBy: true,
        allowRowSelection:false,
        containerHeight: {
            min: "48vh",
            max: "48vh",
        },
    },
    columns: [
        {
            accessor: "TRAN_CD",
            columnName: "App Code",
            sequence: 1,
            alignment: "left",
            componentType: "default",
            width: 80,
            minWidth: 60,
            maxWidth: 120,
        },
        {
            accessor: "APP_NM",
            columnName: "Application Name",
            sequence: 2,
            alignment: "left",
            componentType: "default",
            width: 280,
            minWidth: 280,
            maxWidth: 300,
        },
        {
            accessor: "LOGIN_ACCESS",
            columnName: "Access",
            sequence: 3,
            alignment: "center",
            componentType: "editableCheckbox",
            SelectAllColumn:true,
            width: 125,
            minWidth: 100,
            maxWidth: 125,
            isReadOnly: false,
            __VIEW__: {
                isReadOnly: true,
                SelectAllColumn: false
            },
        },
    ],
};
export const userAccessbranch: GridMetaDataType = {
    gridConfig: {
        dense: true,
        gridLabel: "BranchAccessRights",
        rowIdColumn: "BRANCH_CD",
        defaultColumnConfig: {
            width: 200,
            maxWidth: 250,
            minWidth: 100,
        },
        allowColumnReordering: true,
        disableSorting: false,
        hideHeader: false,
        hideFooter: false,
        disableGroupBy: true,
        enablePagination: true,
        pageSizes: [10, 20, 30],
        defaultPageSize: 10,
        containerHeight: {
            min: "48vh",
            max: "48vh",
        },
        allowRowSelection: false,
    },
    columns: [
        {
            accessor: "BRANCH_CD",
            columnName: "Branch",
            sequence: 2,
            alignment: "left",
            componentType: "default",
            width: 80,
            minWidth: 80,
            maxWidth: 80,
        },
        {
            accessor: "BRANCH_NM",
            columnName: "Name",
            sequence: 2,
            alignment: "left",
            componentType: "default",
            width: 140,
            minWidth: 140,
            maxWidth: 180,
        },
        {
            accessor: "LOGIN_ACCESS",
            columnName: "Login",
            sequence: 3,
            alignment: "center",
            componentType: "editableCheckbox",
            SelectAllColumn:true,
            width: 180,
            minWidth: 160,
            maxWidth: 200,
            isReadOnly: false,
            __VIEW__: {
                isReadOnly: true,
                SelectAllColumn: false
            },
        },
        {
            accessor: "REPORT_ACCESS",
            columnName: "Report",
            sequence: 3,
            alignment: "center",
            componentType: "editableCheckbox",
            SelectAllColumn:true,
            width: 180,
            minWidth: 160,
            maxWidth: 200,
            isReadOnly: false,
            __VIEW__: {
                isReadOnly: true,
                SelectAllColumn: false
            },
        },
    ],
};
export const productaccess: GridMetaDataType = {
    gridConfig: {
        dense: true,
        gridLabel: "ProductAccessRights",
        rowIdColumn: "ACCT_TYPE",
        defaultColumnConfig: {
            width: 400,
            maxWidth: 450,
            minWidth: 300,
        },
        allowColumnReordering: true,
        disableSorting: false,
        hideHeader: false,
        hideFooter: false,
        disableGroupBy: true,
        allowRowSelection: false,
        enablePagination: true,
        pageSizes: [10, 20, 30,500],
        defaultPageSize: 10,
        containerHeight: {
            min: "48vh",
            max: "48vh",
        },
        isCusrsorFocused: true,
    },
    columns: [
        {
            accessor: "BRANCH_CD",
            columnName: "Branch",
            sequence: 2,
            alignment: "left",
            componentType: "default",
            width: 100,
            minWidth: 100,
            maxWidth: 120,
        },
        {
            accessor: "ACCT_TYPE",
            columnName: "Type",
            sequence: 3,
            alignment: "left",
            componentType: "default",
            width: 80,
            minWidth: 80,
            maxWidth: 120,
        },

        {
            accessor: "TYPE_NM",
            columnName: "Product",
            sequence: 4,
            alignment: "left",
            componentType: "default",
            width: 280,
            minWidth: 280,
            maxWidth: 300,
        },
        {
            accessor: "ACCESS",
            columnName: "Access",
            sequence: 5,
            alignment: "left",
            componentType: "editableCheckbox",
            SelectAllColumn:true,
            width: 100,
            minWidth: 100,
            maxWidth: 100,
            isReadOnly: false,
            __VIEW__: {
                isReadOnly: true,
                SelectAllColumn: false
            },
        },
    ],
};
export const loginBiometric: GridMetaDataType = {
    gridConfig: {
        dense: true,
        gridLabel: "Login Biometric",
        rowIdColumn: "SR_CD",
        defaultColumnConfig: {
            width: 400,
            maxWidth: 450,
            minWidth: 300,
        },
        hideHeader: false,
        hideFooter: false,
        disableGroupBy: true,
        allowRowSelection:false,
        containerHeight: {
            min: "48vh",
            max: "48vh",
        },
    },
    columns: [
        {
            accessor: "SR_CD",
            columnName: "Sr.No",
            sequence: 1,
            componentType: "default",
            width: 80,
            minWidth: 60,
            maxWidth: 120,
        },
        {
            accessor: "FINGER_NM",
            columnName: "Finger Name",
            sequence: 2,
            alignment: "left",
            componentType: "default",
            width: 280,
            minWidth: 280,
            maxWidth: 300,
        },
        {
            accessor: "Edit",
            columnName: "Edit",
            sequence: 2,
            alignment: "left",
            componentType: "buttonRowCell",
            width: 180,
            minWidth: 160,
            maxWidth: 200,
            isVisibleInNew: true,
            __VIEW__:{
                shouldExclude(fieldData, dependentFieldsValues, formState) {
                    return true;
                  },
            }
        },
        {
            accessor: "Delete",
            columnName: "Delete",
            sequence: 3,
            alignment: "left",
            componentType: "buttonRowCell",
            width: 180,
            minWidth: 160,
            maxWidth: 200,
            isVisibleInNew: true,
            __VIEW__:{
                shouldExclude(fieldData, dependentFieldsValues, formState) {
                    return true;
                  },
            }

        },
    ],
};