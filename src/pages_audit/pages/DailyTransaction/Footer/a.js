import React, { useState } from "react";

export const SmsEmailRetrievalMetadata = {
  form: {
    name: "enterRetrievalParamaters",
    label: "Enter Retrieval Parameters",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        container: {
          direction: "row",
          spacing: 2,
        },
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "datePicker",
      },
      name: "A_FROM_DT",
      label: "From Date",
      placeholder: "",
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      // __EDIT__: { isReadOnly: true },
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
      onFocus: (date) => {
        date.target.select();
      },
      schemaValidation: {
        type: "date",
        rules: [
          { name: "required", params: ["From Date is required."] },
          { name: "typeError", params: ["Must be a valid date"] },
        ],
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "A_TO_DT",
      label: "To Date",
      placeholder: "",
      defaultValue: new Date(),
      fullWidth: true,
      format: "dd/MM/yyyy",
      schemaValidation: {
        type: "date",
        rules: [
          { name: "required", params: ["To Date is required."] },
          { name: "typeError", params: ["Must be a valid date"] },
        ],
      },
      onFocus: (date) => {
        date.target.select();
      },
      dependentFields: ["A_FROM_DT"],
      runValidationOnDependentFieldsChange: true,
      validate: {
        conditions: {
          all: [
            {
              fact: "dependentFields",
              path: "$.A_FROM_DT.value",
              operator: "lessThanInclusiveDate",
              value: { fact: "currentField", path: "$.value" },
            },
          ],
        },
        success: "",
        failure: "To Date should be greater than or equal to From Date.",
      },
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },

    {
      render: {
        componentType: "select",
      },
      name: "A_STATUS",
      label: "Status",
      fullWidth: true,
      placeholder: "",
      defaultOptionLabel: "Select Status",
      type: "text",
      defaultValue: "ALL",
      options: [
        { label: "ALL", value: "ALL" },
        { label: "PENDING", value: "P" },
        { label: "SUCCCESS", value: "Y" },
        { label: "REJECTED", value: "R" },
      ],
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "A_FLAG",
      label: "OTP Type",
      defaultValue: "S",
      defaultOptionLabel: "Select OTP Type",
      options: [
        { label: "SMS", value: "S" },
        { label: "EMAIL", value: "E" },
      ],
      fullWidth: true,
      placeholder: "",
      type: "text",
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "MOBILE_NO",
      label: "Mobile Number",
      fullWidth: true,
      autoComplete: "off",
      placeholder: "Enter Mobile Number",
      type: "text",
      dependentFields: ["A_FLAG"],
      maxLength: 13,
      showMaxLength: true,
      FormatProps: {
        allowNegative: false,
        allowLeadingZeros: true,
        decimalScale: 0,
        isAllowed: (values) => {
          if (values?.value?.length > 13) {
            return false;
          }
          return true;
        },
      },
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.A_FLAG?.value === "S") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "EMAIL_ID",
      label: "Email ID",
      fullWidth: true,
      placeholder: "Enter Email ID",
      type: "text",
      dependentFields: ["A_FLAG"],
      shouldExclude(fieldData, dependentFieldsValues, formState) {
        if (dependentFieldsValues?.A_FLAG?.value === "E") {
          return false;
        } else {
          return true;
        }
      },
      GridProps: {
        xs: 12,
        md: 12,
        sm: 12,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "A_PAGE_NO",
      label: "Page Number",
      fullWidth: true,
      placeholder: "Enter Page Number",
      type: "text",
      defaultValue: 1,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
    {
      render: {
        componentType: "textField",
      },
      name: "A_PAGE_SIZE",
      label: "Page Size",
      fullWidth: true,
      placeholder: "Enter Page Size",
      type: "text",
      defaultValue: 100,
      GridProps: {
        xs: 12,
        md: 6,
        sm: 6,
      },
    },
  ],
};
