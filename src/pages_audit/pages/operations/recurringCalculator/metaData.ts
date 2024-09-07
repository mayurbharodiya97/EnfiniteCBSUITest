import * as API from './api'
import { GeneralAPI } from 'registry/fns/functions';
import { format } from 'date-fns';
import { GridMetaDataType } from "components/dataTableStatic";
import { t } from 'i18next';

export const RecurringCalculatotMetaData = {
    form: {
      name: "recurringCalculator",
      label: "",
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
            spacing: 1,
          },
        },
      },
      componentProps: {
        select: {
          fullWidth: true,
        },
        textField: {
          fullWidth: true,
        },
        datePicker: {
          fullWidth: true,
        },
        numberFormat: {
          fullWidth: true,
        },
        _accountNumber: {
          fullWidth: true,
        },
        arrayField: {
          fullWidth: true,
        },
        amountField: {
          fullWidth: true,
        },
        formbutton: {
          fullWidth: true,
        }
      },
    },
    fields: [
      {
        render: { componentType: "autocomplete" },
        name: "ACCT_TYPE",
        label: "AccountType",
        placeholder:"AccountType",
        options: (dependentValue, formState, _, authState) => GeneralAPI.get_Account_Type({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode, USER_NAME: authState?.user?.id,   DOC_CD: formState?.docCd ?? "",}),
        _optionsKey: "getaccttype",
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: [t("AccountTypeReqired")] },
          ],
        },
        GridProps: { xs: 6, sm: 4, md: 4, lg: 4, xl: 4 },
      },
      {
        render: { componentType: "autocomplete" },
        name: "CATEG_CD",
        label: "Category",
        placeholder:"Category",
        options: (dependentValue, formState, _, authState) => API.getCategoryType({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
        _optionsKey: "getcategory",
        GridProps: {  xs: 6, sm: 3, md: 4, lg: 4, xl: 4  },
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Categoryisrequired"] },
          ],
        },
      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "START_DT",
        label: "StartDate",
        fullWidth: true,
        GridProps: { xs: 6, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
        render: {
          componentType: "autocomplete",
        },
        name: "DATA_VAL",
        label: "IntType",
        placeholder: "IntType",
        defaultValue:"1",
        isReadOnly:true,
        options: (dependentValue, formState, _, authState) => API.getIntType({ENT_COMP_CD: authState?.companyID, ENT_BRANCH_CD: authState?.user?.branchCode}),
        _optionsKey: "getIntType",
        GridProps: { xs: 6, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: { componentType: "autocomplete" },
        name: "INST_NO",
        label: "InstallmentType",
        placeholder:"InstallmentType",
        options: (dependentValue, formState, _, authState) => API.getInstallmentPeriodData({COMP_CD: authState?.companyID, BRANCH_CD: authState?.user?.branchCode}),
        _optionsKey: "getInstallPeriod",
        required: true,
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["InstallmentTypeisrequired"] },
          ],
        },
        dependentFields: ["START_DT","DATA_VAL"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};

          const reqParameters = {
            START_DATE: format(new Date(dependentFieldValues?.START_DT?.value), "dd/MMM/yyyy"),
            INSTALLMENT_TYPE: dependentFieldValues?.DATA_VAL?.value,
            INSTALLMENT : currentField?.value,
          };

          const postData = await API.getDueDate(reqParameters);
          return {
            DUE_DATE: {
              value:postData[0].DUE_DATE,
              isFieldFocused: true,
              ignoreUpdate: true,
            },
          };
        },
        GridProps: { xs: 6, sm: 4, md: 4, lg: 4, xl: 4 },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "INSTALLMENT_TYPE",
        label: "Int Type.",
        dependentFields: ["INST_NO"],
        setValueOnDependentFieldsChange: (dependentFields) => {
          return dependentFields["INST_NO"]?.optionData?.[0]
            ?.INSTALLMENT_TYPE
        },
        GridProps: { xs: 6, sm: 4, md: 2, lg: 2, xl: 2 },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "INST_AMT",
        label: "InstAmount",
        type: "text",
        fullWidth: true,
        GridProps: {xs: 6, sm: 3, md: 2, lg: 2, xl: 2},
        dependentFields: ["ACCT_TYPE", "CATEG_CD", "START_DT", "PERIOD_NM","INST_AMT","INST_NO","INSTALLMENT_TYPE"],
        postValidationSetCrossFieldValues: async (
          currentField,
          formState,
          authState,
          dependentFieldValues
        ) => {
          if (formState?.isSubmitting) return {};

          const reqParameters = {
            ENT_COMP_CD: authState?.companyID,
            ENT_BRANCH_CD: authState?.user?.branchCode,
            ACCT_TYPE: dependentFieldValues?.ACCT_TYPE?.value.trim(),
            START_DT: format(new Date(dependentFieldValues?.START_DT?.value), "dd/MMM/yyyy"),
            CATAG_CD: dependentFieldValues?.CATEG_CD?.value.trim(),
            INSTALLMENT_TYPE: dependentFieldValues?.INSTALLMENT_TYPE?.value,
            INST_NO: dependentFieldValues?.INST_NO?.value,
            INST_AMT:currentField?.value,
          };

          const postData = await API.getIntRate(reqParameters);
          return {
            INT_RATE: {
              value:postData[0]?.INT_RATE,
              isFieldFocused: true,
              ignoreUpdate: true,
            },
          };
        },

      },
      {
        render: {
          componentType: "rateOfIntWithoutValidation",
        },
        name: "INT_RATE",
        label: "IntRate",
        type: "text",
        fullWidth: true,
        className: "textInputFromRight",
        GridProps: {xs: 4, sm: 4, md: 2, lg: 2, xl: 2},

      },
      {
        render: {
            componentType: "datePicker",
        },
        name: "DUE_DATE",
        label: "DueDate",
        fullWidth: true,
        isReadOnly:true,
        GridProps: { xs: 4, sm: 4, md: 2, lg: 2, xl: 2 },
    },
    {
        render: {
          componentType: "amountField",
        },
        name: "DUE_AMT",
        label: "DueAmount",
        placeholder: "DueAmount",
        isReadOnly:true,
        type: "text",
        GridProps: { xs: 4, sm: 3, md: 2, lg: 2, xl: 2 },
        runValidationOnDependentFieldsChange: false,
        dependentFields: ["INST_NO","DATA_VAL","INSTALLMENT_TYPE","INST_AMT","INT_RATE","START_DT","ENT_COMP_CD","ENT_BRANCH_CD"],
        setValueOnDependentFieldsChange: async (dependentFields) => {
          const values = {
            ENT_COMP_CD: dependentFields?.ENT_COMP_CD.value,
            ENT_BRANCH_CD: dependentFields?.ENT_BRANCH_CD.value,
            INT_TYPE: dependentFields?.DATA_VAL.value,
            INST_NO: dependentFields?.INST_NO.value,
            INST_TYPE: dependentFields?.INSTALLMENT_TYPE.value,
            INST_AMT: dependentFields?.INST_AMT.value,
            INT_RATE: dependentFields?.INT_RATE.value,
            START_DT: format(new Date(dependentFields?.START_DT.value), "dd/MMM/yyyy"),
            SCREEN_REF: "TRN/502"
          };
          const shouldCallApi = Object.values(values).every(value => value !== "");
          const reqParameters = {
            ...values, 
        };
        if (!shouldCallApi) {
          return null;
      }
            const postData = await API.getRecurringCalculateData(reqParameters);
            return  postData[0]?.DUE_AMT
           
        },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ENT_COMP_CD",
        label: "",
        type: "text",
        GridProps: { xs: 6, sm: 3, md: 2, lg: 2, xl: 2 },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ENT_BRANCH_CD",
        label: "",
        type: "text",
        GridProps: { xs: 6, sm: 3, md: 2, lg: 2, xl: 2 },
      },
    ],
  };

  export const RecurringGridMetaData: GridMetaDataType = {
    gridConfig: {
      dense: true,
      gridLabel: "",
      rowIdColumn: "INST_DT",
      defaultColumnConfig: {
        width: 200,
        maxWidth: 450,
        minWidth: 100,
      },
      allowColumnReordering: true,
      disableSorting: false,
      hideHeader: false,
      disableGroupBy: true,
      disableGlobalFilter:true,
      enablePagination: false,
      defaultPageSize: 20,
      containerHeight: {
        min: "35vh",
        max: "35vh",
      },
      allowFilter: false,
      allowColumnHiding: false,
      allowRowSelection: false,
      isCusrsorFocused: true,
    },
    columns: [
      {
        accessor: "SR_NO",
        columnName: "SrNo",
        sequence: 2,
        isAutoSequence:true,
        alignment: "left",
        componentType: "default",
        width: 80,
        minWidth: 50,
        maxWidth: 100,
      },
      {
        accessor: "INST_DT",
        columnName: "Period",
        sequence: 4,
        alignment: "center",
        componentType: "date",
        width: 100,
        minWidth: 80,
        maxWidth: 120,
      },
      {
        accessor: "INST_AMT",
        columnName: "InstallmentAmount",
        sequence: 4,
        alignment: "right",
        componentType: "currency",
        width: 150,
        minWidth: 100,
        maxWidth: 180,
        isDisplayTotal:true,
        FormatProps: {
        decimalScale: 2,
        fixedDecimalScale: true,
        }
        
      },
      {
        accessor: "BALANCE_AMT",
        columnName: "Balance",
        sequence: 4,
        alignment: "right",
        componentType: "currency",
        width: 150,
        minWidth: 100,
        maxWidth: 180,
        isDisplayTotal:true,
        FormatProps: {
          decimalScale: 2,
          fixedDecimalScale: true,
          }
      },
      {
        accessor: "MONTH_INT",
        columnName: "InterestAmount",
        sequence: 4,
        alignment: "right",
        componentType: "currency",
        width: 200,
        minWidth: 100,
        maxWidth: 300,
        isDisplayTotal:true,
        FormatProps: {
          decimalScale: 2,
          fixedDecimalScale: true,
          }
      },
      {
        accessor: "CUM_INT",
        columnName: "RunningIntAmt",
        sequence: 4,
        alignment: "right",
        componentType: "currency",
        width: 150,
        minWidth: 100,
        maxWidth: 180,
      },
      
    ],
  };
  

