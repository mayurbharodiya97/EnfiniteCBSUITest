import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";
import { GeneralAPI } from "registry/fns/functions";

export const detailMetadata002 = {
  masterForm: {
    form: {
      name: "merchantOnboarding",
      label: "Account Inquiry",
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
      apiKey: {
        CUST_ID: "CUSTOMER",
        ACCT_NO: "ACCOUNT",
        MOB_NO: "MOBILE",
        PAN_NO: "PAN",
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
          componentType: "numberFormat",
        },
        name: "ACCOUNT",
        label: "Account No.",
        placeholder: "Account Number",
        defaultValue: "",
        type: "text",
        maxLength: 20,
        required: false,
        fullWidth: true,
        autoComplete: false,
        // startsIcon: Account_Number_Svg,
        startsIcon: "AccountCircleSharp",
        iconStyle: {
          color: "var(--theme-color3)",
          height: 20,
          width: 20,
        },
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
        },
        FormatProps: {
          isAllowed: (values) => {
            if (values?.value?.length > 20) {
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
          componentType: "numberFormat",
        },
        name: "CUSTOMER",
        label: "Customer Id",
        maxLength: 12,
        schemaValidation: {
          type: "string",
        },
        placeholder: "Customer Id",
        type: "text",
        startsIcon: "PortraitSharp",
        iconStyle: {
          height: 20,
          color: "var(--theme-color3)",
          width: 20,
        },
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
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
        name: "MOBILE",
        label: "Mobile No.",
        maxLength: 10,
        placeholder: "Mobile Number",
        type: "string",
        // startsIcon: Mobile_Number_Svg,
        startsIcon: "PhoneAndroidSharp",
        iconStyle: {
          color: "var(--theme-color3)",
          height: 20,
          width: 20,
        },
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
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
        name: "PAN",
        label: "Pan No.",
        placeholder: "PanCard Number",
        maxLength: 10,
        type: "text",
        schemaValidation: {
          type: "string",
        },
        startsIcon: "PaymentRounded",
        iconStyle: {
          height: 25,
          color: "var(--theme-color3)",
          width: 25,
        },
        GridProps: {
          xs: 12,
          md: 2.5,
          sm: 2.5,
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
        endsIcon: "YoutubeSearchedFor",
        rotateIcon: "scale(1.5)",
        placeholder: "",
        type: "text",
        GridProps: {
          xs: 12,
          md: 1,
          sm: 1,
        },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Search Criteria Data",
      rowIdColumn: "WITHDRAW_BAL",
      searchPlaceholder: "Accounts",
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
        max: "45vh",
      },
      allowFilter: false,
      allowColumnHiding: false,
    },
    // filters: [],
    columns: [
      {
        accessor: "ACCT_NO",
        columnName: "Account No.",
        sequence: 3,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "ACCT_NM",
        columnName: "Account/Person Name",
        sequence: 4,
        alignment: "left",
        componentType: "default",
        width: 280,
        minWidth: 180,
        isReadOnly: true,
        maxWidth: 300,
      },
      {
        accessor: "CUSTOMER_ID",
        columnName: "Customer Id",
        sequence: 5,
        alignment: "left",
        componentType: "default",
        width: 100,
        minWidth: 60,
        maxWidth: 120,
      },
      {
        accessor: "CONTACT2",
        columnName: "Mobile No.",
        sequence: 6,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "PAN_NO",
        columnName: "Pan No.",
        sequence: 7,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "WITHDRAW_BAL",
        columnName: "Withdraw Balance",
        sequence: 7,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },
      {
        accessor: "E_MAIL_ID",
        columnName: "Email Id",
        sequence: 7,
        alignment: "left",
        componentType: "default",
        width: 140,
        minWidth: 140,
        maxWidth: 180,
      },

      {
        accessor: "OPENIND_DT",
        columnName: "Opening Date",
        sequence: 8,
        alignment: "center",
        componentType: "date",
        dateFormat: "dd/MM/yyyy HH:mm:ss",
        isReadOnly: true,
        width: 140,
        minWidth: 140,
        maxWidth: 140,
      },
      {
        accessor: "DISPLAY_STATUS",
        columnName: "Status",
        sequence: 9,
        alignment: "left",
        componentType: "default",
        isReadOnly: true,
        width: 100,
        minWidth: 100,
        maxWidth: 100,
      },
      {
        accessor: "CLOSE_DT",
        columnName: "Close Date",
        sequence: 10,
        alignment: "left",
        componentType: "date",
        dateFormat: "dd/MM/yyyy HH:mm:ss",
        isReadOnly: true,
        width: 140,
        minWidth: 140,
        maxWidth: 170,
      },
    ],
  },
};
