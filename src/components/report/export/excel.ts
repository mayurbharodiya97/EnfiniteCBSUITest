import { utils, writeFile } from "xlsx";

export const createNewWorkbook = ({ title = "sheet1", data }) => {
  const excelData = utils.json_to_sheet(data);
  const wb = utils.book_new();
  wb.Props = {
    Title: title,
    Author: "LOS",
    CreatedDate: new Date(),
  };
  wb.SheetNames.push(title);
  wb.Sheets[title] = excelData;
  writeFile(wb, `${title}.xlsx`);
};
