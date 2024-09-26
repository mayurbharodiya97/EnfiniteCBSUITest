import { cloneDeep } from "lodash-es";
import { utilFunction } from "./utilFunctions";
export const CheckObjectAllKeyisEmpty = (data) => {
  if (typeof data === "object") {
    const allKeys = Object.keys(data);
    let returnvalue = true;
    if (allKeys.length === 0) {
      return false;
    }
    allKeys.forEach((item) => {
      if (Boolean(data[item])) {
        returnvalue = false;
        return false;
      }
    });
    return returnvalue;
  } else {
    return false;
  }
};

export const UpdateRequestDataVisibleColumn = (data, visiblecolumn) => {
  if (typeof data === "object" && typeof visiblecolumn === "object") {
    let returnData = cloneDeep(data);
    const allKeys = Object.keys(visiblecolumn);
    allKeys.forEach((item) => {
      if (!visiblecolumn[item]) {
        returnData[item] = "";
      }
    });
    return returnData;
  }

  return data;
};
export const AddIDinResponseData = (responsedata) => {
  if (Array.isArray(responsedata)) {
    return responsedata.map((item, index) => {
      return { id: index + 1, ...item };
    });
  } else {
    return responsedata;
  }
};
export const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const DefaultErrorObject = (
  error_msg,
  error_details = "",
  severity = "error"
) => {
  return {
    error_msg: error_msg,
    severity: severity,
    error_detail: error_details,
  };
};
export const CreateLanguageRequestData = (reqData, languageData) => {
  console.log(languageData);
  if (Array.isArray(reqData)) {
    return reqData.map((item) => {
      if (Boolean(item?._hidden)) {
        return item;
      } else {
        if (Boolean(languageData[item?.TRN_TYPE])) {
          if (item?.DISPLAY_MSG !== languageData[item?.TRN_TYPE]?.DISPLAY_MSG) {
            item["_isTouchedCol"] = {
              ...item._isTouchedCol,
              DISPLAY_MSG: true,
            };
            item["_oldData"] = {
              ...item?._oldData,
              DISPLAY_MSG: StringtoUnicode(item?.DISPLAY_MSG),
            };
            item["DISPLAY_MSG"] = StringtoUnicode(
              languageData[item?.TRN_TYPE]?.DISPLAY_MSG
            );
          }
          if (
            item?.DISPLAY_MSG_BN !==
            languageData[item?.TRN_TYPE]?.DISPLAY_MSG_BN
          ) {
            item["_isTouchedCol"] = {
              ...item._isTouchedCol,
              DISPLAY_MSG_BN: true,
            };
            item["_oldData"] = {
              ...item?._oldData,
              DISPLAY_MSG_BN: StringtoUnicode(item?.DISPLAY_MSG_BN),
            };
            item["DISPLAY_MSG_BN"] = StringtoUnicode(
              languageData[item?.TRN_TYPE]?.DISPLAY_MSG_BN
            );
          }
          return item;
        } else {
          return item;
        }
      }
    });
  } else {
    return reqData;
  }
};

export const CreateDetailsRequestData = (reqData) => {
  console.log("<<<reqdata", reqData);
  let _isNewRowdata: any[] = [];
  let _isDeleteRowdata: any[] = [];
  let _isUpdatedRowdata: any[] = [];
  if (Array.isArray(reqData)) {
    reqData.forEach((item) => {
      let { _isNewRow, _hidden, _isTouchedCol, _oldData, ...other } = item;
      if (Boolean(_isNewRow)) {
        if (!Boolean(_hidden)) {
          _isNewRowdata.push(other);
        }
      } else if (Boolean(_hidden)) {
        _isDeleteRowdata.push(other);
      } else if (Boolean(_isTouchedCol)) {
        let isUpdated = false;
        let updatedItem = cloneDeep(other);
        let _OldValueData = {};
        let allKeys = Object.keys(_isTouchedCol);
        let updatedKeysArr: any[] = [];
        allKeys.forEach((keyitem) => {
          if (item?._isTouchedCol?.[keyitem] ?? false) {
            isUpdated = true;
            _OldValueData[keyitem] = _oldData?.[keyitem] ?? "";
            updatedKeysArr.push(keyitem);
          }
        });
        if (isUpdated) {
          _isUpdatedRowdata.push({
            ...updatedItem,
            _UPDATEDCOLUMNS: updatedKeysArr,
            _OLDROWVALUE: _OldValueData,
          });
        }
      }
    });
  }
  return {
    isNewRow: _isNewRowdata,
    isDeleteRow: _isDeleteRowdata,
    isUpdatedRow: _isUpdatedRowdata,
  };
};

export const ProcessDetailsData = (newData, oldData) => {
  let _isNewRowdata: any[] = [];
  let _isDeleteRowdata: any[] = [];
  let _isUpdatedRowdata: any[] = [];

  if (!Array.isArray(newData)) {
    newData = [newData];
  }
  if (!Array.isArray(oldData)) {
    oldData = [oldData];
  }
  newData.forEach((newItem) => {
    const { SR_CD, ...otherNew } = newItem;
    const oldItem = oldData.find((old) => old.SR_CD === SR_CD);

    if (oldItem) {
      if (oldItem) {
        const oldRowValue = oldItem;

        for (const key in oldRowValue) {
          if (oldRowValue.hasOwnProperty(key)) {
            // Convert boolean values to "Y" or "N"
            if (typeof oldRowValue[key] === "boolean") {
              oldRowValue[key] = oldRowValue[key] ? "Y" : "N";
            }
          }
        }
      }
      let upd = utilFunction.transformDetailsData(newItem, oldItem);

      if (upd?._UPDATEDCOLUMNS?.length > 0) {
        newItem = { ...newItem, ...upd };
        _isUpdatedRowdata.push(newItem);
      }
    } else {
      _isNewRowdata.push(otherNew);
    }
  });

  oldData.forEach((oldItem) => {
    const { SR_CD, ...otherOld } = oldItem;
    const newItem = newData.find((newItem) => newItem.SR_CD === SR_CD);
    if (!newItem) {
      _isDeleteRowdata.push(oldItem);
    }
  });
  return {
    isNewRow: _isNewRowdata,
    isDeleteRow: _isDeleteRowdata,
    isUpdatedRow: _isUpdatedRowdata,
  };
};

export const ObjectMappingKeys = (data, ...keys) => {
  if (typeof data === "object") {
    let returnObj = {};
    keys.forEach((item) => {
      returnObj[item] = data[item];
    });
    return returnObj;
  } else {
    return data;
  }
};

export const StringtoUnicode = (str) => {
  return str
    .split("")
    .map(function (value, index, array) {
      var temp = value.charCodeAt(0).toString(16).toUpperCase();
      if (temp.length > 2) {
        return "\\u" + (temp.length === 3 ? "0" + temp : temp);
      }
      return value;
    })
    .join("");
};
