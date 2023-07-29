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
  let newMetaDataFieldsCustom: any = [];
  const paravalue: string = "2";
  newMetaDataFields.forEach((item) => {
    if (item.render.componentType === "_accountNumber") {
      if (paravalue === "1") {
        const fullAccountNumber = extendedTypes["fullAccountNumber"];
        if (typeof fullAccountNumber === "object") {
          newMetaDataFieldsCustom = [
            ...newMetaDataFieldsCustom,
            fullAccountNumber,
          ];
        }
      } else {
        const branchCode = extendedTypes["branchCode"];
        const accountType = extendedTypes["accountType"];
        const accountNumber = extendedTypes["accountNumber"];
        if (typeof branchCode === "object") {
          branchCode["label"] = lanTranslate(branchCode["label"]);
          branchCode["placeholder"] = lanTranslate(branchCode["placeholder"]);
          newMetaDataFieldsCustom = [...newMetaDataFieldsCustom, branchCode];
        }
        if (typeof accountType === "object") {
          accountType["label"] = lanTranslate(accountType["label"]);
          accountType["placeholder"] = lanTranslate(accountType["placeholder"]);
          newMetaDataFieldsCustom = [...newMetaDataFieldsCustom, accountType];
        }
        if (typeof accountNumber === "object") {
          accountNumber["label"] = lanTranslate(accountNumber["label"]);
          accountNumber["placeholder"] = lanTranslate(
            accountNumber["placeholder"]
          );
          newMetaDataFieldsCustom = [...newMetaDataFieldsCustom, accountNumber];
        }
      }
    } else {
      newMetaDataFieldsCustom = [...newMetaDataFieldsCustom, item];
    }
  });
  // console.log("newMetaDataFields", newMetaDataFields, newMetaDataFieldsCustom);
  return {
    form: metaData.form,
    fields: [...newMetaDataFieldsCustom],
  } as MetaDataType;
};
