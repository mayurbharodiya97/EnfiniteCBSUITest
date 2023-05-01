import { FilterFormMetaType } from "components/formcomponent";

export const ReleaseUserFilterForm: FilterFormMetaType = {
  gridConfig: {
    dense: true,
    title: "Release Block Users",
    allowColumnHiding: false,
    submitButtonName: "Fetch",
  },
  fields: [
    {
      name: "release_type",
      defaultValue: "AFTER",
      isVisible: true,
      gridconfig: { xs: 6, sm: 5 },
      defaultfocus: true,
      label: "Release Type*",
      autoComplete: "off",
      placeholder: "",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      type: "select",
      optiondata: [
        { label: "After Register", value: "AFTER" },
        { label: "Before Register", value: "BEFOR" },
      ],
    },
    {
      name: "block_type",
      defaultValue: "ALL",
      isVisible: true,
      gridconfig: { xs: 6, sm: 5 },
      defaultfocus: true,
      label: "Block Type*",
      autoComplete: "off",
      placeholder: "Please select status",
      isColumnHidingDisabled: true,
      entertoSubmit: true,
      type: "select",
      optiondata: [
        { label: "ALL", value: "ALL" },
        { label: "Login Password", value: "LOGINPASS" },
        { label: "Login PIN", value: "LOGIN" },
        { label: "OTP PIN", value: "OTP" },
        // { label: "Transaction PIN", value: "TPIN" },
      ],
      dependFields: ["release_type"],
      dependFieldsonchange: (colomnValue, value, name, extraData) => {
        if (value === "BEFOR") {
          return { isVisible: false };
        } else {
          return { isVisible: true };
        }
      },
    },
  ],
};
