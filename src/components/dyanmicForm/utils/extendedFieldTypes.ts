import {
  MetaDataType,
  ExtendedFieldMetaDataTypeOptional,
  FieldMetaDataType,
} from "../types";
export const extendFieldTypes = (
  metaData: MetaDataType,
  extendedTypes: ExtendedFieldMetaDataTypeOptional,
  lanTranslate: any = (edata) => edata,
  authState: any = {},
  customParameters: any = {}
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
  const paravalue: string = customParameters?.dynamicAccountNumberField;
  const processExtendedType = (key: string) => {
    const field = extendedTypes[key];
    if (typeof field === "object") {
      field["label"] = lanTranslate(field["label"]);
      field["placeholder"] = lanTranslate(field["placeholder"]);
      if (key === "branchCode") {
        // Set the default value for branchCode
        field["defaultValue"] = authState?.user?.branchCode; // Use the branchCodeValue parameter
      } else if (key === "accountType") {
        // Set autofocus on the accountType field
        field["autoFocus"] = true;
      }
      newMetaDataFieldsCustom.push(field);
    }
  };

  newMetaDataFields?.forEach((item) => {
    if (item.render.componentType === "_accountNumber") {
      if (item?.para === "1") {
        const fullAccountNumber = extendedTypes["fullAccountNumber"];
        if (typeof fullAccountNumber === "object") {
          newMetaDataFieldsCustom.push(fullAccountNumber);
        }
      } else if (item?.para === "2") {
        ["branchCode", "accountType", "accountCode"].forEach(
          processExtendedType
        );
      } else if (paravalue === "1") {
        const fullAccountNumber = extendedTypes["fullAccountNumber"];
        if (typeof fullAccountNumber === "object") {
          newMetaDataFieldsCustom.push(fullAccountNumber);
        }
      } else if (paravalue === "2") {
        ["branchCode", "accountType", "accountCode"].forEach(
          processExtendedType
        );
      } else {
        ["branchCode", "accountType", "accountCode"].forEach(
          processExtendedType
        );
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
