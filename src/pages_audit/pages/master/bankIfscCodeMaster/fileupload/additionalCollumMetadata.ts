import { GridColumnType } from "@acuteinfo/common-base";
import { GeneralAPI } from "registry/fns/functions";
import * as Api from "../api";
export const AdditionalcollumnMetadata: GridColumnType[] = [
  {
    columnName: "Select Cofiguration",
    componentType: "editableSelect",
    accessor: "DESCRIPTION",
    options: Api.GetBankIfscImportDdwn,
    _optionsKey: "GetBankIfscImportDdwn",
    sequence: 3,
    alignment: "left",
    width: 350,
    minWidth: 50,
    maxWidth: 600,
  },
];
