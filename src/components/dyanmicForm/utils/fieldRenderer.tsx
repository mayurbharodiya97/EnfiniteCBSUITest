import { lazy, FC } from "react";
import { RenderFunctionType } from "../types";

const CheckboxGroup = lazy(() =>
  import("components/common/checkbox").then((module) => ({
    default: module.CheckboxGroup,
  }))
);

const Checkbox = lazy(() =>
  import("components/common/checkbox").then((module) => ({
    default: module.Checkbox,
  }))
);

const SwitchGroup = lazy(() =>
  import("components/common/switch").then((module) => ({
    default: module.SwitchGroup,
  }))
);

const Switch = lazy(() =>
  import("components/common/switch").then((module) => ({
    default: module.Switch,
  }))
);

const DatePicker = lazy(() =>
  import("components/common/datetime").then((module) => ({
    default: module.DatePicker,
  }))
);
const DateTimePicker = lazy(() =>
  import("components/common/datetime").then((module) => ({
    default: module.DateTimePicker,
  }))
);
const TimePicker = lazy(() =>
  import("components/common/datetime").then((module) => ({
    default: module.TimePicker,
  }))
);
const Visaversa = lazy(() => import("components/common/visaversa"));
const TextField = lazy(() => import("components/common/textField"));
const Divider = lazy(() => import("components/common/divider"));

const Select = lazy(() => import("components/common/select"));
const Radio = lazy(() => import("components/common/radio"));
const Slider = lazy(() => import("components/common/slider"));
const Rating = lazy(() => import("components/common/rating"));
const Spacer = lazy(() => import("components/common/spacer"));
const ToggleButtonGroup = lazy(
  () => import("components/common/toggleButtonGroup")
);
const NumberFormat = lazy(() => import("components/derived/numberFormat"));
const PasswordField = lazy(() => import("components/derived/passwordField"));
const InputMask = lazy(() => import("components/derived/inputMask"));
const AutoComplete = lazy(() => import("components/common/autocomplete"));

const ArrayField = lazy(() =>
  import("components/common/arrayField").then((module) => ({
    default: module.ArrayField2,
  }))
);
const TextareaField = lazy(() => import("components/common/textarea"));
const HiddenField = lazy(() => import("components/common/hidden"));
const Typography = lazy(() => import("components/common/typograhpy"));

const TransferList = lazy(() => import("components/common/transferList"));

const SearchField = lazy(() => import("components/common/search"));

const DataTable = lazy(() => import("components/common/dataTable"));

const FormButton = lazy(() => import("components/common/formbutton"));

const EmptyComponent: FC<{ componentType: string | any }> = ({
  componentType,
}) => {
  return <div>No Component of type: ${componentType}</div>;
};

export const renderField: RenderFunctionType = (
  fieldObj,
  formRenderConfig,
  formName,
  componentProps = {}
) => {
  const {
    render,
    schemaValidation,
    defaultValue,
    onFormButtonClickHandel,
    onFormDataChange,
    ...others
  } = fieldObj;
  let Component: any = null;
  switch (render.componentType) {
    case "arrayField":
      Component = ArrayField;
      break;
    case "textarea":
      Component = TextareaField;
      break;
    case "textField":
      Component = TextField;
      break;
    case "Divider":
      Component = Divider;
      break;
    case "select":
      Component = Select;
      break;
    case "checkbox":
      Component = Checkbox;
      break;
    case "checkboxGroup":
      Component = CheckboxGroup;
      break;
    case "radio":
      Component = Radio;
      break;
    case "switch":
      Component = Switch;
      break;
    case "switchGroup":
      Component = SwitchGroup;
      break;
    case "slider":
      Component = Slider;
      break;
    case "rating":
      Component = Rating;
      break;
    case "datePicker":
      Component = DatePicker;
      break;
    case "timePicker":
      Component = TimePicker;
      break;
    case "datetimePicker":
      Component = DateTimePicker;
      break;
    case "passwordField":
      Component = PasswordField;
      break;
    case "numberFormat":
      Component = NumberFormat;
      break;
    case "toggleButtonGroup":
      Component = ToggleButtonGroup;
      break;
    case "inputMask":
      Component = InputMask;
      break;
    case "autocomplete":
      Component = AutoComplete;
      break;
    case "spacer":
      Component = Spacer;
      break;
    case "typography":
      Component = Typography;
      break;
    case "hidden":
      Component = HiddenField;
      break;
    case "transferList":
      Component = TransferList;
      break;
    case "searchField":
      Component = SearchField;
      break;
    case "visaversa":
      Component = Visaversa;
      break;
    case "dataTable":
      Component = DataTable;
      break;
    case "formbutton":
      Component = FormButton;
      break;
    default:
      Component = EmptyComponent;
      break;
  }
  if (Component === EmptyComponent) {
    return <Component componentType={render.componentType} />;
  } else if (Component === Spacer || Component === Typography) {
    return (
      <Component
        key={`${formName}/${others.name}`}
        {...others}
        enableGrid={true}
        GridProps={{ item: true, ...others?.GridProps }}
      />
    );
  } else if (Component === FormButton) {
    //console.log(fieldObj);
    const currentComponentTypeProps = componentProps[render.componentType];
    const allProps = { ...currentComponentTypeProps, ...others };
    const gridConfigOverrides = {
      ...formRenderConfig?.gridConfig?.item,
      ...others?.GridProps,
    };
    return (
      <Component
        {...allProps}
        fieldKey={others.name}
        key={`${formName}/${others.name}`}
        enableGrid={true}
        startsIcon={allProps.startsIcon}
        endsIcon={allProps.endsIcon}
        rotateIcon={allProps.rotateIcon}
        GridProps={{
          item: true,
          xs: gridConfigOverrides?.xs ?? "auto",
          md: gridConfigOverrides?.md ?? "auto",
          xl: gridConfigOverrides?.xl ?? "auto",
          sm: gridConfigOverrides?.sm ?? "auto",
          lg: gridConfigOverrides?.lg ?? "auto",
        }}
        onFormButtonClickHandel={onFormButtonClickHandel}
        onFormDataChange={onFormDataChange}
      />
    );
  } else {
    const currentComponentTypeProps = componentProps[render.componentType];
    const allProps = { ...currentComponentTypeProps, ...others };
    const gridConfigOverrides = {
      ...formRenderConfig?.gridConfig?.item,
      ...others?.GridProps,
    };
    if (render.componentType === "arrayField") {
      allProps["componentProps"] = componentProps;
    }
    return (
      <Component
        {...allProps}
        fieldKey={others.name}
        key={`${formName}/${others.name}`}
        enableGrid={true}
        GridProps={{
          item: true,
          xs: gridConfigOverrides?.xs ?? "auto",
          md: gridConfigOverrides?.md ?? "auto",
          xl: gridConfigOverrides?.xl ?? "auto",
          sm: gridConfigOverrides?.sm ?? "auto",
          lg: gridConfigOverrides?.lg ?? "auto",
        }}
        onFormButtonClickHandel={onFormButtonClickHandel}
        onFormDataChange={onFormDataChange}
      />
    );
  }
};
