import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Typography, Paper, TextField, Button, Divider, Skeleton } from '@mui/material';
import {styled} from "@mui/material/styles";
import FormWrapper, {MetaDataType} from 'components/dyanmicForm';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));



  const ServiceWiseConfigMetadata = {
    form: {
      name: "serviceConfig",
      label: "Service Wise Configuration",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
      submitAction: "home",
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
          componentType: "hidden",
        },
        name: "TRAN_CD",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "TRN_TYPE",
      },
      // {
      //   render: {
      //     componentType: "typography",
      //   },
      //   name: "AUTHVIEW",
      //   label: "Loan Approval Request Details",
      //   GridProps: {
      //     xs: 12,
      //     md: 12,
      //     sm: 12,
      //   },
      // },
      {
        render: {
          componentType: "textField",
        },
        name: "DESCRIPTION",
        label: "Description",
        placeholder: "",
        type: "text",
        required: true,
        validate: "getValidateValue",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 4,
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "DAILY_AMT",
        label: "Daily Limit",
        placeholder: "",
        type: "text",
        required: true,
        validate: "getValidateValue",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "WEEKLY_AMT",
        label: "Weekly Limit",
        placeholder: "",
        type: "text",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        dependentFields: ["DAILY_AMT"],
        runValidationOnDependentFieldsChange: true,
        validate: (currentField, dependentFields) => {
          if (
            Number(dependentFields?.DAILY_AMT?.value) >
            Number(currentField?.value)
          ) {
            return "Weekly Limit should greater than or equal to Daily Limit";
          } else {
            return "";
          }
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "MONTHLY_AMT",
        label: "Monthly Limit",
        placeholder: "",
        type: "text",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        dependentFields: ["DAILY_AMT", "WEEKLY_AMT"],
        runValidationOnDependentFieldsChange: true,
        validate: (currentField, dependentFields) => {
          if (
            Number(dependentFields?.DAILY_AMT?.value) >
            Number(currentField?.value)
          ) {
            return "Monthly Limit should greater than or equal to Daily Limit";
          } else if (
            Number(dependentFields?.WEEKLY_AMT?.value) >
            Number(currentField?.value)
          ) {
            return "Monthly Limit should greater than or equal to Weekly Limit";
          } else {
            return "";
          }
        },
      },
  
      {
        render: {
          componentType: "amountField",
        },
        name: "MIN_AMT",
        label: "Minimum Amount",
        placeholder: "",
        type: "text",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        required: true,
        validate: "getValidateValue",
      },
  
      {
        render: {
          componentType: "amountField",
        },
        name: "MAX_AMT",
        label: "Maximum Amount",
        placeholder: "",
        type: "text",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        runValidationOnDependentFieldsChange: true,
        dependentFields: ["MIN_AMT"],
        validate: (currentField, dependentFields) => {
          if (!currentField?.value) {
            return "This field is required";
          } else if (
            Number(dependentFields?.MIN_AMT?.value) > Number(currentField?.value)
          ) {
            return "Maximum Amount should greater than or equal to Minimum Amount";
          } else {
            return "";
          }
        },
      },
      {
        render: {
          componentType: "amountField",
        },
        name: "CARD_MIN_AMT",
        label: "Card Minimum Amount",
        placeholder: "",
        type: "text",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        required: true,
        validate: "getValidateValue",
      },
      {
        render: {
          componentType: "select",
        },
        name: "TRAN_TIME",
        label: "Execution",
        placeholder: "",
        defaultValue: "",
        options: [
          { label: "24/7/365", value: "24" },
          { label: "Working Days", value: "W" },
          { label: "All Days", value: "A" },
        ],
        required: true,
        //validate: "getValidateValue",
        schemaValidation: {
          type: "string",
          rules: [
            { name: "required", params: ["Execution is required."] },
            { name: "CIB_STATUS", params: ["Please select Execution."] },
          ],
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
      },
      {
        render: {
          componentType: "timePicker",
        },
        name: "START_TIME",
        label: "Start Time",
        placeholder: "",
        defaultValue: new Date(),
        format: "HH:mm:ss",
        type: "text",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        runValidationOnDependentFieldsChange: true,
        dependentFields: ["TRAN_TIME"],
        validate: (currentField, dependentFields) => {
          if (
            dependentFields?.TRAN_TIME?.value !== "24" &&
            !currentField?.value
          ) {
            return "This field is required";
          } else {
            return "";
          }
        },
        shouldExclude: (val1, dependent) => {
          if (dependent["TRAN_TIME"]?.value === "24") {
            return true;
          }
          return false;
        },
      },
      {
        render: {
          componentType: "timePicker",
        },
        name: "END_TIME",
        label: "End Time",
        placeholder: "",
        defaultValue: new Date(),
        format: "HH:mm:ss",
        type: "text",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        runValidationOnDependentFieldsChange: true,
        dependentFields: ["TRAN_TIME"],
        validate: (currentField, dependentFields) => {
          if (
            dependentFields?.TRAN_TIME?.value !== "24" &&
            !currentField?.value
          ) {
            return "This field is required";
          } else {
            return "";
          }
        },
        shouldExclude: (val1, dependent) => {
          if (dependent["TRAN_TIME"]?.value === "24") {
            return true;
          }
          return false;
        },
      },
      // {
      //   render: {
      //     componentType: "timePicker",
      //   },
      //   name: "END_TIME",
      //   label: "End Time",
      //   placeholder: "",
      //   defaultValue: new Date(),
      //   format: "HH:mm:ss",
      //   type: "text",
      //   GridProps: {
      //     xs: 12,
      //     md: 3,
      //     sm: 2,
      //   },
      //   runValidationOnDependentFieldsChange: true,
      //   dependentFields: ["TRAN_TIME", "START_TIME"],
      //   validate: (currentField, dependentFields) => {
      //     if (
      //       dependentFields?.TRAN_TIME?.value !== "24" &&
      //       !currentField?.value
      //     ) {
      //       return "This field is required";
      //       // } else if (
      //       //   dependentFields?.TRAN_TIME?.value !== "24" &&
      //       //   new Date(dependentFields?.START_TIME?.value).getTime() >=
      //       //     new Date(currentField?.value).getTime()
      //       // ) {
      //       //   return "End Time should greater than Start Time";
      //     } else {
      //       return "";
      //     }
      //   },
      // },
      {
        render: {
          componentType: "numberFormat",
        },
        className: "textInputFromRight",
        name: "VAT_PER",
        label: "VAT Percentage",
        placeholder: "",
        type: "text",
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        maxLength: 3,
        showMaxLength: false,
        FormatProps: {
          allowNegative: false,
          allowLeadingZeros: true,
          decimalScale: 0,
          isAllowed: (values) => {
            if (values?.value?.length > 3) {
              return false;
            }
            if (values?.value > 100) {
              return false;
            }
            return true;
          },
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "MERCHANT_ID",
        label: "Merchant ID",
        placeholder: "",
        type: "text",
        maxLength: 15,
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
      },
      {
        render: {
          componentType: "textField",
        },
        name: "TERMINAL_ID",
        label: "Terminal ID",
        placeholder: "",
        type: "text",
        maxLength: 15,
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
      },
      {
        render: {
          componentType: "select",
        },
        name: "WEEK_START",
        label: "Working Day Start From",
        placeholder: "",
        defaultValue: "",
        options: [
          { label: "Sunday", value: "sunday" },
          { label: "Monday", value: "monday" },
          { label: "Tuesday", value: "tuesday" },
          { label: "Wednesday", value: "wednesday" },
          { label: "Thursday", value: "thursday" },
          { label: "Friday", value: "friday" },
          { label: "Saturday", value: "saturday" },
        ],
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
        required: true,
        validate: "getValidateValue",
      },
      {
        render: {
          componentType: "numberFormat",
        },
        className: "textInputFromRight",
        name: "COOL_PERIOD",
        label: "Cool Down Period (In Minute)",
        placeholder: "0.00",
        FormatProps: {
          allowNegative: false,
          allowLeadingZeros: false,
          decimalScale: 2,
          isAllowed: (values) => {
            if (values?.value?.length > 4) {
              return false;
            }
            if (values.floatValue === 0) {
              return false;
            }
            return true;
          },
        },
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
      },
      {
        render: {
          componentType: "numberFormat",
        },
        className: "textInputFromRight",
        name: "MAX_DAY_CNT",
        label: "Max Daily Count",
        placeholder: "0.00",
        FormatProps: {
          allowNegative: false,
          allowLeadingZeros: false,
          decimalScale: 2,
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
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
      },
      {
        render: {
          componentType: "numberFormat",
        },
        className: "textInputFromRight",
        name: "MAX_MONTH_CNT",
        label: "Max Monthly Count",
        placeholder: "0.00",
        FormatProps: {
          allowNegative: false,
          allowLeadingZeros: false,
          decimalScale: 2,
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
        GridProps: {
          xs: 12,
          md: 3,
          sm: 2,
        },
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ENTERED_BY",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "ENTERED_DATE",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "MACHINE_NM",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "LAST_ENTERED_BY",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "LAST_MODIFIED_DATE",
      },
      {
        render: {
          componentType: "hidden",
        },
        name: "LAST_MACHINE_NM",
      },
    ],
  };




const other_detail_meta_data = {
    form: {
        name: "other_detail_form",
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
                spacing: 3,
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
                componentType: "select",
            },
            name: "CUST_TYPE",
            label: "Cust Type",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
            options: [
                {label: "type 1", value: "1"},
                {label: "type 2", value: "2"},
                {label: "type 3", value: "3"},
            ],
            // dependentFields: ["DAILY_AMT"],
            // runValidationOnDependentFieldsChange: true,
            // validate: (currentField, dependentFields) => {
            //     if(Number(dependentFields?.DAILY_AMT?.value) >
            //     Number(currentField?.value)) {
            //         return "Weekly Limit should greater than or equal to Daily Limit";
            //     } else {
            //         return "";
            //     }
            // }
        },
        {
            render: {
                componentType: "select",
            },
            options: [
                {label: "category 1", value: "1"},
                {label: "category 2", value: "2"},
                {label: "category 3", value: "3"},
            ],
            name: "category",
            label: "Category",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "constitution",
            label: "Constitution",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "acc_type",
            label: "A/c Type",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm:true},
        },
    ]
}
const personal_detail_prefix_data = {
    form: {
        name: "personal_detail_prefix_form",
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
                spacing: 3,
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PREFIX",
            label: "Prefix",
            placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
            // dependentFields: ["DAILY_AMT"],
            // runValidationOnDependentFieldsChange: true,
            // validate: (currentField, dependentFields) => {
            //     if(Number(dependentFields?.DAILY_AMT?.value) >
            //     Number(currentField?.value)) {
            //         return "Weekly Limit should greater than or equal to Daily Limit";
            //     } else {
            //         return "";
            //     }
            // }
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FULL_NAME",
            label: "Full Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm: 8, md: 8, lg:8},
        }
    ]
}
const personal_detail_maiden_data = {
    form: {
        name: "personal_detail_maiden_form",
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
                spacing: 3,
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PREFIX",
            label: "Prefix",
            placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
            // dependentFields: ["DAILY_AMT"],
            // runValidationOnDependentFieldsChange: true,
            // validate: (currentField, dependentFields) => {
            //     if(Number(dependentFields?.DAILY_AMT?.value) >
            //     Number(currentField?.value)) {
            //         return "Weekly Limit should greater than or equal to Daily Limit";
            //     } else {
            //         return "";
            //     }
            // }
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FATHER_SPOUSe_NAME",
            label: "Father/Spouse Name",
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm: 8, md: 8, lg:8},
        }
    ]
}
const personal_detail_father_data = {
    form: {
        name: "personal_detail_father_form",
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
                spacing: 3,
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PREFIX",
            label: "Prefix",
            placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
            // dependentFields: ["DAILY_AMT"],
            // runValidationOnDependentFieldsChange: true,
            // validate: (currentField, dependentFields) => {
            //     if(Number(dependentFields?.DAILY_AMT?.value) >
            //     Number(currentField?.value)) {
            //         return "Weekly Limit should greater than or equal to Daily Limit";
            //     } else {
            //         return "";
            //     }
            // }
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
        }
    ]
}
const personal_detail_mother_data = {
    form: {
        name: "personal_detail_mother_form",
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
                spacing: 3,
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
            divider: {
                fullWidth: true,
            }
        },
    },
    fields: [
        {
            render: {
                componentType: "textField",
            },
            name: "PREFIX",
            label: "Prefix",
            placeholder: "Prefix",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
            // dependentFields: ["DAILY_AMT"],
            // runValidationOnDependentFieldsChange: true,
            // validate: (currentField, dependentFields) => {
            //     if(Number(dependentFields?.DAILY_AMT?.value) >
            //     Number(currentField?.value)) {
            //         return "Weekly Limit should greater than or equal to Daily Limit";
            //     } else {
            //         return "";
            //     }
            // }
        },
        {
            render: {
                componentType: "textField",
            },
            name: "FIRST_NAME",
            label: "First Name",
            placeholder: "First Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
            // dependentFields: ["DAILY_AMT"],
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MIDDLE_NAME",
            label: "Middle Name",
            placeholder: "Middle Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "LAST_NAME",
            label: "Last Name",
            placeholder: "Last Name",
            type: "text",
            GridProps: {xs: 12, sm: 4, md: 3, lg:3, xl:3},
        }
    ]
}
const personal_other_detail_meta_data = {
    form: {
        name: "personal_other_detail_form",
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
                spacing: 3,
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
                componentType: "datePicker",
            },
            name: "DOB",
            label: "Date Of Birth",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "select",
            },
            options: [
                {label: "Minor", value: "minor"},
                {label: "Major", value: "major"}
            ],
            name: "MINOR_MAJOR",
            label: "Minor/Major",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "select",
            },
            options: [
                {label: "Male", value: "male"},
                {label: "Female", value: "female"},
                {label: "Other", value: "other"}
            ],
            name: "GENDER",
            label: "Gender",
            required: true,
            placeholder: "",
            type: "text",
            GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "BLOOD_GROUP",
            label: "Blood Group",
            placeholder: "",
            type: "text",
            // GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "MARITAL_STATUS",
            label: "Marital Status",
            required: true,
            placeholder: "",
            type: "text",
            // GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "NATIONALITY",
            label: "Nationality",
            required: true,
            placeholder: "",
            type: "text",
            // GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RESI_STATUS",
            label: "Resi. Status",
            required: true,
            placeholder: "",
            type: "text",
            // GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "OCCUPATION",
            label: "Occupation",
            required: true,
            placeholder: "",
            type: "text",
            // GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "GROUP",
            label: "Group",
            placeholder: "",
            type: "text",
            // GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "RELIGION",
            label: "Religion",
            required: true,
            placeholder: "",
            type: "text",
            // GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "textField",
            },
            name: "CASTE",
            label: "Caste",
            placeholder: "",
            type: "text",
            // GridProps: {xs: 12, sm: 3, md: 3},
        },
        {
            render: {
                componentType: "datePicker",
            },
            name: "KYC_REVISED_DT",
            label: "KYC Revised Dt.",
            required: true,
            // placeholder: "",
            // type: "datePicker",
            GridProps: {xs: 12, sm: 3, md: 3},
        },
    ]
}

const PersonalDetails = ({isCustomerData, setIsCustomerData, passDataFromPersonalDetails, isLoading, setIsLoading}) => {
  //  const [customerDataCurrentStatus, setCustomerDataCurrentStatus] = useState("none")
  //  const [isLoading, setIsLoading] = useState(false)
const myGridRef = useRef<any>(null);

    useEffect(() => {
        console.log("... personal details", isCustomerData)
        passDataFromPersonalDetails(isCustomerData)
    }, [isCustomerData])

    const onSubmitHandler = (
        data,
        displayData,
        endSubmit,
        setFieldError
      ) => {
        //@ts-ignore
        // endSubmit(true);
        // isErrorFuncRef.current = { data, displayData, endSubmit, setFieldError };
        // console.log(">>isSubmitEventRef.current", isSubmitEventRef.current);
        // isDetailFormRef.current?.handleSubmit(isSubmitEventRef.current, "save");
      };

    return (
        <Grid container rowGap={3}>
            {/* <Typography variant={"h6"}>Personal Details</Typography> */}
            <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Customer Details</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={other_detail_meta_data as MetaDataType}
                            // initialValues={{}}
                            // onSubmitHandler={() => {}}
                            // hidden={false}
                            // displayMode={"view"}
                            // hideDisplayModeInTitle={""}
                            // hideTitleBar={""}
                            formStyle={{}}
                            // controlsAtBottom={false}
                            // formState={{}}
                            // defaultActiveStep={{}}
                            hideHeader={true}
                        >
                            {/* <TextField value={"new"} variant='outlined' /> */}
                            {/* <Button variant='contained'>Click</Button> */}
                        </FormWrapper>
                        <Button color="secondary" onClick={() => {
                            setIsCustomerData(false)
                            setIsLoading(true)
                        }}>Submit</Button>
                        <Button color="secondary" onClick={() => {
                            setIsCustomerData(false)
                            // setIsLoading(true)
                        }}>Reset</Button>
                        <Button color="secondary" disabled={isCustomerData == "editting"} onClick={() => {
                            setIsCustomerData(false)
                            // setIsLoading(true)
                        }}>Edit</Button>
                    </Grid>                    
                </Grid>
            </Grid>

            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Personal Details</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={personal_detail_prefix_data as MetaDataType}
                            // initialValues={{}}
                            // onSubmitHandler={() => {}}
                            // hidden={false}
                            // displayMode={""}
                            // hideDisplayModeInTitle={""}
                            // hideTitleBar={""}
                            formStyle={{}}
                            // controlsAtBottom={false}
                            // formState={{}}
                            // defaultActiveStep={{}}
                            hideHeader={true}
                        >
                            {/* <TextField value={"new"} variant='outlined' /> */}
                            {/* <Button variant='contained'>Click</Button> */}
                        </FormWrapper>
                    </Grid>                    
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Maiden Name</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_maiden_data as MetaDataType}
                        // initialValues={{}}
                        // onSubmitHandler={() => {}}
                        // hidden={false}
                        // displayMode={""}
                        // hideDisplayModeInTitle={""}
                        // hideTitleBar={""}
                        formStyle={{}}
                        // controlsAtBottom={false}
                        // formState={{}}
                        // defaultActiveStep={{}}
                        hideHeader={true}
                    >
                        {/* <TextField value={"new"} variant='outlined' /> */}
                        {/* <Button variant='contained'>Click</Button> */}
                    </FormWrapper>
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Father Name*</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_father_data as MetaDataType}
                        // initialValues={{}}
                        // onSubmitHandler={() => {}}
                        // hidden={false}
                        // displayMode={""}
                        // hideDisplayModeInTitle={""}
                        // hideTitleBar={""}
                        formStyle={{}}
                        // controlsAtBottom={false}
                        // formState={{}}
                        // defaultActiveStep={{}}
                        hideHeader={true}
                    >
                        {/* <TextField value={"new"} variant='outlined' /> */}
                        {/* <Button variant='contained'>Click</Button> */}
                    </FormWrapper>
                </Grid>

                <Divider sx={{mt: 3, color: "var(--theme-color3)"}} textAlign={"left"}>Mother Name*</Divider>
                <Grid item>
                    <FormWrapper 
                        key={"new-form-in-kyc"}
                        metaData={personal_detail_mother_data as MetaDataType}
                        // initialValues={{}}
                        // onSubmitHandler={() => {}}
                        // hidden={false}
                        // displayMode={""}
                        // hideDisplayModeInTitle={""}
                        // hideTitleBar={""}
                        formStyle={{}}
                        // controlsAtBottom={false}
                        // formState={{}}
                        // defaultActiveStep={{}}
                        hideHeader={true}
                    >
                        {/* <TextField value={"new"} variant='outlined' /> */}
                        {/* <Button variant='contained'>Click</Button> */}
                    </FormWrapper>
                </Grid>                
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="220px" width="100%"></Skeleton> : null}

            {isCustomerData ? <Grid 
                sx={{
                    backgroundColor:"var(--theme-color2)", 
                    padding:(theme) => theme.spacing(2), 
                    border: "1px solid rgba(0,0,0,0.12)", 
                    borderRadius: "20px"
                }} container item xs={12} direction={'column'}>
                <Grid item>
                    <Typography sx={{color:"var(--theme-color3)"}} gutterBottom={true} variant={"h6"}>Other Personal Details</Typography>
                </Grid>
                <Grid container item>
                    <Grid item xs={12}>
                        <FormWrapper 
                            key={"new-form-in-kyc"}
                            metaData={personal_other_detail_meta_data as MetaDataType}
                            // initialValues={{}}
                            // onSubmitHandler={() => {}}
                            // hidden={false}
                            // displayMode={""}
                            // hideDisplayModeInTitle={""}
                            // hideTitleBar={""}
                            formStyle={{}}
                            // controlsAtBottom={false}
                            // formState={{}}
                            // defaultActiveStep={{}}
                            hideHeader={true}
                        >
                            {/* <TextField value={"new"} variant='outlined' /> */}
                            {/* <Button variant='contained'>Click</Button> */}
                        </FormWrapper>
                    </Grid>                    
                </Grid>
            </Grid> : isLoading ? <Skeleton variant='rounded' animation="wave" height="300px" width="100%"></Skeleton> : null}
        </Grid>        
    )

    // return (
    //     <Box sx={{ flexGrow: 1 }}>
    //   <Grid container spacing={14}>
    //     <Grid item xs={8}>
    //       <Item>xs=8</Item>
    //     </Grid>
    //     {/* <Grid item xs={4}>
    //       <Item>xs=4</Item>
    //     </Grid>
    //     <Grid item xs={4}>
    //       <Item>xs=4</Item>
    //     </Grid>
    //     <Grid item xs={8}>
    //       <Item>xs=8</Item>
    //     </Grid> */}
    //   </Grid>
    // </Box>
    // )
}

export default PersonalDetails