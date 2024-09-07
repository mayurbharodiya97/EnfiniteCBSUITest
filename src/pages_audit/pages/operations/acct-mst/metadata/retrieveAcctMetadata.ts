import { GridMetaDataType } from "components/dataTableStatic";
import { utilFunction } from "components/utils";
import { GeneralAPI } from "registry/fns/functions";

export const retrieveAcctFormMetaData = {
  form: {
    name: "retrieveAcctForm",
    label: "Retrieve Accounts",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    submitAction: "home",
    // allowColumnHiding: true,
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
          spacing: 2,
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
        componentType: "_accountNumber",
      },
      branchCodeMetadata: {
        validationRun: "onChange",
        required: false,
        schemaValidation: {},
        postValidationSetCrossFieldValues: (field, formState) => {
          if (field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              CUSTOMER_ID: {value: ""},
              CONTACT2: {value: ""},
              PAN_NO: {value: ""},
            };
          } else if (!field.value) {
            return {
              ACCT_TYPE: { value: "" },
              ACCT_CD: { value: "" },
              CUSTOMER_ID: {value: ""},
              CONTACT2: {value: ""},
              PAN_NO: {value: ""}
            };
          }
        },
        GridProps: {
          xs: 12,
          sm: 1.7,
          md: 1.7,
          lg: 1.7,
          xl: 1.7,
        },

        runPostValidationHookAlways: true,
      },
      accountTypeMetadata: {
        GridProps: {
          xs: 12,
          sm: 1.7,
          md: 1.7,
          lg: 1.7,
          xl: 1.7,
        },
        validationRun: "onChange",
        required: false,
        schemaValidation: {},
        isFieldFocused: true,
        postValidationSetCrossFieldValues: (field, formState) => {
          return {
            ACCT_CD: { value: "" },
            CUSTOMER_ID: {value: ""},
            CONTACT2: {value: ""},
            PAN_NO: {value: ""}
          };
        },
        runPostValidationHookAlways: true,
      },
      accountCodeMetadata: {
        render: {
          componentType: "textField",
        },
        required: false,
        schemaValidation: {
          type: "string",
          rules: [
            {
              name: "max",
              params: [20, "AcctNoValidationMsg"],
            },
          ],
        },
        validate: (columnValue) => {
          let regex = /^[^!&]*$/;
          if (!regex.test(columnValue.value)) {
            return "Special Characters (!, &) not Allowed";
          }
          return "";
        },
        postValidationSetCrossFieldValues: async (
          field,
          formState,
          authState,
          dependentValue
        ) => {
          const ACCT_TYPE = dependentValue?.ACCT_TYPE?.value;
          const BRANCH_CD = dependentValue?.BRANCH_CD?.value;
          if (
            field?.value &&
            dependentValue?.BRANCH_CD?.value &&
            dependentValue?.ACCT_TYPE?.value
          ) {
            let apiRequest = {
              ACCT_CD: utilFunction.getPadAccountNumber(
                field?.value,
                dependentValue?.ACCT_TYPE?.optionData
              ),
              ACCT_TYPE: dependentValue?.ACCT_TYPE?.value,
              BRANCH_CD: dependentValue?.BRANCH_CD?.value,
              SCREEN_REF: "MST/002",
            };

            let postData = await GeneralAPI.getAccNoValidation(apiRequest);
            let apiRespMSGdata = postData?.MSG;
            const messagebox = async (msgTitle, msg, buttonNames, status) => {
              let buttonName = await formState.MessageBox({
                messageTitle: msgTitle,
                message: msg,
                buttonNames: buttonNames,
              });
              return { buttonName, status };
            };
            if (apiRespMSGdata?.length) {
              for (let i = 0; i < apiRespMSGdata?.length; i++) {
                if (apiRespMSGdata[i]?.O_STATUS !== "0") {
                  let btnName = await messagebox(
                    apiRespMSGdata[i]?.O_STATUS === "999"
                      ? "validation fail"
                      : "ALert",
                    apiRespMSGdata[i]?.O_MESSAGE,
                    apiRespMSGdata[i]?.O_STATUS === "99"
                      ? ["Yes", "No"]
                      : ["Ok"],
                    apiRespMSGdata[i]?.O_STATUS
                  );
                  if(btnName?.status === "999" || btnName?.buttonName === "No") {
                    return {
                      ACCT_CD: {value: ""},
                      CUSTOMER_ID: {value: ""},
                      CONTACT2: {value: ""},
                      PAN_NO: {value: ""},
                    }
                  }
                } else {
                  formState.setDataOnFieldChange("BUTTON_CLICK_ACCTCD", {
                    ACCT_TYPE: ACCT_TYPE,
                    BRANCH_CD: BRANCH_CD,
                    ACCT_CD: field?.value
                  });
                  return {
                    CUSTOMER_ID: {value: ""},
                    CONTACT2: {value: ""},
                    PAN_NO: {value: ""},
                  }
                }
              }
            }
          }
          return {}
        },
        runPostValidationHookAlways: true,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      maxLength: 12,
      isReadOnly: false,
      schemaValidation: {
        type: "string",
      },
      placeholder: "CustomerId",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 2,
        xl: 2,
      },
      FormatProps: {
        isAllowed: (values) => {
          if (values?.value?.length > 12) {
            return false;
          }
          if (values.floatValue === 0) {
            return false;
          }
          return true;
        },
      },
    },
    {
      render: {
        componentType: "phoneNumberOptional",
      },
      name: "CONTACT2",
      label: "MobileNo",
      maxLength: 10,
      placeholder: "MobileNo",
      isReadOnly: false,
      type: "string",
      startsIcon: "PhoneAndroidSharp",
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 2,
        xl: 2,
      },
      validate: (columnValue, allField, flag) => {
        if (columnValue.value.length <= 0) {
          return "";
        } else if (columnValue.value.length >= 11) {
          return "The length of your Mobile Number is greater than 10 character";
        } else if (columnValue.value.length <= 9) {
          return "The length of your Mobile Number is less than 10 character";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "panCardOptional",
      },
      name: "PAN_NO",
      label: "PAN_NO",
      placeholder: "PAN_NO",
      maxLength: 10,
      type: "text",
      isReadOnly: false,
      schemaValidation: {
        type: "string",
      },
      GridProps: {
        xs: 12,
        sm: 6,
        md: 3,
        lg: 2,
        xl: 2,
      },
      validate: (columnValue, allField, flag) => {
        let regex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}?$/;

        if (columnValue.value.length <= 0) {
          return "";
        } else if (/[a-z]/.test(columnValue.value)) {
          return "Please enter uppercase letters only";
        } else if (!regex.test(columnValue.value)) {
          return "Please Enter Valid Format";
        }
        return "";
      },
    },
    {
      render: {
        componentType: "formbutton",
      },
      name: "PID_DESCRIPTION",
      label: "Retrieve",
      isReadOnly: false,
      endsIcon: "YoutubeSearchedFor",
      rotateIcon: "scale(1.5)",
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        sm: 3,
        md: 1,
        lg: 1,
        xl: 1,
      },
    },
  ]
}

export const retrieveAcctGridMetaData: GridMetaDataType = {
  gridConfig: {
    dense: true,
    gridLabel: "Retrieve Accounts",
    rowIdColumn: "ACCT_CD",
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
      max: "calc(100vh - 260px)",
    },
    allowFilter: false,
    allowColumnHiding: false,
    allowRowSelection: false,
    isCusrsorFocused: true,
  },
  filters: [],
  columns: [
    {
      componentType: "default",
      accessor: "REQUEST_ID",
      columnName: "Req. ID",
      sequence: 1,
      alignment: "left",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
    },
    {
      componentType: "default",
      accessor: "CUSTOMER_NAME",
      columnName: "CustomerName",
      sequence: 2,
      alignment: "left",
      width: 140,
      minWidth: 140,
      maxWidth: 280,
    },
    {
      componentType: "default",
      accessor: "REMARKS",
      columnName: "Remarks",
      sequence: 3,
      alignment: "left",
      width: 140,
      minWidth: 140,
      maxWidth: 280,
    },
    {
      componentType: "default",
      accessor: "CONFIRMED_FLAG",
      columnName: "Confirm Flag", // value of fresh/existing
      sequence: 4,
      alignment: "left",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      componentType: "default",
      accessor: "UPD_TAB_NAME",
      columnName: "Update Type",
      sequence: 5,
      alignment: "left",
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      componentType: "default",
      accessor: "ACCT_CD",
      columnName: "Account Number",
      sequence: 6,
      alignment: "left",
      width: 120,
      minWidth: 120,
      maxWidth: 120,
    },
    {
      componentType: "default",
      accessor: "TYPE_NM",
      columnName: "Type Name",
      sequence: 7,
      alignment: "left",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      componentType: "default",
      accessor: "ACCT_TYPE",
      columnName: "Account Type",
      sequence: 8,
      alignment: "left",
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      componentType: "default",
      accessor: "REQ_FLAG",
      columnName: "Request Flag",
      sequence: 9,
      alignment: "left",
      width: 100,
      minWidth: 100,
      maxWidth: 100,
    },
    {
      componentType: "default",
      accessor: "CHECKER",
      columnName: "Checker",
      sequence: 10,
      alignment: "left",
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      componentType: "default",
      accessor: "MAKER",
      columnName: "Maker",
      sequence: 11,
      alignment: "left",
      width: 80,
      minWidth: 80,
      maxWidth: 80,
    },
    {
      componentType: "date",
      accessor: "LAST_MODIFIED",
      columnName: "LastModified",
      sequence: 12,
      alignment: "left",
      dateFormat: "dd/MM/yyyy",
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },
    {
      componentType: "date",
      accessor: "VERIFIED_DATE",
      columnName: "Verified Date",
      sequence: 13,
      alignment: "left",
      dateFormat: "dd/MM/yyyy",
      
      width: 140,
      minWidth: 140,
      maxWidth: 180,
    },



  //   {
  //     accessor: "ENTRY_TYPE",
  //     columnName: "Req. Type", // value for fresh/existing
  //     sequence: 8,
  //     alignment: "left",
  //     componentType: "default",
  //     width: 140,
  //     minWidth: 140,
  //     maxWidth: 180,
  //   },
    
    
  //   {
  //     accessor: "CUSTOMER_ID",
  //     columnName: "CustomerId",
  //     sequence: 6,
  //     alignment: "left",
  //     componentType: "default",
  //     width: 140,
  //     minWidth: 140,
  //     maxWidth: 180,
  //   },
    
  //   {
  //     accessor: "CUSTOMER_TYPE_FLAG",
  //     columnName: "CustomerType",
  //     sequence: 7,
  //     alignment: "left",
  //     componentType: "default",
  //     width: 140,
  //     minWidth: 140,
  //     maxWidth: 180,
  //   },

    

  //   {
  //     accessor: "CHECKER",
  //     columnName: "Checker",
  //     sequence: 11,
  //     alignment: "center",
  //     componentType: "default",
  //     isReadOnly: true,
  //     width: 140,
  //     minWidth: 140,
  //     maxWidth: 140,
  //   },
  ],
};