import { utils, read } from "xlsx";
import { utilFunction } from "../utilFunctions";

export const ConvertExcelToJSONData = ({ title = "sheet1", data }) => {
  //let base64Data = await utilFunction.convertBlobToBase64(blob);
  let wb = read(data.blob, { type: "base64", raw: true });
  let fileJsonData: any = [];
  if (wb?.SheetNames?.length > 0) {
    wb?.SheetNames.forEach((item) => {
      let JSONData = utils.sheet_to_json(wb.Sheets[item]);
      fileJsonData = [...fileJsonData, ...JSONData];
    });
    return fileJsonData;
  } else {
    return [];
  }
  //const excelData = utils.json_to_sheet(data);
};
