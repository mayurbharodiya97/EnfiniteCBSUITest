import {
  MetaDataType,
  ExtendedFieldMetaDataTypeOptional,
  FieldMetaDataType,
} from "../types";
export const extendFieldTypes = (
  metaData: MetaDataType,
  extendedTypes: ExtendedFieldMetaDataTypeOptional,
  lanTranslate: any = (edata) => edata
) => {
  const newMetaDataFields = metaData.fields.map((one) => {
    const extendedType = extendedTypes[one.render.componentType];

    if (one["options"] && Array.isArray(one["options"])) {
      one["options"] = one["options"].map((_item) => {
        if (_item?.label) {
          return { ..._item, label: lanTranslate(_item?.label) };
        }
        return _item;
      });
    }
    //exclude the following types from extending
    if (typeof extendedType === "object") {
      // const {
      //   defaultValue,
      //   render,
      //   validate,
      //   shouldExclude,
      //   isReadOnly,
      //   name,
      //   validationRun,
      //   dependentFields,
      //   postValidationSetCrossFieldValues,
      //   runPostValidationHookAlways,
      //   ...others
      // } = extendedType;
      const { render, ...others } = extendedType;
      //console.log("extendedType", one, others);
      //const result = Object.assign({}, one, others) as FieldMetaDataType;
      const result = Object.assign({}, others, one) as FieldMetaDataType;
      //console.log("extendedType", one, others, result);
      result["label"] = lanTranslate(result["label"]);
      result["placeholder"] = lanTranslate(result["placeholder"]);
      if (result && result.render && result.render.componentType) {
        //@ts-ignore
        result.render.componentType = extendedType.render?.componentType;
      }
      return result;
    }
    one["label"] = lanTranslate(one["label"]);
    one["placeholder"] = lanTranslate(one["placeholder"]);
    return one;
  });
  return {
    form: metaData.form,
    fields: [...newMetaDataFields],
  } as MetaDataType;
};
