import { GridMetaDataType } from "components/dataTableStatic";
import * as API from "../../../../api";
export const attestation_detail_meta_data = {
    form: {
        name: "attestation_details_form",
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
                sm: 6,
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
        {
            render: {
                componentType: "autocomplete",
            },
            name: "DOC_TYPE",
            label: "TypeOfDocSubmitted",
            options: () => API.getPMISCData("CKYC_RCVDOCTYPE"),
            _optionsKey: "ckycDocTypes",
            required: true,
            schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
            },
            placeholder: "",
            type: "text",
            // GridProps: {xs:12, sm:4, md: 3, lg: 2.5, xl:1.5},
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "autocomplete",
            },
            options: [
                {label: "YES", value: "Y"},
                {label: "NO", value: "N"}
            ],
            name: "KYC_VERIFICATION_FLAG",
            label: "KYCVerificationFlag",
            required: true,
            schemaValidation: {
              type: "string",
              rules: [
                { name: "required", params: ["ThisFieldisrequired"] },
              ],
            },
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "select",
            },
            // options: [
            //     {label: "Risk Category 1", value: "riskcat1"},
            //     {label: "Risk Category 2", value: "riskcat2"}
            // ],
            options: () => API.getPMISCData("CKYC_RISK_CATEG"),
            _optionsKey: "ckycRiskCategOp",
            name: "RISK_CATEGORY",
            label: "RiskCategory",
            isReadOnly: true,
            // required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "KYC_VERIFICATION_EMP_CODE",
            label: "KYCVerificationEmpCode",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "KYC_VERIFICATION_EMP_NAME",
            label: "KYCVerificationEmpName",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "KYC_VERIFICATION_EMP_DESIGNATION",
            label: "KYCVerificationEmpDesignation",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "KYC_VERIFICATION_BRANCH",
            label: "KYCVerificationBranch",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "KYC_VERIFICATION_DATE",
            label: "KYCVerificationDate",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ORG_CODE",
            label: "OrganizationCode",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "ORG_NAME",
            label: "OrganizationName",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "PLACE_OF_DECLARATION",
            label: "PlaceOfDeclaration",
            placeholder: "",
            type: "text",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "DATE_OF_DECLARATION",
            label: "DateOfDeclaration",
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs:12, sm:4, md: 3, lg: 2.4, xl:2},
        },
    ]
}

export const attest_history_meta_data: GridMetaDataType = {
    gridConfig: {
      dense: true,
      gridLabel: "Attestation Hsitory",
      rowIdColumn: "CUSTOMER_ID",
      defaultColumnConfig: {
        width: 150,
        maxWidth: 250,
        minWidth: 100,
      },
      allowColumnReordering: true,
      disableSorting: false,
      hideHeader: false,
      disableGroupBy: true,
      enablePagination: true,
      pageSizes: [10, 20, 30],
      defaultPageSize: 10,
      containerHeight: {
        min: "42vh",
        max: "65vh",
      },
      allowFilter: false,
      allowColumnHiding: false,
    },
    // filters: [],
    columns: [
      {
        accessor: "RCV_DOC_TYPE",
        columnName: "TypeOfDocSubmitted",
        sequence: 1,
        alignment: "left",
        componentType: "default",
        width: 300,
        minWidth: 300,
        maxWidth: 580,
      },
      {
        accessor: "RISK_CATEG",
        columnName: "RiskCategory",
        sequence: 2,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "IPV_FLAG",
        columnName: "KYCVerificationFlag",
        sequence: 3,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "IPV_EMP_CODE",
        columnName: "KYCVerificationEmpCode",
        sequence: 4,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "LAST_ENTERED_BY",
        columnName: "Last Entered By",
        sequence: 5,
        alignment: "left",
        componentType: "default",
        width: 340,
        minWidth: 240,
        maxWidth: 340,
      },
      {
        accessor: "IPV_EMP_DESIG",
        columnName: "KYCVerificationEmpDesignation",
        sequence: 6,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "IPV_BRANCH",
        columnName: "Branch Name",
        sequence: 7,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "IPV_DATE",
        columnName: "IPV Date",
        sequence: 8,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "ORG_CODE",
        columnName: "ORG. Code",
        sequence: 9,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "ORG_NAME",
        columnName: "ORG. Name",
        sequence: 10,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "PLACE_OF_DECLARE",
        columnName: "PlaceOfDeclaration",
        sequence: 11,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "DATE_OF_DECLARE",
        columnName: "DateOfDeclaration",
        sequence: 12,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
    //   {
    //     columnName: "Remarks",
    //     componentType: "buttonRowCell",
    //     accessor: "REMARKS",
    //     sequence: 10,
    //     buttonLabel: "Remarks",
    //     // isVisible: false,
    //     // __EDIT__: { isVisible: true },
    //   },
    ],
  };