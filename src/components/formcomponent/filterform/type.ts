import { OptionsProps, OptionsFn } from "components/common/types";
export interface FiltergridConfig {
  dense?: boolean;
  title: string;
  allowColumnHiding?: boolean;
  submitButtonName?: string;
  HideHeader?: boolean;
  submitButtonHide?: boolean;
  isDisplayOnly?: boolean;
}
export interface FilterFormFieldType {
  accessor?: string;
  name: string;
  defaultValue?: string;
  isVisible?: boolean;
  gridconfig?: { xs?: number; sm?: number };
  defaultfocus?: boolean;
  label?: string;
  autoComplete?: string;
  placeholder?: string;
  isColumnHidingDisabled?: boolean;
  entertoSubmit?: boolean;
  type?: string;
  optiondata?: OptionsProps[] | OptionsFn;
  _optionsKey?: string;
  defaultOptionValue?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  validate?: Function;
  dependFields?: String[];
  dependFieldsonchange?: Function;
  required?: boolean;
}
export interface FilterFormMetaType {
  gridConfig: FiltergridConfig;
  fields: FilterFormFieldType[];
  initialData?: any;
  initialVisibleColumnData?: any;
}
