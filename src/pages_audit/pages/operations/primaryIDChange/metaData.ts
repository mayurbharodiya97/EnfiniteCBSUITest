import { FilterFormMetaType } from "components/formcomponent";
import { getSearchParameter } from "./api";

export const PrimaryIDChangeFilterForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Primary Identifier Change",
    allowColumnHiding: true,
    submitButtonName: "Fetch Details",
    // submitButtonHide: true,
  },
  fields: [
    {
      accessor: "SEARCH_WITH",
      name: "SEARCH_WITH",
      defaultValue: "U",
      isVisible: true,
      gridconfig: { xs: 6, sm: 3 },
      label: "Search",
      autoComplete: "off",
      placeholder: "Select Option",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      type: "select",
      optiondata: () => getSearchParameter(),
      _optionsKey: "getSearchParameter",
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
    },
    {
      accessor: "REG_ACCT_CARD_NO",
      name: "REG_ACCT_CARD_NO",
      defaultValue: "",
      isVisible: true,
      label: "User Name",
      gridconfig: { xs: 6, sm: 3 },
      defaultfocus: true,
      autoComplete: "off",
      placeholder: "User Name",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      validate: (columnValue, allField, flag) => {
        if (!Boolean(columnValue)) {
          return "This field is required.";
        }
        return "";
      },
      dependFields: ["SEARCH_WITH"],
      dependFieldsonchange: (
        dependfielddata,
        values,
        changesColumn,
        extraData
      ) => {
        if (changesColumn === "SEARCH_WITH" && Boolean(extraData)) {
          let newLabel = extraData.startsWith("Using")
            ? extraData.substring(6)
            : extraData;
          return { label: newLabel, placeholder: newLabel, __DATA: "" };
        } else {
          return { label: "Search Parameter", placeholder: "Enter value" };
        }
      },
    },
    {
      accessor: "MASK_REG_AC_NO",
      name: "MASK_REG_AC_NO",
      label: "SignUp With",
      placeholder: "SignUp With",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
    },
    {
      accessor: "PASSWORD_CHANGE_DT",
      name: "PASSWORD_CHANGE_DT",
      label: "Password Change Date",
      placeholder: "Password Change Date",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
    },
    {
      accessor: "PRIMARY_APP_SOURCE",
      name: "PRIMARY_APP_SOURCE",
      label: "Primary Source",
      placeholder: "Primary Source",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
    },
    {
      accessor: "PRIMARY_CBNUMBER",
      name: "PRIMARY_CBNUMBER",
      label: "Primary CB Number",
      placeholder: "Primary CB Number",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
    },
    {
      accessor: "CUSTOM_USER_NM",
      name: "CUSTOM_USER_NM",
      label: "Login ID",
      placeholder: "Login ID",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
    },

    {
      accessor: "LAST_LOGIN_DT",
      name: "LAST_LOGIN_DT",
      label: "Last Login Date",
      placeholder: "Last Login Date",
      isDisabled: true,
      gridconfig: { xs: 6, sm: 3 },
    },
  ],
};
