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
  } else if (pwd.length < 8 || pwd.length > 16) {
    return "Password must be between 8 and 16 characters long.";
  }
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
          (!isCheckUserCode || Boolean(newItem.user_code)) &&
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
