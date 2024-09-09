import { utils, writeFile, write } from "xlsx";

// export const createNewWorkbook = ({ title = "sheet1", data, columns }) => {
//   console.log(columns, "LLLLLLLLLLLLL");
//   const excelData = utils.json_to_sheet(data);
//   const wb = utils.book_new();
//   wb.Props = {
//     Title: title,
//     Author: "LOS",
//     CreatedDate: new Date(),
//   };
//   wb.SheetNames.push(title);
//   wb.Sheets[title] = excelData;
//   writeFile(wb, `${title}.xlsx`);
// };

export const createNewWorkbook = ({ title = "sheet1", data, columns }) => {
  const columnNames = columns.map((column) => column.columnName);
  const columnAccessors = columns.map((column) => column.accessor);

  const rowData = [columnNames];

  data.forEach((item) => {
    const row = columnAccessors.map((accessor) => item[accessor] || "");
    rowData.push(row);
  });

  const excelData = utils.json_to_sheet(rowData, { skipHeader: true });
  const wb = utils.book_new();
  wb.Props = {
    Title: title,
    Author: "CBS ENFINITY",
    CreatedDate: new Date(),
  };
  wb.SheetNames.push(title);
  wb.Sheets[title] = excelData;

  // Create a Blob from the workbook data
  const wbout = write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${title}.xlsx`;
  link.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
};
