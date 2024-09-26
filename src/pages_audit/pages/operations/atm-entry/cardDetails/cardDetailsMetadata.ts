import * as API from "../api";
import { utilFunction } from "@acuteinfo/common-base";
export const CardDetailsMetaData = {
  form: {
    name: "atm-card-details",
    label: "AtmCardDetails",
    resetFieldOnUnmount: false,
    validationRun: "onBlur",
    render: {
      ordering: "auto",
      renderType: "simple",
      gridConfig: {
        item: {
          xs: 12,
          sm: 3,
          md: 3,
        },
        container: {
          direction: "row",
          spacing: 1.5,
        },
      },
    },
    componentProps: {
      datePicker: {
        fullWidth: true,
      },
      select: {
        fullWidth: true,
      },
      textField: {
        fullWidth: true,
      },
      numberFormat: {
        fullWidth: true,
      },
    },
  },
  fields: [
    {
      render: {
        componentType: "datePicker",
      },
      name: "REQ_DT",
      isWorkingDate: true,
      isReadOnly: true,
      label: "RequestDate",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "STATUS",
      label: "CardStatus",
      defaultValue: "P",
      isReadOnly: (fieldValue, dependentField) => {
        if (dependentField?.STATUS_EDIT_FLAG?.value === "N") {
          return true;
        } else {
          return false;
        }
      },
      options: () => API.cardStatusList(),
      dependentFields: ["STATUS_EDIT_FLAG", "TRAN_CD"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (formState?.isSubmitting) return {};
        if (field?.value) {
          let statusData: any = [];
          formState?.setIsData((old) => {
            if (old?.gridData?.length) {
              old?.gridData?.map((item) => {
                if (item?.STATUS) {
                  statusData.push(item?.STATUS);
                }
              });
            }
            return old;
          });
          let apiReq = {
            ENTRY_TYPE: dependentValue?.TRAN_CD?.value ? "M" : "F",
            OLD_STATUS: formState?.reqData?.OLD_STATUS ?? "",
            NEW_STATUS: field?.value,
            EXISTING_ROWS: statusData.join(","),
            ENTERED_BRANCH_CD: formState?.reqData?.ENTERED_BRANCH_CD ?? "",
            ENTERED_COMP_CD: formState?.reqData?.ENTERED_COMP_CD ?? "",
            LAST_MODIFIED_DATE: formState?.reqData?.LAST_MODIFIED_DATE ?? "",
            ENTERED_DATE: formState?.reqData?.ENTERED_DATE ?? "",
            ISSUE_DT: formState?.reqData?.ISSUE_DT ?? "",
            CONFIRMED: formState?.reqData?.CONFIRMED ?? "",
            PARA_320: formState?.reqData?.PARA_320,
            PARA_604: formState?.reqData?.PARA_604,
            SCREEN_REF: "MST/846",
          };
          let { resp, status } = await API.validateCardStatus(apiReq);

          if (status === "0" && resp) {
            if (resp?.O_STATUS === "999") {
              let buttonName = await formState.MessageBox({
                messageTitle: "ValidationAlert",
                message: resp?.O_MESSAGE,
              });
              if (buttonName === "Ok") {
                return {
                  STATUS: { value: "", isFieldFocused: true },
                  EXPIRY_DT_DISABLE: { value: "" },
                  ISSUE_DT_VISIBLE: { value: "" },
                  DEACTIVE_DT_DISABLE: { value: "" },
                  CITIZEN_ID_VISIBLE: { value: "" },
                  M_CARD_NO_VISIBLE: { value: "" },
                  CARD_NO_VISIBLE: { value: "" },
                  DEACTIVE_DT: { value: "" },
                  DEACTIVE_DT_VISIBLE: { value: "" },
                  ISSUE_DT: { value: "" },
                  REMARKS_DISABLE: { value: "" },
                  REMARKS_VISIBLE: { value: "" },
                };
              }
            } else if (resp?.O_STATUS === "0") {
              return {
                EXPIRY_DT_DISABLE: { value: resp?.EXPIRY_DT_DISABLE },
                ISSUE_DT_VISIBLE: { value: resp?.ISSUE_DT_VISIBLE },
                DEACTIVE_DT_DISABLE: { value: resp?.DEACTIVE_DT_DISABLE },
                CITIZEN_ID_VISIBLE: { value: resp?.CITIZEN_ID_VISIBLE },
                M_CARD_NO_VISIBLE: { value: resp?.M_CARD_NO_VISIBLE },
                CARD_NO_VISIBLE: { value: resp?.CARD_NO_VISIBLE },
                DEACTIVE_DT: { value: resp?.DEACTIVE_DT },
                DEACTIVE_DT_VISIBLE: { value: resp?.DEACTIVE_DT_VISIBLE },
                REMARKS_DISABLE: { value: resp?.REMARKS_DISABLE },
                REMARKS_VISIBLE: { value: resp?.REMARKS_VISIBLE },
                ISSUE_DT: {
                  value: resp?.SET_ISSUE_DT === "Y" ? resp?.ISSUE_DT : "",
                },

                // O_COLUMN_NM: "",
                // SET_NULL: "N",
              };
            }
            return {};
          }
        } else if (!field?.value) {
          return {
            EXPIRY_DT_DISABLE: { value: "" },
            ISSUE_DT_VISIBLE: { value: "" },
            DEACTIVE_DT_DISABLE: { value: "" },
            CITIZEN_ID_VISIBLE: { value: "" },
            M_CARD_NO_VISIBLE: { value: "" },
            CARD_NO_VISIBLE: { value: "" },
            DEACTIVE_DT: { value: "" },
            DEACTIVE_DT_VISIBLE: { value: "" },
            ISSUE_DT: { value: "" },
            REMARKS_DISABLE: { value: "" },
            REMARKS_VISIBLE: { value: "" },
          };
        }
      },
      runPostValidationHookAlways: true,
      _optionsKey: "cardStatusList",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
    },
    {
      render: {
        componentType: "select",
      },
      name: "CARD_ISSUE_TYPE",
      label: "IssueTo",
      defaultValue: "A",
      placeholder: "Please Select Issue",
      options: () => {
        return [
          { value: "A", label: "Account" },
          { value: "J", label: "Join A/C" },
        ];
      },
      _optionsKey: "PAYABLE_AT_PAR",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
    },

    {
      render: {
        componentType: "numberFormat",
      },
      name: "CUSTOMER_ID",
      label: "CustomerId",
      placeholder: "Enter Customer ID",
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
      dependentFields: ["CARD_ISSUE_TYPE"],
      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        if (field?.value) {
          let apiRequest = {
            ACCT_CD: "",
            ACCT_TYPE: "",
            BRANCH_CD: "",
            PARA_602: formState?.reqData?.PARA_602,
            PARA_946: formState?.reqData?.PARA_946,
            SCREEN_REF: "MST/846",
            CUSTOMER_ID: field?.value,
          };

          let postData = await API.validateAcctAndCustId(apiRequest);
          let apiRespMSGdata = postData?.[0]?.MSG;
          let isReturn;
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
                    : "ALert message",
                  apiRespMSGdata[i]?.O_MESSAGE,
                  apiRespMSGdata[i]?.O_STATUS === "99" ? ["Yes", "No"] : ["Ok"],
                  apiRespMSGdata[i]?.O_STATUS
                );

                if (btnName.buttonName === "No" || btnName.status === "999") {
                  formState.setDataOnFieldChange("RES_DATA", {});
                  return {
                    ACCT_NM: { value: "" },
                  };
                } else {
                  formState.setDataOnFieldChange("RES_DATA", postData?.[0]);
                  isReturn = true;
                }
              } else {
                formState.setDataOnFieldChange("RES_DATA", postData?.[0]);
                isReturn = true;
              }
            }
          }
          if (Boolean(isReturn)) {
            return {
              ACCT_NM: { value: postData?.[0]?.ACCT_NM },
            };
          }
        } else if (!field?.value) {
          return {
            ACCT_NM: { value: "" },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,

      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.CARD_ISSUE_TYPE?.value === "J") {
          return false;
        } else {
          return true;
        }
      },
    },

    // {
    //   render: {
    //     componentType: "textField",
    //   },
    //   name: "CUSTOMER_NM",
    //   label: "CustomerName",
    //   GridProps: {
    //     xs: 12,
    //     md: 3.5,
    //     sm: 3.5,
    //     lg: 3.5,
    //     xl: 3.5,
    //   },
    // },

    {
      render: {
        componentType: "datePicker",
      },
      name: "ISSUE_DT",
      label: "IssueRejectDate",

      postValidationSetCrossFieldValues: async (
        field,
        formState,
        authState,
        dependentValue
      ) => {
        let resultDate = new Date(field?.value);
        resultDate.setDate(
          resultDate.getDate() + Number(formState?.reqData?.PARA_200)
        );
        return {
          EXPIRE_DT: { value: resultDate },
        };
      },
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
      },
      dependentFields: ["STATUS", "ISSUE_DT_VISIBLE"],
      shouldExclude(fieldData, dependentFields) {
        if (
          dependentFields?.STATUS?.value === "P" ||
          dependentFields?.ISSUE_DT_VISIBLE?.value === "N"
        ) {
          return true;
        } else {
          return false;
        }
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "CITIZEN_ID",
      label: "CitizenID",
      placeholder: "Enter Citizen ID",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
      },
      txtTransform: "uppercase",
      dependentFields: ["STATUS", "CITIZEN_ID_VISIBLE"],
      shouldExclude(fieldData, dependentFields) {
        if (
          dependentFields?.STATUS?.value === "P" ||
          dependentFields?.CITIZEN_ID_VISIBLE?.value === "N"
        ) {
          return true;
        } else {
          return false;
        }
      },
      postValidationSetCrossFieldValues: async (field, formState) => {
        if (field?.value) {
          let CitizenIdData: any = [];
          formState?.setIsData((old) => {
            if (old?.gridData?.length) {
              old?.gridData?.map((item) => {
                if (item?.CITIZEN_ID) {
                  CitizenIdData.push(item?.CITIZEN_ID);
                }
              });
            }
            return old;
          });
          let apiRequest = {
            CITIZEN_ID: field?.value,
            // CITIZENID_DATA: "IA00377209,IA00357709",
            CITIZENID_DATA: CitizenIdData.join(","),
            SCREEN_REF: "MST/846",
          };

          let postData = await API.validateCitizenId(apiRequest);
          if (postData?.length) {
            if (postData?.[0]?.O_STATUS === "999") {
              let buttonName = await formState.MessageBox({
                messageTitle: "ValidationAlert",
                message: postData?.[0]?.O_MESSAGE,
              });
              if (buttonName === "Ok") {
                return {
                  CITIZEN_ID: { value: "", isFieldFocused: true },
                  M_CARD_NO: { value: "" },
                  CARD_NO: { value: "" },
                  CARD_TYPE: { value: "" },
                };
              }
            } else {
              return {
                M_CARD_NO: { value: postData?.[0]?.M_CARD_NO },
                CARD_NO: { value: postData?.[0]?.M_CARD_NO },
                CARD_TYPE: { value: postData?.[0]?.CARD_TYPE },
              };
            }
          }
        } else if (!field?.value) {
          return {
            ACCT_NM: { value: "" },
          };
        }
        return {};
      },
      runPostValidationHookAlways: true,
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "M_CARD_NO",
      placeholder: "Enter Card No.",
      label: "CardNo",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
      dependentFields: ["STATUS", "M_CARD_NO_VISIBLE", "CARD_NO"],
      shouldExclude(fieldData, dependentFields) {
        if (
          dependentFields?.STATUS?.value === "P" ||
          dependentFields?.M_CARD_NO_VISIBLE?.value === "N"
        ) {
          return true;
        } else {
          return false;
        }
      },
      validate: (columnValue) => {
        if (!columnValue.value) {
          return "Please Enter Card Number";
        } else if (columnValue.value?.length != 16) {
          return "Card number should be 16 digits";
        }
        return "";
      },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   let value = dependentFields?.CARD_NO?.value;
      //   return value;
      // },
    },
    {
      render: {
        componentType: "numberFormat",
      },
      name: "CARD_NO",
      // maxLength: 16,
      placeholder: "Enter Card No.",
      label: "CardNo",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
      },
      dependentFields: ["CARD_NO_VISIBLE", "M_CARD_NO"],
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.CARD_NO_VISIBLE?.value === "Y") {
          return false;
        } else {
          return true;
        }
      },

      validate: (columnValue) => {
        if (!columnValue.value) {
          return "Please Enter Card Number";
        } else if (columnValue.value?.length != 16) {
          return "Card number should be 16 digits";
        }
        return "";
      },
      // setValueOnDependentFieldsChange: (dependentFields) => {
      //   let value = dependentFields?.M_CARD_NO?.value;
      //   return value;
      // },
    },

    {
      render: {
        componentType: "autocomplete",
      },
      name: "CARD_TYPE",
      label: "CardType",
      placeholder: "Select Card Type",
      options: () => API.cardTypeList(),
      _optionsKey: "cardTypeList",
      GridProps: {
        xs: 12,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
      },
      dependentFields: ["STATUS"],
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.STATUS?.value === "P") {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "EXPIRE_DT",
      label: "ExpireDate",
      dependentFields: ["EXPIRY_DT_DISABLE"],
      isReadOnly: (fieldValue, dependentField) => {
        if (dependentField?.EXPIRY_DT_DISABLE?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
    },
    {
      render: {
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remarks",
      isReadOnly: (fieldValue, dependentField) => {
        if (dependentField?.REMARKS_DISABLE?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
      placeholder: "EnterRemarks",
      GridProps: {
        xs: 12,
        md: 4.5,
        sm: 4.5,
        lg: 4.5,
        xl: 4.5,
      },
      dependentFields: ["STATUS", "REMARKS_VISIBLE", "REMARKS_DISABLE"],
      shouldExclude(fieldData, dependentFields) {
        if (
          dependentFields?.STATUS?.value === "P" ||
          dependentFields?.REMARKS_VISIBLE?.value === "N"
        ) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      render: {
        componentType: "datePicker",
      },
      name: "DEACTIVE_DT",
      isWorkingDate: true,
      label: "DeactiveDate",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
      },
      dependentFields: ["STATUS", "DEACTIVE_DT_VISIBLE", "DEACTIVE_DT_DISABLE"],
      shouldExclude(fieldData, dependentFields) {
        if (
          dependentFields?.STATUS?.value === "P" ||
          dependentFields?.DEACTIVE_DT_VISIBLE?.value === "N"
        ) {
          return true;
        } else {
          return false;
        }
      },
      isReadOnly: (fieldValue, dependentField) => {
        if (dependentField?.DEACTIVE_DT_DISABLE?.value === "Y") {
          return true;
        } else {
          return false;
        }
      },
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "REMARKS_VISIBLE",
    },

    {
      render: {
        componentType: "hidden",
      },
      name: "REMARKS_DISABLE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ISSUE_DT_VISIBLE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "STATUS_EDIT_FLAG",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CITIZEN_ID_VISIBLE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "M_CARD_NO_VISIBLE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "CARD_NO_VISIBLE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "EXPIRY_DT_DISABLE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DEACTIVE_DT_DISABLE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DEACTIVE_DT_VISIBLE",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "ID_NO",
    },
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
      name: "REASON",
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISPLAY_CARD_ISSUE_TYPE",

      dependentFields: ["CARD_ISSUE_TYPE"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          dependentFields?.CARD_ISSUE_TYPE?.value === "A"
            ? "Account"
            : dependentFields?.CARD_ISSUE_TYPE?.value === "J"
            ? "Join A/C"
            : "";
        return value;
      },
    },
    {
      render: {
        componentType: "hidden",
      },
      name: "DISPLAY_STATUS",
      dependentFields: ["STATUS"],
      setValueOnDependentFieldsChange: (dependentFields) => {
        let value =
          dependentFields?.STATUS?.value === "B"
            ? "Block"
            : dependentFields?.STATUS?.value === "D"
            ? "Destroy"
            : dependentFields?.STATUS?.value === "A"
            ? "Issued"
            : dependentFields?.STATUS?.value === "L"
            ? "Lost"
            : dependentFields?.STATUS?.value === "N"
            ? "OFF"
            : dependentFields?.STATUS?.value === "P"
            ? "Pending Issue"
            : dependentFields?.STATUS?.value === "R"
            ? "Reject (OFF)"
            : dependentFields?.STATUS?.value === "C"
            ? "Replace"
            : "";
        return value;
      },
    },
  ],
};
