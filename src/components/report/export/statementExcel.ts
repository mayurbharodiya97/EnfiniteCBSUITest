import { format } from "date-fns/esm";
import { AuthContext } from "pages_audit/auth";
import { useContext, useState } from "react";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
export const ExcelForStatementExport = async ({
  data,
  companyName,
  generatedBy,
  RequestingBranchCode,
}) => {
  const wb = await XlsxPopulate.fromBlankAsync();
  const sheet = wb.sheet("Sheet1");
  let cellIndex = 1;
  let isLength = 0;

  const cellB = sheet.column("B").width(40);
  const cellF = sheet.column("F").width(40);
  cellB.style("wrapText", true);
  cellF.style("wrapText", true);
  // Set the company name and merge the cells
  const companyNameCell = sheet.cell(`A${cellIndex}`);
  companyNameCell.value(companyName);
  const headerBackgroundColor = "98FB98";
  const headerBackgroundColorTwo = "B4C6E7";
  const headerBackgroundColorThree = "DDDDDD";
  companyNameCell.style("fill", headerBackgroundColor);
  companyNameCell.style({ horizontalAlignment: "center", bold: true });
  companyNameCell.style({ verticalAlignment: "middle" }); // Set vertical alignment to center

  sheet.range(`A${cellIndex}:H${cellIndex}`).merged(true);
  sheet.range(`A${cellIndex}:H${cellIndex + 1}`).merged(true); // Merge the next row as well

  cellIndex += 2;

  for (const section of data) {
    // Set the header for the section
    const sectionHeader = sheet.cell(`A${cellIndex}`);
    sectionHeader.value(section.TITLE);
    sectionHeader.style("fill", headerBackgroundColorTwo);
    sectionHeader.style({ horizontalAlignment: "center", bold: true });
    sheet.range(`A${cellIndex}:H${cellIndex}`).merged(true);
    cellIndex += 2;

    if (section.DISPLAY_TYPE === "simple") {
      const detailData = section.DETAILS;
      const halfLength = Math.ceil(detailData.length / 2);

      for (let i = 0; i < halfLength; i++) {
        const labelCell = sheet.cell(`A${cellIndex}`);
        labelCell.value(detailData[i].LABEL);
        labelCell.style({ bold: true });

        const valueCell = sheet.cell(`B${cellIndex}`);
        valueCell.value(detailData[i].VALUE);

        cellIndex += 1;
      }

      cellIndex -= halfLength; // Reset cellIndex for the second half of data

      for (let i = halfLength; i < detailData.length; i++) {
        const labelCell = sheet.cell(`E${cellIndex}`);
        labelCell.value(detailData[i].LABEL);
        labelCell.style({ bold: true });

        const valueCell = sheet.cell(`F${cellIndex}`);
        valueCell.value(detailData[i].VALUE);

        cellIndex += 1;
      }

      detailData?.length % 2 !== 0 ? (cellIndex += 2) : (cellIndex += 1);
    } else if (section.DISPLAY_TYPE === "grid") {
      // Set the column names for the grid section
      const sectionColumns = section.METADATA.map((column) => column.LABEL);
      sheet
        .cell(`A${cellIndex}`)
        .value([sectionColumns])
        .style({ bold: true, fill: headerBackgroundColorThree });
      cellIndex += 1;

      // Set the row data for the grid section
      const sectionData = section.DATA.map((item) => {
        const row = section.METADATA.map(
          (column) => item[column.ACCESSOR] || ""
        );
        return row;
      });
      sheet.cell(`A${cellIndex}`).value(sectionData);
      cellIndex += sectionData.length + 1;
    } else if (section.DISPLAY_TYPE === "simpleGrid") {
      // Set the detail for the simpleGrid section
      const sectionColumnsLabel = section.DETAILS.map((column) => column.LABEL);
      sheet
        .cell(`A${cellIndex}`)
        .value([sectionColumnsLabel])
        .style({ bold: true });
      cellIndex += 1;

      const sectionColumnsValue = section.DETAILS.map((column) => column.VALUE);
      sheet.cell(`A${cellIndex}`).value([sectionColumnsValue]);
      cellIndex += 2;
    }
  }
  cellIndex += 2;
  sheet
    .cell(`A${cellIndex}`)
    .value(`Generated On : ${format(new Date(), "dd/MM/yyyy")}`);
  sheet.cell(`B${cellIndex}`).value(`Generated By : ${generatedBy}`);
  sheet
    .cell(`C${cellIndex}`)
    .value(`Requesting Branch Code : ${RequestingBranchCode}`);

  const aColumn = "A";
  const hColumn = "H";
  const lastRow = sheet.usedRange().endCell("down").rowNumber();
  const columnRange = sheet.range(`${aColumn}1:${hColumn}${lastRow}`);
  columnRange.style({
    border: true,
    borderColor: "000000",
  });

  const wbout = await wb.outputAsync();
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "statement_of_account.xlsx";
  link.click();

  URL.revokeObjectURL(url);
};
