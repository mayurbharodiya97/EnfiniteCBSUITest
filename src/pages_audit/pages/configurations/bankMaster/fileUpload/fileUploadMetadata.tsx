import { GridColumnType } from "components/dataTableStatic";
export const BankMasterUploadMetadata: GridColumnType[] = [
  {
    componentType: "editableCheckbox",
    columnName: "NPSB",
    accessor: "NPSB_ENABLED",
    sequence: 4,
    alignment: "center",
    width: 80,
    maxWidth: 150,
    minWidth: 70,
    validation: (value, data) => {
      if (
        Boolean(value) &&
        (Boolean(data?.RTGS_ENABLED) ||
          Boolean(data?.BEFTN_ENABLED) ||
          Boolean(data?.ALL))
      ) {
        return "Please select any one file type.";
      }
      return "";
    },
  },
  {
    componentType: "editableCheckbox",
    columnName: "BEFTN",
    accessor: "BEFTN_ENABLED",
    sequence: 5,
    alignment: "center",
    width: 80,
    maxWidth: 150,
    minWidth: 70,
    validation: (value, data) => {
      if (
        Boolean(value) &&
        (Boolean(data?.RTGS_ENABLED) ||
          Boolean(data?.NPSB_ENABLED) ||
          Boolean(data?.ALL))
      ) {
        return "Please select any one file type.";
      }
      return "";
    },
  },
  {
    componentType: "editableCheckbox",
    columnName: "RTGS",
    accessor: "RTGS_ENABLED",
    sequence: 6,
    alignment: "center",
    width: 80,
    maxWidth: 150,
    minWidth: 70,
    validation: (value, data) => {
      if (
        Boolean(value) &&
        (Boolean(data?.BEFTN_ENABLED) ||
          Boolean(data?.NPSB_ENABLED) ||
          Boolean(data?.ALL))
      ) {
        return "Please select any one file type.";
      }
      return "";
    },
  },
  {
    componentType: "editableCheckbox",
    columnName: "Routing",
    accessor: "ALL",
    sequence: 6,
    alignment: "center",
    width: 80,
    maxWidth: 150,
    minWidth: 70,
    defaultValue: true,
    validation: (value, data) => {
      if (
        !Boolean(value) &&
        !Boolean(data?.BEFTN_ENABLED) &&
        !Boolean(data?.NPSB_ENABLED) &&
        !Boolean(data?.RTGS_ENABLED)
      ) {
        return "Please select any one file type.";
      } else if (
        Boolean(value) &&
        (Boolean(data?.BEFTN_ENABLED) ||
          Boolean(data?.NPSB_ENABLED) ||
          Boolean(data?.RTGS_ENABLED))
      ) {
        return "Please select any one file type.";
      }
      return "";
    },
  },
];
