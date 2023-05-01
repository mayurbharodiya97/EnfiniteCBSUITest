import { FilterFormComponents } from "./filterForm";
import { cloneDeep } from "lodash-es";
export const FormComponentView = ({
  finalMetaData,
  onAction,
  loading,
  data,
  submitSecondButtonHide = true,
  submitSecondButtonName = "submit",
  submitSecondLoading = false,
  submitSecondAction = (arg1, arg2) => {},
  submitSecondValidtion = true,
}) => {
  const isDisplayOnly = finalMetaData.gridConfig?.isDisplayOnly ?? false;
  let metadata = transformMetaData({
    metaData: finalMetaData,
    isDisplayOnly,
    data,
  });

  return (
    <FilterFormComponents
      dense={metadata.gridConfig?.dense ?? true}
      title={metadata.gridConfig?.title ?? "No Title"}
      fields={metadata.fields}
      allowColumnHiding={metadata.gridConfig?.allowColumnHiding ?? false}
      initialDataValue={metadata.initialData}
      initialVisibleColumnData={metadata.initialVisibleColumnData}
      submitButtonHide={metadata.gridConfig?.submitButtonHide ?? false}
      submitButtonName={metadata.gridConfig?.submitButtonName ?? "SUBMIT"}
      hideHeader={metadata.gridConfig?.HideHeader ?? false}
      isDisplayOnly={isDisplayOnly}
      onAction={onAction}
      loading={loading}
      submitSecondButtonHide={submitSecondButtonHide}
      submitSecondButtonName={submitSecondButtonName}
      submitSecondLoading={submitSecondLoading}
      submitSecondAction={submitSecondAction}
      submitSecondValidtion={submitSecondValidtion}
    ></FilterFormComponents>
  );
};
const transformMetaData = ({ metaData, isDisplayOnly, data }) => {
  let metadata = cloneDeep(metaData);
  let initialData = metadata.fields.reduce((value, item) => {
    //console.log(item, Boolean(item?.isDisabled), data[item?.accessor]);
    value = {
      ...value,
      [item.name]: isDisplayOnly
        ? data[item?.accessor] ?? ""
        : Boolean(data[item?.accessor])
        ? data[item?.accessor] ?? ""
        : item?.defaultValue ?? "",
    };
    return value;
  }, {});
  //console.log(initialData, data);
  let initialVisibleColumnData = metadata.fields.reduce((value, item) => {
    value = { ...value, [item.name]: item?.isVisible ?? true };
    return value;
  }, {});
  // console.log("initialVisibleColumnData", initialVisibleColumnData);
  return {
    gridConfig: metadata.gridConfig,
    fields: metadata.fields,
    initialData: initialData,
    initialVisibleColumnData: initialVisibleColumnData,
  };
};
