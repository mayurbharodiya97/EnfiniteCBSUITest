import { GridMetaDataType } from "components/dataTable/types";
import { FilterFormMetaType } from "components/formcomponent/filterform";
import { ActionTypes } from "components/dataTable";
export interface DetailsGridWithHeaderArguType {
  metadata: GridMetaDataType;
  ClosedEventCall: Function;
  data: any;
  HeaderMetaData: FilterFormMetaType;
  HeaderData: any;
  ClickEventManage: Function;
  isLoading?: boolean;
  isError?: boolean;
  ErrorMessage?: string;
  actions?: ActionTypes[];
  setData?: Function;
  setCurrentAction?: Function;
  mode?: string;
  isEditableForm?: boolean;
  refID?: any;
  onSubmit?: Function;
  children?: any;
  submitSecondAction?: any;
  submitSecondButtonName?: string;
  submitSecondButtonHide?: boolean;
  submitSecondLoading?: boolean;
}
