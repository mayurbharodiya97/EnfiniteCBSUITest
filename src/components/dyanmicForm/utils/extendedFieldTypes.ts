import getCurrencySymbol from "components/custom/getCurrencySymbol";
import {
  MetaDataType,
  ExtendedFieldMetaDataTypeOptional,
  FieldMetaDataType,
} from "../types";
import { cloneDeep } from "lodash";

export const extendFieldTypes = (
  metaData: MetaDataType,
  extendedTypes: ExtendedFieldMetaDataTypeOptional,
  lanTranslate: any = (edata) => edata,
  authState: any = {},
  customParameters: any = {}
) => {
  const {
    dynamicAccountNumberField,
    dynamicAmountSymbol,
    dynamicAmountGroupStyle,
    decimalCount,
    commonDateFormat,
    commonDateTimeFormat,
    commonTimeFormat,
  } = customParameters;

  const newMetaDataFields = metaData?.fields?.map((one: any) => {
    if (one.render.componentType === "arrayField") {
      let dummyMetaData = cloneDeep({
        form: metaData.form,
        fields: one._fields,
      });
      let newmetadatArray = extendFieldTypes(
        dummyMetaData,
        extendedTypes,
        lanTranslate,
        authState,
        customParameters
      );
      one._fields = newmetadatArray.fields;
    }
    const extendedType = extendedTypes[one.render.componentType];
    if (
      one?.render?.componentType === "datePicker" ||
      one?.render?.componentType === "datetimePicker" ||
      one?.render?.componentType === "timePicker"
    ) {
      if (!one?.format) {
        const format =
          one.render.componentType === "datePicker"
            ? commonDateFormat
            : one?.render?.componentType === "datetimePicker"
            ? commonDateTimeFormat
            : commonTimeFormat;
        one = { ...one, format };
      }
    }

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
      const {
        render,
        FormatProps,
        StartAdornment,
        isCurrencyField,
        ...others
      } = extendedType;
      //const result = Object.assign({}, one, others) as FieldMetaDataType;
      const result = Object.assign({}, others, one) as FieldMetaDataType;

      result["FormatProps"] = {
        ...FormatProps,
        ...(one?.FormatProps ?? {}),
      };

      if (Boolean(isCurrencyField) || Boolean(one?.isCurrencyField)) {
        let currencySymbol;
        let isCurrencyCode = one?.isCurrencyCode;
        if (Boolean(StartAdornment)) {
          currencySymbol = StartAdornment;
        }
        if (Boolean(dynamicAmountSymbol)) {
          currencySymbol = dynamicAmountSymbol;
        }
        if (Boolean(one?.StartAdornment)) {
          currencySymbol = one?.StartAdornment;
        }
        result["StartAdornment"] = isCurrencyCode
          ? currencySymbol
          : getCurrencySymbol(currencySymbol);

        let groupStyle;
        if (Boolean(FormatProps?.thousandsGroupStyle)) {
          groupStyle = FormatProps?.thousandsGroupStyle;
        }
        if (Boolean(dynamicAmountGroupStyle)) {
          groupStyle = dynamicAmountGroupStyle;
        }
        if (Boolean(one?.FormatProps?.thousandsGroupStyle)) {
          groupStyle = one?.FormatProps?.thousandsGroupStyle;
        }

        if (result["FormatProps"]) {
          result["FormatProps"]["thousandsGroupStyle"] =
            groupStyle ?? "thousand";
        } else {
          result["FormatProps"] = {
            thousandsGroupStyle: groupStyle ?? "lakh",
          };
        }

        let DecimalScale;
        if (Boolean(FormatProps?.decimalScale)) {
          DecimalScale = FormatProps?.decimalScale;
        }
        if (Boolean(decimalCount)) {
          DecimalScale = decimalCount;
        }
        if (Boolean(one?.FormatProps?.decimalScale)) {
          DecimalScale = one?.FormatProps?.decimalScale;
        }
        // if (result["FormatProps"]) {
        result["FormatProps"]["decimalScale"] = DecimalScale ?? 2;
        // }
      }

      // result["FormatProps"] = { ...FormatProps, ...(one?.FormatProps ?? {}) };
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
  const paravalue: string = dynamicAccountNumberField;

  const processExtendedType = (key: string, metadata?: any) => {
    const field = metadata || extendedTypes[key];
    if (typeof field === "object") {
      field["label"] = lanTranslate(field["label"]);
      field["placeholder"] = lanTranslate(field["placeholder"]);
      if (key === "branchCode") {
        // Set the default value for branchCode
        field["defaultValue"] = authState?.user?.branchCode;
      } else if (key === "accountType") {
        // Set autofocus on the accountType field
        // field["autoFocus"] = true;
        // field["defaultValue"] = "0003";
      }
      newMetaDataFieldsCustom.push(field);
    }
  };

  newMetaDataFields?.forEach((item: any) => {
    // if (item?.defaultBranchTrue) {
    //   const getBranchVal: string = authState?.user?.branchCode;
    //   item.defaultValue = getBranchVal;
    // }

    if (item.render.componentType === "_accountNumber") {
      let finalParameter;
      if (paravalue) {
        finalParameter = paravalue;
      }
      if (item?.acctFieldPara) {
        finalParameter = item?.acctFieldPara;
      }
      if (!paravalue && !item?.acctFieldPara) {
        finalParameter = "2";
      }

      const setExtendedTypeProps = (type) => {
        if (Boolean(item?.[`${type}Metadata`])) {
          const mergedObj = {
            ...extendedTypes[type],
            ...item[`${type}Metadata`],
          };
          processExtendedType(type, mergedObj);
        } else {
          processExtendedType(type, extendedTypes?.[type]);
        }
      };

      if (finalParameter === "1") {
        // const fullAccountNumber = extendedTypes["fullAccountNumber"];

        setExtendedTypeProps("fullAccountNumber");

        // if (item["postValidationSetCrossFieldValues"]) {
        //   extendedTypes["fullAccountNumber"][
        //     "postValidationSetCrossFieldValues"
        //   ] = item["postValidationSetCrossFieldValues"];
        // }
        // if (item["AcctNumberGridProps"]) {
        //   extendedTypes["fullAccountNumber"]["GridProps"] =
        //     item["AcctNumberGridProps"];
        // }
        // if (typeof fullAccountNumber === "object") {
        //   newMetaDataFieldsCustom.push(fullAccountNumber);
        // }
      } else if (finalParameter === "2") {
        ["branchCode", "accountType", "accountCode"].forEach(
          setExtendedTypeProps
        );
      } else {
        ["branchCode", "accountType", "accountCode"].forEach(
          processExtendedType
        );
      }
    } else {
      newMetaDataFieldsCustom = [...newMetaDataFieldsCustom, item];
    }
    if (Boolean(item?.isWorkingDate)) {
      item["defaultValue"] = new Date(authState?.workingDate);
    }
  });
  return {
    form: metaData.form,
    fields: [...newMetaDataFieldsCustom],
  } as MetaDataType;
};
