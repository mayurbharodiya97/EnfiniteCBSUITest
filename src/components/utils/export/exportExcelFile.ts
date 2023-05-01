import { utils, writeFile } from "xlsx";

export const ExportExcelFileFromData = ({ title = "sheet1", data }) => {
  // console.log(data);
  const excelData = utils.json_to_sheet(data);
  // console.log(excelData);
  const wb = utils.book_new();
  wb.Props = {
    Title: title,
    Author: "Netbanking Admin",
    CreatedDate: new Date(),
  };
  wb.SheetNames.push(title);
  wb.Sheets[title] = excelData;
  writeFile(wb, `${title}.xlsx`);
};
export const ExportCSVFileFromData = ({ title = "sheet1", data }) => {
  //  console.log(data);
  const excelData = utils.json_to_sheet(data);
  //  console.log(excelData);
  const wb = utils.book_new();
  wb.Props = {
    Title: title,
    Author: "Netbanking Admin",
    CreatedDate: new Date(),
  };
  wb.SheetNames.push(title);
  wb.Sheets[title] = excelData;
  writeFile(wb, `${title}.csv`, { bookType: "csv" });
};
