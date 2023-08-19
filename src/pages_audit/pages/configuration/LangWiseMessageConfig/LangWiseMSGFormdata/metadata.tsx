import { MasterDetailsMetaData } from "components/formcomponent/masterDetails/types";

export const langWiseMsgMetaData: MasterDetailsMetaData = {
  masterForm: {
    form: {
      name: "LangMsgConfig",
      label: "Language Wise Message Configuration",
      resetFieldOnUnmount: false,
      validationRun: "onBlur",
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
    },
    fields: [
      // {
      //   render: { componentType: "hidden" },
      //   name: "TRAN_CD",
      // },
      {
        render: { componentType: "textField" },
        name: "DEFAULT_LANG_CODE",
        label: "Default Language",
        placeholder: " ",
        type: "text",
        required: true,
        isReadOnly: true,
        maxLength: 300,
        showMaxLength: false,
        GridProps: { xs: 12, md: 2, sm: 2 },
        fullWidth: true,
        autoComplete: "off",
        // schemaValidation: {
        //   type: "string",
        //   rules: [
        //     { name: "required", params: ["This field is required"] },
        //     { name: "TEMPLATE_DESC", params: ["Please select Description."] },
        //   ],
        // },
      },
      {
        render: { componentType: "textField" },
        name: "DEFAULT_LANG_MSG",
        label: "Default Message",
        placeholder: " ",
        type: "text",
        required: true,
        maxLength: 300,
        showMaxLength: false,
        GridProps: { xs: 12, md: 6, sm: 6 },
        fullWidth: true,
        autoComplete: "off",
        // schemaValidation: {
        //   type: "string",
        //   rules: [
        //     { name: "required", params: ["This field is required"] },
        //     { name: "TEMPLATE_DESC", params: ["Please select Description."] },
        //   ],
        // },
      },
    ],
  },
  detailsGrid: {
    gridConfig: {
      dense: true,
      gridLabel: "Change Leaveas Master",
      rowIdColumn: "SR_CD",
      defaultColumnConfig: { width: 150, maxWidth: 250, minWidth: 100 },
      allowColumnReordering: true,
      hideHeader: true,
      disableGroupBy: true,
      // enablePagination: true,
      containerHeight: { min: "40vh", max: "40vh" },
      allowRowSelection: false,
      hiddenFlag: "_hidden",
      disableLoader: true,
    },
    columns: [
      {
        accessor: "SR_CD",
        columnName: "Serial No",
        componentType: "default",
        sequence: 1,
        alignment: "center",
        width: 100,
        maxWidth: 150,
        minWidth: 70,
        isAutoSequence: true,
      },
      {
        accessor: "LANG_CODE",
        columnName: "Language",
        componentType: "editableSelect",
        placeholder: " ",
        sequence: 2,
        alignment: "center",
        width: 160,
        maxWidth: 200,
        minWidth: 100,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["This field is required"] }],
        },
        // defaultOptionLabel: "PREPAID",
        // defaultValue: "POSTPAID",
        defaultValue: "1",
        enableDefaultOption: true,
        options: () => {
          return [
            { value: "guj", label: " ગુજરાતી" },
            { value: "en", label: "English" },
            { value: "spanish", label: "española" },
            { value: "french", label: "Français" },
          ];
        },
        disableCachingOptions: true,
        validation: (value, data, prev) => {
          if (!Boolean(value)) {
            return "This field is required";
          }
          if (Array.isArray(prev)) {
            let lb_error = false;
            let ls_msg = "";
            prev.forEach((item, index) => {
              if (value === item?.LANG_CODE) {
                lb_error = true;
                ls_msg =
                  "Discription is Already entered at Line " + (index + 1);
                return ls_msg;
              }
            });
            if (lb_error) {
              return ls_msg;
            }
          }
          return "";
        },
      },
      {
        accessor: "LANG_MSG",
        columnName: "Message to be configured",
        componentType: "editableTextField",
        placeholder: " ",
        sequence: 2,
        alignment: "left",
        width: 220,
        maxWidth: 270,
        minWidth: 150,
        schemaValidation: {
          type: "string",
          rules: [{ name: "required", params: ["This field is required"] }],
        },
      },
      {
        columnName: "Action",
        componentType: "deleteRowCell",
        accessor: "_hidden",
        sequence: 3,
      },
    ],
  },
};
