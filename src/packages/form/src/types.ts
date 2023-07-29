import { AnyObjectSchema } from "yup";
export interface TemplateFieldRowType {
  fieldIndexKey: string;
  cells: TemplateFieldCellsObjectType;
}

export interface TemplateFieldCellsObjectType {
  [key: string]: TemplateFieldCellType;
}

export interface TemplateFieldCellType {
  name: string;
  key: string;
}
type ValidationRunType = "onChange" | "onBlur" | "all";

export interface FormContextType {
  formName: string;
  validationRun?: ValidationRunType;
  resetFieldOnUnmount?: boolean;
  initialValues?: InitialValuesType;
  validationSchema?: any;
  formState: any;
  defaultArrayFieldValues?: InitialValuesType;
  onFormButtonCicular?: any;
}

export type FormFieldRegistryAtomType = string[];

export interface FormFieldRegisterSelectorAttributes {
  fieldName: string;
  defaultValue: any;
}

export interface InitialValuesType {
  [key: string]: any;
}

export interface FormAtomType {
  submitAttempt: number;
  isSubmitting: boolean;
  submitSuccessful: boolean;
  serverSentError: string;
  serverSentErrorDetail: string;
}

export interface FormFieldAtomType {
  fieldKey: string;
  name: string;
  value: any;
  displayValue: any;
  touched: boolean;
  error: string | null;
  validationRunning: boolean;
  excluded: boolean;
  readOnly: boolean;
  validate?: null | typeof ValidateFnType | EmptyFnType;
  incomingMessage?: any;
  dependentFields?: string[] | string;
  validationAPIResult?: any;
  skipValueUpdateFromCrossFieldWhenReadOnly: boolean;
  optionData?: any;
}

export interface DependentValuesType {
  [key: string]: FormFieldAtomType;
}

export interface FormArrayFieldRowsAtomType {
  fieldName: string;
  templateFieldRows: TemplateFieldRowType[];
  lastInsertIndex: number;
  resetFlag: boolean;
  excluded: boolean;
}

export interface UseFormHookProps {
  onSubmit: SubmitFnType;
  readOnly?: boolean;
}

export interface UseFieldHookProps {
  fieldKey: string;
  name: string;
  validate?: typeof ValidateFnType;
  validationRun?: ValidationRunType;
  dependentFields?: string[] | string;
  _dependentFields?: string[] | string;
  shouldExclude?: typeof shouldExcludeFnType;
  isReadOnly?: typeof shouldExcludeFnType;
  postValidationSetCrossFieldValues?: typeof PostValidationSetCrossFieldValuesFnType;
  runPostValidationHookAlways?: boolean;
  runValidationOnDependentFieldsChange?: boolean;
  skipValueUpdateFromCrossFieldWhenReadOnly?: boolean;
  __EDIT__?: any;
}

export interface UseFieldArrayHookProps {
  arrayFieldName: string;
  template: any;
  dependentFields?: string[] | string;
  shouldExclude?: typeof shouldExcludeFnType;
  getFixedRowsCount?: typeof getFixedRowsCountFnType;
}

export interface SubscritionFieldsType {
  [key: string]: string[] | string | undefined;
}

export declare function getFixedRowsCountFnType(
  fieldData: FormArrayFieldRowsAtomType,
  dependentFieldsValues: DependentValuesType,
  formState: any
): number;

export declare function shouldExcludeFnType(
  fieldData: FormFieldAtomType,
  dependentFieldsValues: DependentValuesType,
  formState: any
): Promise<boolean> | boolean;

export declare function SchemaValidateFnType(
  fieldData: FormFieldAtomType,
  formState: any
): Promise<any> | any;

export declare function ValidateFnType(
  fieldData: FormFieldAtomType,
  dependentFieldsValues: DependentValuesType,
  formState: any
): Promise<any> | any;

export declare function PostValidationSetCrossFieldValuesFnType(
  fieldData: FormFieldAtomType,
  formState: any,
  authState?: any,
  dependentFieldsState?: DependentValuesType
):
  | Promise<InitialValuesType | undefined | null>
  | InitialValuesType
  | undefined
  | null;

export interface EmptyFnType {
  (args: FormFieldAtomType): string;
}

export interface SubmitFnType {
  (
    values: Object,
    displayValues: Object,
    endSubmit: (submitSuccessful: boolean, message?: string) => void,
    setFieldErrors: (fieldsErrorObj: FieldsErrorObjType) => void,
    actionFlag?: String
  ): void;
}

export interface RenderFnOptionsType {
  row: TemplateFieldRowType;
  fields: string[];
  rowIndex: number;
  removeFn: (index: number) => void;
  totalRows: number;
}

export type RenderFn = (options: RenderFnOptionsType) => JSX.Element;

export interface FieldsErrorObjType {
  [key: string]: string | null;
}
