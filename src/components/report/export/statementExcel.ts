import { utils } from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import { AccountDetailsGridMetaData } from "pages_audit/pages/STATEMENT/gridMetaData";

export const ExcelForStatementExport = async ({
  data,
  columns,
  companyName,
}) => {
  let otherDetailsExcelLeft = {
    Name: "MR. SACHAWALA MOHD SAJID M",
    Company_address:
      "C/O ACUTE SOFTWARES PVT LTD, 203 ATLANTA TOWER GULBAI TEKRA, AHMEDABAD 380006, GUJARAT, INDIA",
    Nominee: " Registered",
    Statement_period: " Statement from 01/06/2023 to 25/06/2023",
  };

  let otherDetailsExcelRight = {
    Account_branch: "NAVRANGPURA",
    Address:
      " ASTRAL TOWERS\nOPP RELIANCE GEN.INSU,\nNEAR MITHAKALI SIX ROAD,NAVRANGPURA",
    City: " AHMEDABAD 380 009",
    State: " GUJARAT",
    Phone_no: " 18002026161",
    Email: " sajid.sachawala@acuteinformatics.in",
    OD_Limit: " 0.00   Currency: INR",
    Cust_ID: " 39273491",
    Account_No: " 00061050324373     PB Customer",
    AC_Open_Date: " 06/05/2011",
    Account_Status: " Regular",
    RTGS_NEFT_IFSC: " HDFC0000006   MICR: 380240002",
  };

  let statementSummary = {
    Opening_Balance: 25686.23,
    Debits: 10,
    Credits: 20,
    Closing_Bal: 25.6,
    Dr_Count: 37,
    Cr_Count: 14,
  };

  let otherDetailsLast = {
    Generated_On: "26-Jun-2023 12:46",
    Generated_By: 39273491,
    Requesting_Branch_Code: "NET",
  };
  console.log(companyName, "companyName");
  const wb = await XlsxPopulate.fromBlankAsync();

  const sheet = wb.sheet("Sheet1");
  let cellIndex = 1;
  let isLength = 0;

  const columnB = sheet.column("B");
  columnB.width(40);
  columnB.style({ wrapText: true });
  const columnE = sheet.column("E");
  columnE.width(40);
  columnE.style({ wrapText: true });

  // Set the company name and merge the cells
  const companyNameCell = sheet.cell(`A${cellIndex}`);
  companyNameCell.value(companyName);
  const headerBackgroundColor = "B4C6E7";
  // Set the background color of the company name
  companyNameCell.style("fill", headerBackgroundColor);

  companyNameCell.style({ horizontalAlignment: "center", bold: true });
  sheet.range(`A${cellIndex}:H${cellIndex}`).merged(true);
  cellIndex += 2;

  if (
    Object.keys(otherDetailsExcelLeft).length >
    Object.keys(otherDetailsExcelRight).length
  ) {
    isLength = Object.keys(otherDetailsExcelLeft).length;
  } else {
    isLength = Object.keys(otherDetailsExcelRight).length;
  }
  let leftKeys = Object.keys(otherDetailsExcelLeft);
  let rigthKeys = Object.keys(otherDetailsExcelRight);
  for (let i = 0; i < isLength; i++) {
    if (leftKeys[i]) {
      const keyCell = sheet.cell(`A${cellIndex}`);
      const valueCell = sheet.cell(`B${cellIndex}`);
      keyCell.value(leftKeys[i].trim()).style({ bold: true }); // Bold the key
      valueCell.value(otherDetailsExcelLeft[leftKeys[i]].trim());
    }
    if (rigthKeys[i]) {
      const keyCell = sheet.cell(`D${cellIndex}`);
      const valueCell = sheet.cell(`E${cellIndex}`);
      keyCell.value(rigthKeys[i].trim()).style({ bold: true }); // Bold the key
      valueCell.value(otherDetailsExcelRight[rigthKeys[i]].trim());
    }
    cellIndex += 1;
  }

  const columnNames = columns?.map((column) => column.columnName);

  const columnAccessors = columns?.map((column) => column.accessor);

  cellIndex += 2;

  // columnAccessors.forEach((item, index) => {
  sheet
    .cell(`A${cellIndex}`)
    .value([columnNames])
    .style({ bold: true, fill: headerBackgroundColor });
  cellIndex += 1;

  const rowData: any = [];

  data.forEach((item) => {
    const row = columnAccessors.map((accessor) => item[accessor] || "");
    rowData.push(row);
    console.log(row, "row");
  });
  sheet.cell(`A${cellIndex}`).value(rowData);
  cellIndex += 5;

  const statementSummaryCell = sheet.cell(`A${cellIndex}`);
  statementSummaryCell.value("STATEMENT SUMMARY");
  // Set the background color of the company name
  statementSummaryCell.style("fill", headerBackgroundColor);

  statementSummaryCell.style({ horizontalAlignment: "center", bold: true });
  sheet.range(`A${cellIndex}:H${cellIndex}`).merged(true);
  cellIndex += 2;
  let statementSummaryKeys = Object.keys(statementSummary);

  sheet
    .cell(`A${cellIndex}`)
    .value([statementSummaryKeys])
    .style({ bold: true });
  cellIndex += 1;

  let statementSummaryValues = Object.values(statementSummary);

  sheet.cell(`A${cellIndex}`).value([statementSummaryValues]);

  cellIndex += 2;

  let otherDetailsLastKeys = Object.keys(otherDetailsLast);
  let otherDetailsLastLength = otherDetailsLastKeys.length;

  // Create an array to store the row data
  const lastDetailsRowData = [
    otherDetailsLastKeys.map((key) => `${key} : ${otherDetailsLast[key]}`),
  ];

  // Add the row data to the sheet
  sheet.cell(`A${cellIndex}`).value(lastDetailsRowData);

  cellIndex += 2;

  sheet
    .cell(`A${cellIndex}`)
    .value("State account branch GSTN:")
    .style({ bold: true });
  sheet.cell(`B${cellIndex}`).value("24OOOAB2702A2B3");

  const aColumn = "A";
  const hColumn = "H";

  // Get the last row with data in the specified column
  const lastRow = sheet.usedRange().endCell("down").rowNumber();

  // Select the column range
  const columnRange = sheet.range(`${aColumn}1:${hColumn}${lastRow}`);

  // Apply borders to the column range
  columnRange.style({
    border: true, // Apply borders to all sides
    borderColor: "000000", // Specify the border color (optional)
  });

  const wbout = await wb.outputAsync();
  const blob = new Blob([wbout], { type: "application/octet-stream" });

  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "statement_of_account.xlsx";
  link.click();

  // Clean up the URL object
  URL.revokeObjectURL(url);
};
