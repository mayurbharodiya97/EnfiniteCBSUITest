import { utilFunction } from "@acuteinfo/common-base";
import { cardStatusList, cardTypeList, validateAcctAndCustId } from "../api";
export const CardDetailsMetaData = {
  form: {
    name: "atm-card-details",
    label: "Atm Card Details",
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
      label: "Request Date",
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
      label: "Card Status",
      defaultValue: "P",
      options: () => cardStatusList(),
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
      name: "ISSUE_TO",
      label: "Issue To",
      defaultValue: "A",
      placeholder: "Please Select Issue",
      options: () => {
        return [
          { value: "A", label: "Account" },
          { value: "J", label: "Join A/C " },
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
            PARA_602: "Y",
            PARA_946: "N",
            SCREEN_REF: "MST/846",
            CUSTOMER_ID: field?.value,
          };

          let postData = await validateAcctAndCustId(apiRequest);
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
          console.log("<<<postdata", postData);
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

                console.log("<<<buttnnama", btnName);
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
      dependentFields: ["ISSUE_TO"],
      shouldExclude(fieldData, dependentFields) {
        if (dependentFields?.ISSUE_TO?.value === "J") {
          return false;
        } else {
          return true;
        }
      },
    },

    {
      render: {
        componentType: "textField",
      },
      name: "ACCT_NM",
      label: "Name",
      GridProps: {
        xs: 12,
        md: 3.5,
        sm: 3.5,
        lg: 3.5,
        xl: 3.5,
      },
    },

    {
      render: {
        componentType: "datePicker",
      },
      name: "ISSUE_DT",
      label: "Issue/Reject Date",
      GridProps: {
        xs: 12,
        md: 2,
        sm: 2,
        lg: 2,
        xl: 2,
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
        componentType: "numberFormat",
      },
      name: "CITIZEN_ID",
      label: "Citizen ID",
      placeholder: "Enter Citizen ID",
      GridProps: {
        xs: 12,
        md: 2.5,
        sm: 2.5,
        lg: 2.5,
        xl: 2.5,
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
        componentType: "numberFormat",
      },
      name: "M_CARD_NO",
      placeholder: "Enter Card No.",
      label: "Card No.",
      GridProps: {
        xs: 12,
        md: 4,
        sm: 4,
        lg: 4,
        xl: 4,
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
        componentType: "autocomplete",
      },
      name: "CARD_TYPE",
      label: "Card Type",
      placeholder: "Select Card Type",
      options: () => cardTypeList(),
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
        componentType: "Remark",
      },
      name: "REMARKS",
      label: "Remarks",
      placeholder: "EnterRemarks",
      GridProps: {
        xs: 12,
        md: 4.5,
        sm: 4.5,
        lg: 4.5,
        xl: 4.5,
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
      name: "DEACTIVE_DT",
      isWorkingDate: true,
      label: "De-active (Lost/Destroy) Date",
      GridProps: {
        xs: 12,
        md: 3,
        sm: 3,
        lg: 3,
        xl: 3,
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
  ],
};
