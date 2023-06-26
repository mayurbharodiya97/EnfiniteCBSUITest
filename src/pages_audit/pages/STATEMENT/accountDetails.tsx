import {
  Box,
  Collapse,
  Dialog,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { GridWrapper } from "components/dataTableStatic/gridWrapper";
import { AccountDetailsGridMetaData } from "./gridMetaData";
import { GridMetaDataType } from "components/dataTable/types";
import AccountDetailsChild from "./accountDetailsChild";
import BranchDetails from "./branchDetails";
import AccountStatementDetails from "./accountStatementDetails";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as API from "./api";
import { useQuery } from "react-query";
import ProjectLogo from "assets/images/easy_bankcore_Logo.png";
const AccountDetails = () => {
  const [openBoxes, setOpenBoxes] = useState([false, false, false, true]);
  const [expandAll, setExpandAll] = useState(false);

  const handleBoxToggle = (index) => {
    setOpenBoxes((prevOpenBoxes) => {
      const updatedOpenBoxes = [...prevOpenBoxes];
      updatedOpenBoxes[index] = !updatedOpenBoxes[index];
      return updatedOpenBoxes;
    });

    console.log("HIIII");
  };

  const handleExpandAll = () => {
    const isAllExpanded = openBoxes.every((isOpen) => isOpen);

    setOpenBoxes((prevOpenBoxes) => prevOpenBoxes.map(() => !isAllExpanded));
    setExpandAll(!isAllExpanded);
  };

  const typographyTitleStyle = {
    fontFamily: "Montserrat, sans-serif",
    backgroundColor: "var(--theme-color4)",
    padding: "12px",
    color: "var(--theme-color1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: "1.3rem",
    borderRadius: "10px",
    cursor: "pointer",
  };

  const collapseableBox = {
    height: "auto",
    width: "100%",
    // marginBottom: "10px",
    // padding: "10px",
    display: "flex",
  };

  const openTypography = {
    padding: "12px",
  };

  const defaultOpendTypography = {
    ...typographyTitleStyle,
    ...openTypography,
  };

  const halfMainGrid = {
    height: "16rem",
    // padding: "10px",
    display: "flex",
  };
  const childGridFour = {
    // padding: "10px",
    display: "flex",
    flexDirection: "column",
  };
  const childGridEight = {
    padding: "0",
  };

  const typographyLable = {
    fontFamily: "Josefin Sans sans-serif",
    fontWeight: "900",
  };

  const typographyGridForLable = {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
  };
  const typographyForValue = {
    padding: "10px",
    fontFamily: "Josefin Sans sans-serif",
    fontWeight: "bold",
  };

  const colonStyle = {
    fontWeight: "bold",
  };

  const statementData = [
    {
      label: "Opening Balance",
      amount: "13,934.55",
    },
    {
      label: "Debit Amount",
      amount: "76,307.32",
      countLabel: "Debit Count",
      count: "25",
    },
    {
      label: "Credit Amount",
      amount: "88,059.00",
      countLabel: "Credit Count",
      count: "3",
    },
    {
      label: "Closing Balance",
      amount: "25,686.23",
    },
  ];

  const branchDetailsDataLeft = [
    { label: "Branch Name", value: "Sachawala Mohd Sajid M" },
    { label: "Branch Address", value: "Not Applicable" },
    { label: "Branch Phone Number", value: "Not Applicable" },
  ];
  const branchDetailsDataRight = [
    { label: "IFSC code", value: "6th May 2011" },
    { label: "MICR code", value: "Account Open Regular" },
  ];

  const accountDetailsDataLeft = [
    { label: "Customer Name", value: "Sachawala Mohd Sajid M" },
    { label: "Joint holder name 1", value: "Not Applicable" },
    { label: "Joint holder name 2", value: "Not Applicable" },
    { label: "Currency", value: "INR" },
    { label: "Nominee", value: "Registered" },
  ];
  const accountDetailsDataRight = [
    { label: "Account opened on", value: "6th May 2011" },
    { label: "Account Status", value: "Account Open Regular" },
    { label: "Limit", value: "0.00" },
    { label: "Hold balance", value: "0.00" },
  ];

  const { data, isLoading, isFetching, refetch, error, isError } = useQuery<
    any,
    any
  >(["StatementDetailsData"], () => API.StatementDetailsData());

  const generatePDF = () => {
    const doc: any = new jsPDF();
    const margin = 10;
    let x = margin;
    let y = margin + 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    // Add the bank logo in the header
    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = margin;
    const logoY = margin;
    doc.addImage(ProjectLogo, "PNG", logoX, logoY, 0, 0);

    // Add the bank name and address in the header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const bankNameX = logoX + logoWidth + 120;
    const bankNameY = logoY + 7; // Adjust the vertical position as needed
    doc.text("DEMO BANK LTD", bankNameX, bankNameY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const bankAddressX = bankNameX;
    const bankAddressY = bankNameY + 6; // Adjust the vertical position as needed
    doc.text("123 Bank Street, City", bankAddressX, bankAddressY);

    // Draw a horizontal line below the header
    const lineY = bankAddressY + 8; // Adjust the vertical position as needed
    const lineWidth = pageWidth - margin * 2; // Set the line width to the page width minus the left and right margins
    const lineX = margin;
    doc.setLineWidth(0.5);
    doc.line(lineX, lineY, lineX + lineWidth, lineY);

    y += 20;
    //add account details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("", x, y);
    y += 1;

    // Set the header for the combined table
    const header = [["", "ACCOUNT DETAILS", "", ""]];

    // Create the combined table
    doc.autoTable({
      startX: x,
      startY: y,
      head: header,
      body: accountDetailsDataLeft.map((item, index) => [
        item.label,
        item.value,
        accountDetailsDataRight[index]?.label || "",
        accountDetailsDataRight[index]?.value || "",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [150, 150, 150],
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        textColor: [80, 80, 80],
        fontSize: 10,
      },
      margin: { top: 10 },
      didDrawCell: (data) => {
        if (data.section === "body" && data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
      tableWidth: doc.internal.pageSize.width - margin * 2 - 10,
      tableHeight: "auto",
    });

    y += 35;

    //Add branch details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("", x, y);
    y += 20;

    // Set the header for the combined table
    const branchheader = [["", "BRANCH DETAILS", "", ""]];

    // Create the combined table
    doc.autoTable({
      startX: x,
      startY: y,
      head: branchheader,
      body: branchDetailsDataLeft.map((item, index) => [
        item.label,
        item.value,
        branchDetailsDataRight[index]?.label || "",
        branchDetailsDataRight[index]?.value || "",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [150, 150, 150],
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        textColor: [80, 80, 80],
        fontSize: 10,
      },
      margin: { top: 10 },
      didDrawCell: (data) => {
        if (data.section === "body" && data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
      tableWidth: doc.internal.pageSize.width - margin * 2 - 10,
      tableHeight: "auto",
    });

    y += 20;

    // Add statement details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("", x, y);
    y += 20;

    // Define the statement details table data
    const statementDetailsData = [
      ["", "ACCOUNT STATEMENT DETAILS", "", ""],
      ["Opening Balance", "Debit Amount", "Credit Amount", "Closing Balance"],
      [
        statementData[0].amount,
        statementData[1].amount,
        statementData[2].amount,
        statementData[3].amount,
      ],
      ["", "Debit Count", "Credit Count", ""],
      ["", statementData[1].count, statementData[2].count, ""],
    ];

    // Create the statement details table
    doc.autoTable({
      startY: y,
      head: statementDetailsData.slice(0, 1),
      body: statementDetailsData.slice(1),
      theme: "grid",
      headStyles: {
        fillColor: [150, 150, 150],
        textColor: [255, 255, 255],
        fontSize: 10,
        halign: "center",
      },
      bodyStyles: {
        textColor: [80, 80, 80],
        fontSize: 10,
      },
      margin: { top: 10 },
      didDrawCell: (data) => {
        if (data.section === "body" && data.row.index % 2 === 0) {
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
      tableWidth: doc.internal.pageSize.width - margin * 2 - 10,
      tableHeight: "auto",
    });
    const tableHeaders = AccountDetailsGridMetaData.columns.map(
      (item) => item.columnName
    );

    const tableData = data.map((item) => {
      const rowData: any[] = [];
      AccountDetailsGridMetaData.columns.forEach((column) => {
        const accessor = column.accessor;
        rowData.push(item[accessor]);
      });
      return rowData;
    });

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 190,
    });

    // Save the PDF document
    doc.save("dummy_table.pdf");
  };

  return (
    <Dialog fullScreen={true} open={true}>
      <Grid
        container
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Grid
          item
          sx={{
            minHeight: "100vh",
            width: "90%",
            padding: "10px 0px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontFamily: "Montserrat, sans-serif",
              backgroundColor: "var(--theme-color3)",
              padding: "10px",
              textAlign: "center",
              marginBottom: "20px",
              color: "var(--theme-color2)",
              borderRadius: "10px",
              display: "flex",
              fontSize: "24px",
            }}
          >
            <Grid
              item
              xs={11}
              sm={11}
              md={11}
              lg={11}
              xl={11}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={handleExpandAll}
            >
              Account Statement{" "}
            </Grid>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              lg={1}
              xl={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
              }}
            >
              {" "}
              <IconButton onClick={generatePDF}>
                <DownloadRoundedIcon sx={{ color: "var(--theme-color2)" }} />
              </IconButton>
              <IconButton
                onClick={handleExpandAll}
                sx={{ color: "var(--theme-color2)" }}
              >
                {!expandAll ? (
                  <KeyboardDoubleArrowDownIcon />
                ) : (
                  <KeyboardDoubleArrowUpIcon />
                )}
              </IconButton>
            </Grid>
          </Typography>

          <Typography
            onClick={() => handleBoxToggle(0)}
            variant="h5"
            sx={typographyTitleStyle}
          >
            Account Details
            {!openBoxes[0] ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowUpIcon />
            )}
          </Typography>
          <Collapse in={openBoxes[0]}>
            <AccountDetailsChild
              collapseableBox={collapseableBox}
              halfMainGrid={halfMainGrid}
              childGridFour={childGridFour}
              typographyGridForLable={typographyGridForLable}
              typographyLable={typographyLable}
              colonStyle={colonStyle}
              childGridEight={childGridEight}
              typographyForValue={typographyForValue}
              accountDetailsDataLeft={accountDetailsDataLeft}
              accountDetailsDataRight={accountDetailsDataRight}
            />
          </Collapse>

          <Typography
            onClick={() => handleBoxToggle(1)}
            variant="h5"
            sx={typographyTitleStyle}
          >
            Branch Details
            {!openBoxes[1] ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowUpIcon />
            )}
          </Typography>
          <Collapse in={openBoxes[1]}>
            <BranchDetails
              collapseableBox={collapseableBox}
              halfMainGrid={halfMainGrid}
              childGridFour={childGridFour}
              typographyGridForLable={typographyGridForLable}
              typographyLable={typographyLable}
              colonStyle={colonStyle}
              childGridEight={childGridEight}
              typographyForValue={typographyForValue}
              branchDetailsDataLeft={branchDetailsDataLeft}
              branchDetailsDataRight={branchDetailsDataRight}
            />
          </Collapse>
          <Typography
            onClick={() => handleBoxToggle(2)}
            variant="h5"
            sx={typographyTitleStyle}
          >
            Account Statement Details
            {!openBoxes[2] ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowUpIcon />
            )}
          </Typography>

          <Collapse in={openBoxes[2]}>
            <AccountStatementDetails
              collapseableBox={collapseableBox}
              statementData={statementData}
            />
          </Collapse>
          <Typography variant="h5" sx={defaultOpendTypography}>
            Statement Details Table
          </Typography>
          <Box
            sx={{
              height: "fit-content",
              width: "100%",
              marginBottom: "20px",
              backgroundColor: "var(--theme-color2)",
              padding: "10px",
              border: "2px solid var(--theme-color4)",
              borderRadius: "0000006px",
            }}
          >
            <GridWrapper
              key={`statementdetails`}
              finalMetaData={AccountDetailsGridMetaData as GridMetaDataType}
              data={[]}
              setData={() => null}
              headerToolbarStyle={{
                background: "inherit",
                color: "black",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default AccountDetails;
