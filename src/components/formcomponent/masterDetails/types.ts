import { GridMetaDataType } from "components/dataTableStatic";
import { FieldMetaDataType, FormMetaDataType } from "components/dyanmicForm";

export interface MasterDetailsMetaData {
  masterForm: {
    form: any;
    fields: FieldMetaDataType[];
  };
  detailsGrid: GridMetaDataType;
}
