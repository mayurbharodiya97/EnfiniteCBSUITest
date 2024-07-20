import { format } from "date-fns";
import { toNumber } from "lodash";

export const GetMaxCdForDetails = (data, keys) => {
  if (Array.isArray(data)) {
    if (!Boolean(keys)) {
      return data.length + 1;
    }
    let maxCd = 0;
    data.forEach((item, index) => {
      if (Boolean(item[keys])) {
        if (parseFloat(item[keys]) > maxCd) {
          maxCd = parseFloat(item[keys]);
        }
      } else if (maxCd < index + 1) {
        maxCd = index + 1;
      }
    });
    return maxCd + 1;
  } else {
    return 1;
  }
};

export const GetMaxDisplaySequenceCd = (data, keys) => {
  if (Array.isArray(data)) {
    if (!Boolean(keys)) {
      return data.length + 1;
    }
    let maxCd = 0;
    data.forEach((item, index) => {
      if (typeof item[keys] !== "undefined") {
        let { _hidden } = item;
        if (
          typeof _hidden === "undefined" ||
          (typeof _hidden === "boolean" && !Boolean(_hidden))
        ) {
          if (parseFloat(item[keys]) > maxCd) {
            maxCd = parseFloat(item[keys]);
          }
        }
      } else if (maxCd < index + 1) {
        maxCd = index + 1;
      }
    });
    return maxCd + 1;
  } else {
    return 1;
  }
};

export const base64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays: any = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
export const ChangeJsonValue = (data, obj) => {
  if (Array.isArray(data)) {
    return data.map((item) => {
      let newitem = item;
      let allKeys = Object.keys(item);
      allKeys.forEach((itemdata) => {
        if (Boolean(obj[itemdata])) {
          let keyValue = item[itemdata];
          if (typeof obj[itemdata] === "object") {
            newitem["_NEW_" + itemdata] = Boolean(obj[itemdata][keyValue])
              ? obj[itemdata][keyValue]
              : keyValue;
          } else if (typeof obj[itemdata] === "function") {
            let funcRet = obj[itemdata](keyValue, itemdata);
            newitem["_NEW_" + itemdata] = Boolean(funcRet) ? funcRet : keyValue;
          } else {
            newitem["_NEW_" + itemdata] = keyValue;
          }
        }
      });
      return newitem;
    });
  } else {
    return data;
  }
};

export const convertBlobToBase64 = async (blob) => {
  // blob data
  return await blobToBase64(blob).then((result: any) =>
    result.toString().split(",")
  );
};

const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getAuthorizeTokenText = (token, token_type) => {
  if (token_type === "bearer") {
    return "Bearer " + token;
  } else if (token_type === "basic") {
    return "Basic " + token;
  } else {
    return "Bearer " + token;
  }
};

export const getCurrentDateinLong = () => {
  return new Date().getTime();
};

export const ValidatePassword = (pwd) => {
  if (!Boolean(pwd)) {
    return "Password is Required";
  } 
  // else if (pwd.length < 8 || pwd.length > 16) {
  //   return "Password must be between 8 and 16 characters long.";
  // }
  return "";
};

export const GetAllChieldMenuData = (
  data: any,
  isCheckUserCode: boolean = true
) => {
  let newNavItems: any = [];
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      let { children, ...newItem } = data[i];
      if (Array.isArray(children) && children.length > 0) {
        let newChildren = GetAllChieldMenuData(children);
        newNavItems.push(...newChildren);
      } else {
        if (
          (!isCheckUserCode || Boolean(newItem.system_code)) &&
          Boolean(newItem.href)
        ) {
          newNavItems.push({ ...newItem });
        }
        // else if (Boolean(newItem.href)) {
        //   newNavItems.push({ ...newItem });
        // }
      }
    }
  }
  return newNavItems;
};
export const transformBlobData = (data) => {
  if (!Array.isArray(data)) {
    return data;
  }
  return data.map((item) => {
    let newItem = {};
    newItem["id"] = toNumber(item["ID"]);
    newItem["blob"] = base64toBlob(
      item["BLOB"],
      item["FILEEXT"] === "pdf" ? "application/pdf" : ""
    );
    newItem["fileExt"] = item["FILEEXT"];
    newItem["name"] =
      item["NAME"]?.includes(".") ?? true
        ? item["NAME"]
        : item["NAME"] + "." + newItem["fileExt"];
    newItem["_mimeType"] =
      newItem["fileExt"] === "pdf"
        ? "pdf"
        : newItem["fileExt"] === "jpg"
          ? "image"
          : newItem["fileExt"] === "png"
            ? "image"
            : newItem["fileExt"] === "jpeg"
              ? "image"
              : "other";
    newItem["sizeStr"] = newItem["blob"]?.size ?? 1000;
    return newItem;
  });
};

export const transformDetailsData = (newData, oldData) => {
  let allKey = Object.keys(newData);
  let _UPDATEDCOLUMNS: any = [];
  let _OLDROWVALUE = {};
  allKey.forEach((item) => {
    if (newData[item] === oldData[item]) {
    } else if (
      (typeof newData[item] === "object" ||
        typeof oldData[item] === "object" ||
        typeof newData[item] === "string") &&
      isValidDate(newData[item]) &&
      isValidDate(oldData[item]) &&
      format(new Date(newData[item]), "dd/MM/yyyy HH:mm:ss") ===
      format(new Date(oldData[item]), "dd/MM/yyyy HH:mm:ss")
    ) {
    } else {
      _UPDATEDCOLUMNS.push(item);
      _OLDROWVALUE[item] = oldData[item];
    }
  });
  return { _UPDATEDCOLUMNS: _UPDATEDCOLUMNS, _OLDROWVALUE: _OLDROWVALUE };
};

export const isValidDate = (dat) => {
  try {
    let dt: any = new Date(dat);
    //console.log(dat, dt, !isNaN(dt), isNaN(dat));
    if (!isNaN(dt) && dt <= new Date("1900/01/01")) {
      return false;
    } else if (!isNaN(dt)) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const blobToFile = (theBlob: Blob, fileName: string): File => {
  var b: any = theBlob;
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  //Cast to a File() type
  return <File>theBlob;
};

export const getMetadataLabelFromColumnName = (metadata, colomnList) => {
  if (
    !Boolean(metadata) ||
    !Boolean(colomnList) ||
    !Array.isArray(colomnList)
  ) {
    return {};
  }
  let outData = {};
  for (const item of metadata?.fields ?? []) {
    if (colomnList.includes(item.name)) {
      outData[item.name] = item.label;
    }
  }
  return outData;
};
const getKey = (item, keys) => {
  return keys.map((key) => item[key]).join("_");
};

const areObjectsEqual = (obj1, obj2, keys) => {
  return keys.every((key) => obj1[key] === obj2[key]);
};

const getChangedColumns = (obj1, obj2, keys) => {
  return keys.filter((key) => {
    if (obj1[key] !== obj2[key]) {
      if (
        (typeof obj2[key] === "object" ||
          typeof obj1[key] === "object" ||
          typeof obj2[key] === "string") &&
        isValidDate(obj2[key]) &&
        isValidDate(obj1[key]) &&
        format(new Date(obj2[key]), "dd/MM/yyyy HH:mm:ss") ===
        format(new Date(obj1[key]), "dd/MM/yyyy HH:mm:ss")
      ) {
      } else {
        return key;
      }
    }
  });
};

const groupItemsById = (items, id) => {
  const groupedItems = {};

  items.forEach(item => {
    const key = item[id];
    if (!groupedItems[key]) {
      groupedItems[key] = [];
    }
    groupedItems[key].push(item);
  });

  return groupedItems;
};

export const transformDetailDataForDML = (input1, input2, keysToCompare) => {
  const output: {
    isNewRow: any[];
    isUpdatedRow: any[];
    isDeleteRow: any[];
  } = {
    isNewRow: [],
    isUpdatedRow: [],
    isDeleteRow: [],
  };
  const idMapInput1: any = new Map(
    input1.map((item) => [getKey(item, keysToCompare), item])
  );
  // const idMapInput2: any = new Map(
  //   input2.map((item) => {
  //     return [getKey(item, keysToCompare), item]
  //   })
  // );
  input1.forEach(oldRow => {
    let isExistingRow = input2.filter(newRows => newRows[keysToCompare] === oldRow[keysToCompare])
    if (isExistingRow.length === 0) {
      output.isDeleteRow.push(oldRow);
    }
  });

  const grouped = (groupItemsById(input2, keysToCompare));
  const uniqueKeys = Object.keys(grouped);
  uniqueKeys.forEach(key => {
    if (Array.isArray(grouped[key])) {
      const item1 = idMapInput1.get(key);
      if (!item1) {
        output.isNewRow.push(...grouped[key]);
      } else {
        grouped[key].forEach(row => {
          if (areObjectsEqual(item1, row, keysToCompare)) {
            const changedColumns = getChangedColumns(
              item1,
              row,
              Object.keys(row)
            );
            if (changedColumns.length > 0) {
              const oldValues = {};
              for (const key of changedColumns) {
                if (key in item1) {
                  oldValues[key] = item1[key];
                }
              }
              const updateObj = {
                ...row,
                _OLDROWVALUE: oldValues,
                _UPDATEDCOLUMNS: changedColumns,
              };
              output.isUpdatedRow.push(updateObj);
            }
          }
        });
      }
    }
  });
  // input1.forEach(oldRow => {
  //   if()
  // });
  // Process INSERT and UPDATE operations
  // for (const [id, item2] of idMapInput2) {
  //   console.log(id, "myrmyr id, item2", item2)
  //   const item1 = idMapInput1.get(id);

  //   if (!item1) {
  //     output.isNewRow.push(item2);
  //   } else if (areObjectsEqual(item1, item2, keysToCompare)) {
  //     const changedColumns = getChangedColumns(
  //       item1,
  //       item2,
  //       Object.keys(item2)
  //     );

  //     if (changedColumns.length > 0) {
  //       const oldValues = {};
  //       for (const key of changedColumns) {
  //         if (key in item1) {
  //           oldValues[key] = item1[key];
  //         }
  //       }
  //       const updateObj = {
  //         ...item2,
  //         _OLDROWVALUE: oldValues,
  //         _UPDATEDCOLUMNS: changedColumns,
  //       };

  //       output.isUpdatedRow.push(updateObj);
  //     }
  //   }
  // }

  // Process DELETE operation
  // for (const [id, item1] of idMapInput1) {
  //   if (!idMapInput2.has(id)) {
  //     output.isDeleteRow.push(item1);
  //   }
  // }
  return output;
};
export const getPadAccountNumber = (accountNo, optionData) => {
  return accountNo
    ?.padStart(optionData?.PADDING_NUMBER ?? 6, "0")
    .padEnd(20, " ");
};

//For get dependent field data with filtered keys in array fields.
export const getDependetFieldDataArrayField = (inputData) => {
  let transformedData = {};
  for (const key in inputData) {
    if (inputData.hasOwnProperty(key)) {
      // Split the key using dots and take the last part
      const parts = key.split(".");
      const newKey = parts[parts.length - 1];
      // Assign the value to the new key
      transformedData[newKey] = inputData[key]; // Trim any extra spaces
    }
  }
  return transformedData;
};
